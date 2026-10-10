/**
 * The billing decisions that must be testable, kept free of every runtime.
 *
 * This module imports nothing. That is deliberate: the edge functions in
 * `supabase/functions/` import it over a relative path and run under Deno,
 * while `src/lib/billingWebhookCore.test.ts` runs it under Vitest and Node.
 * The only capability it needs is `crypto.subtle`, which both provide as a
 * global.
 *
 * Nothing here touches the network, the database, or `Deno.env`. The edge
 * functions are the I/O shells around it; everything that decides *what to do*
 * lives here, where a test can drive it.
 */

export type SubscriptionStatus = 'created' | 'active' | 'cancelled' | 'halted' | 'completed';
export type BillingPlanCode = 'monthly' | 'yearly';
export type BillingCurrency = 'INR' | 'USD';

const hex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

/** SHA-256 of `value`, lowercase hex. */
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return hex(digest);
}

/** HMAC-SHA256 of `message` under `secret`, lowercase hex. */
export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return hex(signature);
}

/**
 * Constant-time string comparison.
 *
 * Both inputs must be secrets-derived before this is called. The early return
 * on a length mismatch does leak the length, which is unavoidable and is not
 * secret — every HMAC-SHA256 signature is 64 hex characters.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface EventEffect {
  /** What `subscriptions.status` becomes. */
  status: SubscriptionStatus;
  /**
   * Whether this event may write `entitlements.expires_at` forward.
   *
   * Separate from `status` on purpose: "what is this subscription now" and
   * "does this buy more time" are different questions. Collapsing them is how
   * `halted` — the last payment failed — would come to extend a paid period.
   */
  writesEntitlement: boolean;
}

const EFFECTS = new Map<string, EventEffect>([
  ['subscription.activated', { status: 'active', writesEntitlement: true }],
  ['subscription.charged', { status: 'active', writesEntitlement: true }],
  ['subscription.cancelled', { status: 'cancelled', writesEntitlement: false }],
  ['subscription.halted', { status: 'halted', writesEntitlement: false }],
  ['subscription.completed', { status: 'completed', writesEntitlement: false }],
]);

/**
 * What an event type means, or `null` for "not ours — answer 200 and move on".
 *
 * `null` rather than a throw, because the webhook is auto-disabled after 24
 * hours of non-2xx and Razorpay exposes no delivery-log API. An event type we
 * do not handle is routine, not an error.
 *
 * A `Map`, not an object literal. `EFFECTS[eventType] ?? null` on an object
 * literal still finds `Object.prototype`'s own keys, so `'constructor'`,
 * `'toString'` and `'hasOwnProperty'` return inherited functions where this
 * signature promises `EventEffect | null`. A Map's key space is exactly what
 * was put in it, so `get` returns `undefined` for all three.
 */
export const effectForEvent = (eventType: string): EventEffect | null =>
  EFFECTS.get(eventType) ?? null;

/**
 * The dedupe key for a delivery.
 *
 * Razorpay's `X-Razorpay-Event-Id` when present; otherwise a digest of the raw
 * body, so a missing header cannot defeat deduplication.
 */
export async function eventIdFor(eventIdHeader: string | null, rawBody: string): Promise<string> {
  const header = (eventIdHeader ?? '').trim();
  if (header) return header;
  return `body:${await sha256Hex(rawBody)}`;
}

const isBillingPlan = (value: unknown): value is BillingPlanCode =>
  value === 'monthly' || value === 'yearly';

const isBillingCurrency = (value: unknown): value is BillingCurrency =>
  value === 'INR' || value === 'USD';

export type CreateSubscriptionRequest =
  | { ok: true; plan: BillingPlanCode; currency: BillingCurrency }
  | { ok: false; error: string };

/**
 * Validate a create-subscription body down to exactly the two catalogue keys.
 *
 * The returned object carries `plan` and `currency` and nothing else, so a
 * body that also carried `amount`, `price`, `razorpay_plan_id` or `user_id`
 * cannot leak those values into the caller by accident. The caller reads the
 * price and the plan id from `billing_plans`, keyed on these two literals, and
 * the user id from the JWT.
 */
export function parseCreateSubscriptionRequest(body: unknown): CreateSubscriptionRequest {
  const candidate = (body ?? {}) as Record<string, unknown>;
  const { plan, currency } = candidate;
  if (!isBillingPlan(plan) || !isBillingCurrency(currency)) {
    return { ok: false, error: 'plan and currency must be one of the supported values.' };
  }
  return { ok: true, plan, currency };
}
