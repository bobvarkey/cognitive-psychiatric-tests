// The subscription path: the browser's entire surface onto Razorpay
// Subscriptions, plus the two things it is allowed to know about the server.
//
// The rule this module exists to keep: the browser may name a plan and a
// currency, and nothing else. Every amount, every Razorpay plan id and every
// access decision comes back from the server. Nothing here writes an
// entitlement, and nothing here stores that one was granted.

import type { Entitlement } from '@/lib/entitlement';
import { currentEntitlement } from '@/lib/entitlement';
import { WEB_PRICES } from '@/lib/webBilling';

export type BillingPlanCode = 'monthly' | 'yearly';
export type BillingCurrency = 'INR' | 'USD';

export interface BillingPlan {
  code: BillingPlanCode;
  currency: BillingCurrency;
  /** Minor units — paise or cents, exactly as Razorpay reports them. */
  amount: number;
  intervalUnit: 'month' | 'year';
  label: string;
}

/**
 * The catalogue to display when the server read has not landed.
 *
 * The paywall must state the amount *before* the user authorizes a charge
 * (spec §9), so it cannot show nothing while the read is in flight. This is
 * that display value and only that: it is never sent anywhere, and a test
 * compares it against the migration that seeds the server's table so the two
 * cannot drift.
 */
export function fallbackBillingPlans(): BillingPlan[] {
  const label: Record<BillingPlanCode, string> = {
    monthly: 'PsyCognito Premium — Monthly',
    yearly: 'PsyCognito Premium — Yearly',
  };
  return (['INR', 'USD'] as const).flatMap((currency) =>
    (['monthly', 'yearly'] as const).map((code) => ({
      code,
      currency,
      amount: WEB_PRICES[currency][code].amount,
      intervalUnit: code === 'monthly' ? ('month' as const) : ('year' as const),
      label: label[code],
    })),
  );
}

/** The server catalogue. Falls back to the display list if the read fails. */
export async function fetchBillingPlans(): Promise<BillingPlan[]> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('billing_plans')
      .select('code, currency, amount, interval_unit, label');
    if (error || !data?.length) return fallbackBillingPlans();
    return data.map((row) => ({
      code: row.code as BillingPlanCode,
      currency: row.currency as BillingCurrency,
      amount: Number(row.amount),
      intervalUnit: row.interval_unit === 'year' ? 'year' : 'month',
      label: String(row.label),
    }));
  } catch {
    return fallbackBillingPlans();
  }
}

export interface CheckoutHandle {
  subscriptionId: string;
  keyId: string;
  amount: number;
  currency: string;
  label: string;
}

/**
 * Create the subscription on the server, then open Razorpay Checkout against
 * the id it returned.
 *
 * The order matters. The subscription exists on Razorpay before the modal is
 * shown, so the amount the user sees comes from the same row the server will
 * bill against.
 */
export async function startSubscription(
  plan: BillingPlanCode,
  currency: BillingCurrency,
): Promise<CheckoutHandle> {
  const { supabase } = await import('@/integrations/supabase/client');
  // plan and currency only. No price, no amount, no user id: the server reads
  // all three from its own catalogue and the caller's JWT.
  const { data, error } = await supabase.functions.invoke('billing-create-subscription', {
    body: { plan, currency },
  });
  if (error || !data?.subscriptionId) {
    throw new Error(data?.error ?? 'Could not start checkout.');
  }
  return {
    subscriptionId: String(data.subscriptionId),
    keyId: String(data.keyId ?? ''),
    amount: Number(data.amount ?? 0),
    currency: String(data.currency ?? currency),
    label: String(data.label ?? 'PsyCognito Premium'),
  };
}

const loadRazorpay = (): Promise<any> =>
  new Promise((resolve, reject) => {
    const w = window as any;
    if (w.Razorpay) return resolve(w.Razorpay);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => (w.Razorpay ? resolve(w.Razorpay) : reject(new Error('Checkout failed to load.')));
    s.onerror = () => reject(new Error('Checkout could not be loaded. Check your connection.'));
    document.body.appendChild(s);
  });

export interface CheckoutResult {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}

/**
 * Standard Checkout, keyed on `subscription_id` rather than `order_id`.
 *
 * Rejects with `{ userCancelled: true }` when the buyer dismisses the modal, so
 * callers can tell a deliberate dismissal from a failure and stay quiet about
 * the first.
 */
export async function openCheckout(
  handle: CheckoutHandle,
  email: string,
): Promise<CheckoutResult> {
  const Razorpay = await loadRazorpay();
  return new Promise<CheckoutResult>((resolve, reject) => {
    const rzp = new Razorpay({
      key: handle.keyId,
      subscription_id: handle.subscriptionId,
      name: 'PsyCognito',
      description: handle.label,
      prefill: { email },
      handler: (resp: any) =>
        resolve({
          paymentId: String(resp?.razorpay_payment_id ?? ''),
          subscriptionId: String(resp?.razorpay_subscription_id ?? handle.subscriptionId),
          signature: String(resp?.razorpay_signature ?? ''),
        }),
      modal: { ondismiss: () => reject({ userCancelled: true }) },
    });
    rzp.on?.('payment.failed', (r: any) => reject(new Error(r?.error?.description ?? 'Payment failed.')));
    rzp.open();
  });
}

/**
 * Ask the server to check the checkout signature.
 *
 * This proves the payment is real. It does not grant access, and the caller
 * must not behave as though it did — the webhook is the source of truth.
 */
export async function verifyCheckout(result: CheckoutResult): Promise<void> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.functions.invoke('billing-verify-checkout', {
    body: {
      razorpay_payment_id: result.paymentId,
      razorpay_subscription_id: result.subscriptionId,
      razorpay_signature: result.signature,
    },
  });
  if (error || !data?.verified) {
    throw new Error(data?.error ?? 'Payment could not be verified.');
  }
}

/** Cancel the caller's active subscription at the end of the paid cycle. */
export async function cancelSubscription(): Promise<void> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.functions.invoke('billing-cancel', { body: {} });
  if (error || !data?.cancelled) {
    throw new Error(data?.error ?? 'Could not cancel the subscription.');
  }
}

export const WAIT_FOR_ENTITLEMENT_TIMEOUT_MS = 30000;
export const WAIT_FOR_ENTITLEMENT_INTERVAL_MS = 2000;

/**
 * Poll the server until it grants access, or until the deadline passes.
 *
 * Resolves `null` rather than rejecting at the deadline. A webhook that has not
 * landed is not a failed payment, and telling a buyer their payment failed when
 * it succeeded is worse than telling them it is still activating.
 */
export async function waitForEntitlement(opts?: {
  timeoutMs?: number;
  intervalMs?: number;
}): Promise<Entitlement | null> {
  const timeoutMs = opts?.timeoutMs ?? WAIT_FOR_ENTITLEMENT_TIMEOUT_MS;
  const intervalMs = opts?.intervalMs ?? WAIT_FOR_ENTITLEMENT_INTERVAL_MS;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    try {
      const grant = await currentEntitlement();
      if (grant) return grant;
    } catch {
      // A failed poll means "not yet known", not "no". Keep waiting.
    }
    if (Date.now() >= deadline) return null;
  }
}
