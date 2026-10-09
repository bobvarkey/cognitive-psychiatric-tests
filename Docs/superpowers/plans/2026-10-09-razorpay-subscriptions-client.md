# Razorpay Subscriptions — Plan B: the client surface, retirement and backfill

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Point the paywall at the server's subscription path, make `/account` the public place where a person signs in, sees their plan and manages billing, retire the one-time-order path from `webBilling.ts`, and backfill the buyers who paid under it.

**Architecture:** One new client module, `src/lib/billing.ts`, holds the catalogue read and the four subscription calls. `webBilling.ts` shrinks to the dev-only unlock plus the restore-by-verified-email flow, which now ends in a server write instead of a `localStorage` flag. `SubscriptionContext` stops treating the browser-written `WebPremium` record as an access source and starts polling the server after checkout, which is what makes access appear without a manual refresh.

**Tech Stack:** Vite + React 18 + TypeScript, react-router-dom v7, Supabase (`@supabase/supabase-js` ^2.116.0) with Postgres RLS + SQL functions, Tailwind + shadcn/ui, Vitest 4 + @testing-library/react (jsdom)

**Spec:** `Docs/superpowers/specs/2026-10-09-razorpay-subscriptions-design.md`

**Companion plan:** `Docs/superpowers/plans/2026-10-09-razorpay-subscriptions-server.md` (Plan A) must be deployed first. Plan B calls `billing-create-subscription`, `billing-verify-checkout`, `billing-cancel` and `billing-restore`, and reads `billing_plans`. Task 7 here deletes the three order-path functions Plan A left in place on purpose.

## Global Constraints

- **Server-owned catalogue.** The client sends `{ plan, currency }` and nothing else. It never sends a price, an amount, a plan id, or a user id, and it never displays an amount it did not read from `billing_plans` (or from the checked-in fallback in Task 1, which a test pins to the migration's seed).
- **`localStorage` is not an access source for billing.** The one remaining term is the dev-only developer unlock, and it must stay behind `import.meta.env.DEV` so the minifier strips it from production builds. **Five tests in `src/lib/webBilling.test.ts` pin that and must keep passing unmodified.**
- **A valid checkout signature grants nothing.** After `billing-verify-checkout` returns, the client polls `current_entitlement()`; it never writes an entitlement and never assumes one.
- **Never cache authenticated responses or payment data.**
- **No auth tokens in IndexedDB. No Electron, Tauri or SQLite.**
- **Do not rebuild, restyle, or replace auth**, and do not deploy or enable live billing.
- **A failed payment never marks the user paid**, and the developer grant is never removed by anything here.
- **Operator-only steps** are called out where they occur.

## Review Focus

The five failure modes the spec implies that a happy-path test would not otherwise reach. Each has a test in the task that owns the code.

1. **Showing a price the server will not charge.** The paywall must state the amount before authorization, so the amount it shows has to be the amount Razorpay bills. A fallback constant that drifts from the migration's seed silently breaks that promise in the window before the fetch lands. Pinned in Task 1 by a test that reads the migration file and compares.
2. **Granting access from the browser after checkout.** The whole point of moving to the webhook is that the callback proves nothing durable. Pinned in Task 4: after a verified checkout the modal must still read `activating`, not `unlocked`, until the server answers.
3. **A dead end after paying.** If the client gives up the moment the poll times out, a buyer whose webhook is slow sees a failure for a payment that succeeded. Pinned in Task 4 by the timeout message, which says *still activating*, never *failed*.
4. **A `localStorage` flag granting access in a production build.** This is the class of bug the five pinned tests exist for. Pinned in Task 3, whose new context tests assert the dev term is absent when `DEV` is false.
5. **A restored purchase writing a browser flag instead of a server row.** That would reproduce the exact bug being retired. Pinned in Task 2, which asserts the restore path calls `billing-restore` and writes no `STORE_KEY`.

---

### Task 1: `src/lib/billing.ts` — the catalogue and the subscription calls

**Files:**
- Create: `src/lib/billing.ts`
- Test: `src/lib/billing.test.ts`

**Interfaces:**
- Consumes: `WEB_PRICES` from `@/lib/webBilling` (kept, corrected); `currentEntitlement`, `type Entitlement` from `@/lib/entitlement`; `@/integrations/supabase/client`.
- Produces, from `src/lib/billing.ts`:
  - `interface BillingPlan { code: 'monthly' | 'yearly'; currency: 'INR' | 'USD'; amount: number; intervalUnit: 'month' | 'year'; label: string }`
  - `fetchBillingPlans(): Promise<BillingPlan[]>` — the server catalogue, with `fallbackBillingPlans()` when the read fails
  - `fallbackBillingPlans(): BillingPlan[]` — derived from `WEB_PRICES`, display-only
  - `startSubscription(plan, currency): Promise<{ subscriptionId: string; keyId: string; amount: number; currency: string; label: string }>`
  - `openCheckout(...)` — the Standard Checkout call, returning `{ paymentId, subscriptionId, signature }`
  - `verifyCheckout(paymentId, subscriptionId, signature): Promise<void>`
  - `cancelSubscription(): Promise<void>`
  - `waitForEntitlement({ timeoutMs, intervalMs }?): Promise<Entitlement | null>`

**Why a fallback at all, and why it is tested against the migration.** Spec §9 requires the amount to be shown *before authorization*. If the catalogue read is the only source, a slow connection means the paywall either shows nothing or shows a placeholder at the moment the user is deciding to pay. So there is a checked-in fallback — and because a fallback that disagrees with the server is worse than no fallback, a test reads `supabase/migrations/20261009120000_billing_plans.sql` and fails if the two ever diverge.

**Why `WAIT_FOR_ENTITLEMENT_*` are constants and not inline.** The spec names 2 s and 30 s as the observable behaviour, so they are the contract, not an implementation detail. Naming them lets the test assert the loop's shape without a real clock.

- [ ] **Step 1: Write the failing test**

Create `src/lib/billing.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const functionsInvoke = vi.hoisted(() => vi.fn());
const currentEntitlement = vi.hoisted(() => vi.fn());

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: functionsInvoke } },
}));
vi.mock('@/lib/entitlement', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/entitlement')>()),
  currentEntitlement,
}));

import { fallbackBillingPlans, waitForEntitlement } from './billing';

describe('fallbackBillingPlans', () => {
  it('agrees with the migration that seeds the server catalogue', () => {
    // The paywall shows an amount before the user authorizes a charge. If this
    // fallback disagreed with the server, the app would quote one price and
    // bill another — the precise promise spec §9 exists to make.
    //
    // `process.cwd()` rather than `__dirname`: Vitest loads test files as ESM,
    // where `__dirname` is not defined, and it runs with the project root as the
    // working directory.
    const sql = readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/20261009120000_billing_plans.sql'),
      'utf8',
    );
    const seeded = [...sql.matchAll(
      /\(\s*'(monthly|yearly)',\s*'(INR|USD)',\s*(\d+),\s*'(month|year)',/g,
    )].map(([, code, currency, amount, intervalUnit]) => ({
      code: code as 'monthly' | 'yearly',
      currency: currency as 'INR' | 'USD',
      amount: Number(amount),
      intervalUnit: intervalUnit as 'month' | 'year',
    }));

    expect(seeded).toHaveLength(4);
    const byKey = (a: { currency: string; code: string }, b: { currency: string; code: string }) =>
      `${a.currency}${a.code}`.localeCompare(`${b.currency}${b.code}`);

    expect(
      fallbackBillingPlans()
        .map(({ code, currency, amount, intervalUnit }) => ({ code, currency, amount, intervalUnit }))
        .sort(byKey),
    ).toEqual(seeded.sort(byKey));
  });

  it('quotes the ₹299 / ₹2,999 prices the spec decided on', () => {
    expect(fallbackBillingPlans().find((p) => p.code === 'monthly' && p.currency === 'INR')?.amount).toBe(29900);
    expect(fallbackBillingPlans().find((p) => p.code === 'yearly' && p.currency === 'INR')?.amount).toBe(299900);
  });

  it('has a row for every plan and currency pair', () => {
    const plans = fallbackBillingPlans();
    expect(plans).toHaveLength(4);
    for (const currency of ['INR', 'USD'] as const) {
      for (const code of ['monthly', 'yearly'] as const) {
        expect(plans.some((p) => p.code === code && p.currency === currency)).toBe(true);
      }
    }
  });
});

describe('waitForEntitlement', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    currentEntitlement.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the grant as soon as the server has one', async () => {
    const grant = { plan: 'monthly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false };
    currentEntitlement.mockResolvedValue(grant);

    await expect(waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 })).resolves.toEqual(grant);
    expect(currentEntitlement).toHaveBeenCalledTimes(1);
  });

  it('keeps polling while the server has nothing, then resolves', async () => {
    currentEntitlement
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ plan: 'yearly', source: 'razorpay', expiresAt: null, permanent: false });

    const pending = waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toMatchObject({ plan: 'yearly' });
    expect(currentEntitlement).toHaveBeenCalledTimes(3);
  });

  it('resolves null at the deadline rather than rejecting', async () => {
    // A slow webhook is not a failed payment. Rejecting here would turn a
    // successful charge into an error message.
    currentEntitlement.mockResolvedValue(null);

    const pending = waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(30000);
    await expect(pending).resolves.toBeNull();
  });

  it('treats a throwing poll as "not yet", not as a failure', async () => {
    currentEntitlement.mockRejectedValue(new Error('network'));

    const pending = waitForEntitlement({ timeoutMs: 4000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(4000);
    await expect(pending).resolves.toBeNull();
  });

  it('never polls more often than the interval', async () => {
    currentEntitlement.mockResolvedValue(null);

    const pending = waitForEntitlement({ timeoutMs: 10000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(999);
    expect(currentEntitlement).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(10000);
    await pending;
    expect(currentEntitlement.mock.calls.length).toBeLessThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `npx vitest run src/lib/billing.test.ts`

Expected: FAIL — `Failed to resolve import "./billing"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/billing.ts`:

```ts
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
```

- [ ] **Step 4: Correct the INR prices in `webBilling.ts`**

The fallback reads `WEB_PRICES`, which still carries the old ₹249. In `src/lib/webBilling.ts`, change the `INR` block of `WEB_PRICES` to:

```ts
  INR: {
    monthly: { amount: 29900, display: '₹299' },
    yearly: { amount: 299900, display: '₹2,999' },
  },
```

- [ ] **Step 5: Run the tests and watch them pass**

Run: `npx vitest run src/lib/billing.test.ts`

Expected: PASS, 8 tests.

- [ ] **Step 6: Run the whole suite**

Run: `npm test`

Expected: green. `AdBanner` and `AssessmentSelector` render `WEB_PRICES` and the INR change is cosmetic.

- [ ] **Step 7: Commit**

```bash
git add src/lib/billing.ts src/lib/billing.test.ts src/lib/webBilling.ts
git commit -m "feat(billing): add the subscription client and align the INR prices"
```

---

### Task 2: Retire the order path from `webBilling.ts`

**Files:**
- Modify: `src/lib/webBilling.ts`
- Modify: `src/lib/webBilling.test.ts`

**Interfaces:**
- Consumes: `billing-restore` from Plan A Task 7.
- Produces: `webBilling.ts` exports `WEB_PRICES`, `WebCurrency`, `yearlySavingPercent`, `getWebCurrency`, `parseDeveloperEmails`, `DEVELOPER_EMAILS`, `isDeveloperEmail`, `STORE_KEY` (module-private), `type WebPremium`, `getWebPremium()`, `isDevUnlocked()`, `restoreWebPurchase(email)`, `requestRestoreCode(email)`, `verifyRestoreCode(email, code)`, `completeRestoreFromEmailLink()`.
- Removes: `startWebCheckout`, `restoreWebPurchaseForSession`, `loadRazorpay`.

**Why `restoreWebPurchase` narrows rather than disappears.** It is the function `isDeveloperEmail` feeds, and `isDevUnlocked()` is a thin, testable wrapper over the record it writes. Keeping it keeps the five pinned tests meaningful — they drive the dev unlock through the same door the context uses, rather than through a test-only path that could pass while the real one is broken.

- [ ] **Step 1: Rewrite the four tests that name the deleted functions**

The file has two `describe` blocks. Everything in the first block — `webBilling developer unlock`, lines 48-87 — is pinned by the spec and **stays byte-for-byte identical**. The second block, `webBilling restore requires a verified email session`, tests the order path and must change. Three of its tests go:

- `server rejecting the session (401) stores nothing` (line 111) — calls `restoreWebPurchaseForSession`, which is being deleted.
- `happy path: verified session sends the user JWT…` (line 119) — asserts `expect(fn).toBe('razorpay-status')`.
- `inactive subscription returns null and stores nothing` (line 135) — calls `restoreWebPurchaseForSession`.

Delete those three, and replace them with two that pin the new behaviour. Add them to the second block, whose `loadBilling` / `withSession` helpers are already in scope:

```ts
  it('verified lookup asks billing-restore, and stores nothing in the browser', async () => {
    // The restore flow used to write a localStorage flag from the server's
    // answer. The server writes the grant now; this browser writes nothing, so
    // that a stolen laptop cannot carry access away with it.
    sb.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({
      data: { restored: true, plan: 'monthly', expiresAt: future },
      error: null,
    });
    const billing = await loadBilling({ dev: false });

    const found = await billing.verifyRestoreCode('payer@example.com', '123456');

    expect(sb.invoke.mock.calls.at(-1)?.[0]).toBe('billing-restore');
    expect(sb.invoke.mock.calls.some(([fn]: [string]) => fn === 'razorpay-status')).toBe(false);
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
    expect(found).toMatchObject({ plan: 'monthly' });
  });

  it('a restore the server does not recognise writes nothing at all', async () => {
    sb.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({ data: { restored: false }, error: null });
    const billing = await loadBilling({ dev: false });

    await expect(billing.verifyRestoreCode('payer@example.com', '123456')).resolves.toBeNull();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });
```

The tests drive `verifyRestoreCode` rather than the private `restoreViaServer` because `verifyRestoreCode` is the name the paywall calls, and it is the one that breaks if the wiring is wrong.

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/lib/webBilling.test.ts`

Expected: FAIL — the call still targets `razorpay-status`.

- [ ] **Step 3: Delete the order path**

In `src/lib/webBilling.ts`:

1. Delete `startWebCheckout` entirely (the whole function, lines from its `/** Website checkout via Razorpay…` comment through its closing `}`).
2. Delete `loadRazorpay` (it now lives in `billing.ts`).
3. Delete `restoreWebPurchaseForSession` and its doc comment.

- [ ] **Step 4: Point the restore flow at `billing-restore`**

Replace the body of `restoreWebPurchase` so it resolves only the dev unlock:

```ts
/**
 * Resolve the DEV-only developer unlock for `email`, or return null.
 *
 * This used to fall through to a session lookup that read the paid
 * `web_subscriptions` table. That is `billing-restore`'s job now, and the
 * context reads the result through `current_entitlement()`, so there is nothing
 * left for this to restore. Narrowing it here is what keeps the five pinned
 * tests honest: they drive the dev unlock through the same door the context
 * uses.
 */
export async function restoreWebPurchase(email: string): Promise<WebPremium | null> {
  const normalized = email.trim().toLowerCase();
  if (import.meta.env.DEV && isDeveloperEmail(normalized)) {
    const devAccess: WebPremium = {
      email: normalized,
      plan: 'yearly',
      currentPeriodEnd: new Date(Date.now() + 100 * 365 * 86400 * 1000).toISOString(),
      source: 'dev',
    };
    saveWebPremium(devAccess);
    return devAccess;
  }
  return null;
}

/**
 * True when this browser holds a live DEV-only developer unlock.
 *
 * The context uses this as an access term. It is safe there only because it is
 * guarded by `import.meta.env.DEV`, which is the literal `false` in a
 * production build — the minifier drops this branch, the `DEVELOPER_EMAILS`
 * read and the email strings together, which is what five tests in
 * `webBilling.test.ts` exist to prove.
 */
export const isDevUnlocked = (): boolean => {
  if (!import.meta.env.DEV) return false;
  const record = getWebPremium();
  return record?.source === 'dev';
};
```

Then add the server call, next to the restore flow:

```ts
/**
 * Ask the server to turn the caller's verified email into a grant.
 *
 * Returns the plan and expiry the server wrote, or null when it found no
 * purchase. The email comes from the verified Supabase session — nothing here
 * sends one, and nothing here trusts one the user typed.
 */
async function restoreViaServer(): Promise<WebPremium | null> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session?.access_token) return null;

    const { data, error } = await supabase.functions.invoke('billing-restore', {
      body: {},
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error || !data?.restored) return null;

    return {
      email: String(session.user?.email ?? '').toLowerCase(),
      plan: data.plan === 'monthly' ? 'monthly' : 'yearly',
      currentPeriodEnd: String(data.expiresAt ?? ''),
    };
  } catch {
    return null;
  }
}
```

Note what it does **not** do: no `saveWebPremium`. A restored purchase is a server row now. A browser flag here would reproduce exactly the bug this plan retires.

- [ ] **Step 5: Re-point the three callers**

- `verifyRestoreCode`: replace its final `return restoreWebPurchaseForSession();` with `return restoreViaServer();`
- `completeRestoreFromEmailLink`: replace `const result = await restoreWebPurchaseForSession();` with `const result = await restoreViaServer();`
- `requestRestoreCode`: unchanged — it already returns `restoreWebPurchase(normalized)` for the dev case and null otherwise.

- [ ] **Step 6: Run the file's tests**

Run: `npx vitest run src/lib/webBilling.test.ts`

Expected: PASS. **The five dev-unlock tests must be unmodified in the diff** — check with `git diff src/lib/webBilling.test.ts` and confirm none of `parses the email list`, `dev build: whitelisted email unlocks`, `dev build: non-whitelisted email still finds nothing`, `production build: developer emails are ignored`, `production build: ignores dev-marked entitlements` appears as changed. Only the restore-flow tests, which named the deleted function and the deleted edge function, may change.

- [ ] **Step 7: Run the whole suite**

Run: `npm test`

Expected: failures in `src/contexts/SubscriptionContext.test.tsx` and `src/components/PaywallModal.checkout.test.tsx`, both of which import the deleted symbols. Tasks 3 and 4 fix them. **Do not paper over them here** — note them and continue.

- [ ] **Step 8: Commit**

```bash
git add src/lib/webBilling.ts src/lib/webBilling.test.ts
git commit -m "refactor(billing): retire the one-time order path"
```

---

### Task 3: `SubscriptionContext` — the access term and the post-checkout refresh

**Files:**
- Modify: `src/contexts/SubscriptionContext.tsx`
- Test: `src/contexts/SubscriptionContext.test.tsx`

**Interfaces:**
- Consumes: `isDevUnlocked` from `@/lib/webBilling`; `startSubscription`, `openCheckout`, `verifyCheckout`, `cancelSubscription`, `waitForEntitlement` from `@/lib/billing`.
- Produces, on the context value, in addition to what it already exposes:
  - `devUnlocked: boolean` — replacing `webPremium: WebPremium | null`
  - `pendingActivation: boolean` — true from a verified checkout until the server grants or the deadline passes
  - `startSubscriptionCheckout(plan: 'monthly' | 'yearly', email: string): Promise<void>`
  - `cancelSubscription(): Promise<void>`
  - `restoreAccess(email: string): Promise<boolean>` — re-pointed at the server

**Why `webPremium` leaves the value rather than staying for display.** Every remaining reader of it would be using it as a proxy for "is this device unlocked", which is exactly the question `isPremium` now answers from the server. Leaving a second, weaker answer in place invites the next feature to read the wrong one.

- [ ] **Step 1: Write the failing tests**

Add to `src/contexts/SubscriptionContext.test.tsx` (match the file's existing render helper and provider wrapper — read it first):

```tsx
  it('does not treat a stored WebPremium record as access', async () => {
    // The record is now the dev unlock's own store, nothing more. A paid
    // account lives in `entitlements`, and only the server may write one.
    localStorage.setItem(
      'psycognito.webPremium.v1',
      JSON.stringify({
        email: 'payer@example.com',
        plan: 'yearly',
        currentPeriodEnd: new Date(Date.now() + 86400000).toISOString(),
        orderId: 'order_paid',
      }),
    );

    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));

    expect(result.current.isPremium).toBe(false);
    expect(result.current.premiumSource).not.toBe('web');
  });

  it('treats a server grant as access', async () => {
    const { result } = renderContext({
      entitlement: { plan: 'monthly', source: 'razorpay', expiresAt: null, permanent: false },
    });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(result.current.premiumSource).toBe('web');
  });

  it('treats an admin grant as the developer source', async () => {
    const { result } = renderContext({
      entitlement: { plan: 'developer', source: 'admin', expiresAt: null, permanent: true },
    });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(result.current.premiumSource).toBe('developer');
  });

  it('stays locked while the server is still being asked', async () => {
    const { result } = renderContext({ entitlement: null, pending: true });
    expect(result.current.checkingServerAccess).toBe(true);
    expect(result.current.isPremium).toBe(false);
  });

  it('goes from locked to unlocked without a manual refresh', async () => {
    // This is the whole point of polling after checkout. A buyer who has paid
    // must not have to reload the page to get in.
    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));
    expect(result.current.isPremium).toBe(false);

    setEntitlement({ plan: 'yearly', source: 'razorpay', expiresAt: null, permanent: false });
    await result.current.refreshEntitlement();

    await waitFor(() => expect(result.current.isPremium).toBe(true));
  });
```

`renderContext({ entitlement, pending })` and `setEntitlement(...)` are helpers you add to the file's own mock block, driving the mocked `serverEntitlement` / `currentEntitlement` and the pending flag. Follow the file's existing pattern for mocking `@/lib/entitlement` rather than inventing a second one.

**Also update** the existing `vi.mock('@/lib/webBilling', ...)` factory in this file: drop `restoreWebPurchaseForSession` and add `isDevUnlocked: () => false`. Leave `getWebPremium` and `restoreWebPurchase` in place.

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`

Expected: FAIL on the first — a stored `WebPremium` record with an `orderId` currently counts as premium.

- [ ] **Step 3: Change the access term**

In `src/contexts/SubscriptionContext.tsx`, replace the import on line 15 with:

```ts
import { completeRestoreFromEmailLink, isDevUnlocked, restoreWebPurchase } from '@/lib/webBilling';
import {
  cancelSubscription as requestCancelSubscription,
  startSubscription,
  openCheckout,
  verifyCheckout,
  waitForEntitlement,
} from '@/lib/billing';
```

Delete the `webPremium` state and the `psycognito:web-premium` listener that fed it. Replace them with:

```ts
  // The dev-only developer unlock is the one browser-side term that survives.
  // It is guarded by `import.meta.env.DEV`, so a production build drops it.
  const [devUnlocked, setDevUnlocked] = useState<boolean>(() => isDevUnlocked());
  const [pendingActivation, setPendingActivation] = useState(false);
```

Replace the `isPremium` memo with:

```ts
  // Three terms, in the order they can be decided. The middle one is the server,
  // and it is the only one that can be true for a paying customer. The last is
  // the dev unlock, which cannot exist in a production bundle.
  const isPremium = useMemo(
    () => isPremiumUser() || entitlement !== null || (import.meta.env.DEV && devUnlocked),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [devUnlocked, entitlement, subscription, demoUnlockAll, demoTrialMsLeft],
  );
```

Replace the `premiumSource` expression's first line — `webPremium ? 'web' :` — with `devUnlocked && import.meta.env.DEV ? 'developer' :`. The rest of the precedence chain is unchanged, as the spec requires.

Delete the `restoreWebPurchaseForSession` effect (the `SIGNED_IN` / `INITIAL_SESSION` block) entirely: the context reads the grant through `current_entitlement()`, so there is nothing for it to restore.

- [ ] **Step 4: Add the subscription actions**

```ts
  // After a verified checkout the modal shows "activating". This is the loop
  // that ends it, and it is why access appears without a manual refresh.
  const startSubscriptionCheckout = async (plan: 'monthly' | 'yearly', email: string) => {
    const handle = await startSubscription(plan, getWebCurrency());
    const result = await openCheckout(handle, email.trim().toLowerCase());
    await verifyCheckout(result);
    setPendingActivation(true);
    try {
      const grant = await waitForEntitlement();
      if (grant) setEntitlement(grant);
    } finally {
      setPendingActivation(false);
      await refreshEntitlement();
    }
  };

  const cancelSubscription = async () => {
    await requestCancelSubscription();
    // The webhook records the cancellation and access runs to the period end,
    // so re-reading is the whole of the browser's job here.
    await refreshEntitlement();
  };
```

Update `restoreWebAccess` to drop the `setWebPremium` call the deleted state used to need:

```ts
  const restoreWebAccess = async (email: string) => {
    const dev = await restoreWebPurchase(email);
    // A dev unlock is a device-local grant; a real one is a server row that
    // `refreshEntitlement` will find.
    if (dev) setDevUnlocked(true);
    await refreshEntitlement();
    return !!dev;
  };
```

`getWebCurrency` must be added to the `@/lib/webBilling` import; remove any import this leaves unused.

Add to the interface and the value object: `devUnlocked: boolean`, `pendingActivation: boolean`, `startSubscriptionCheckout`, `cancelSubscription`. Remove `webPremium` from both.

- [ ] **Step 5: Run the context tests**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/contexts/SubscriptionContext.tsx src/contexts/SubscriptionContext.test.tsx
git commit -m "feat(billing): make the server the access source, and poll after checkout"
```

---

### Task 4: `PaywallModal` — the subscription checkout

**Files:**
- Modify: `src/components/PaywallModal.tsx`
- Test: `src/components/PaywallModal.checkout.test.tsx`

**Interfaces:**
- Consumes: `useSubscription()`'s `startSubscriptionCheckout`, `pendingActivation`; `fetchBillingPlans`, `fallbackBillingPlans` from `@/lib/billing`.
- Produces: a modal that shows the server's amount before authorization, shows *"Payment received — activating…"* after a verified checkout, and never claims access it does not have.

**Why `pendingActivation` rather than local state.** The poll belongs to the context, because the context owns `entitlement` and the modal unmounts when the gate lifts. A modal-local flag would be lost at exactly the moment it becomes true.

- [ ] **Step 1: Update the checkout tests**

Replace `src/components/PaywallModal.checkout.test.tsx`'s mock of `@/lib/webBilling` so it no longer hoists `startWebCheckout`, and mock `useSubscription` to provide `startSubscriptionCheckout`:

```tsx
const checkout = vi.hoisted(() => ({ startSubscriptionCheckout: vi.fn() }));
const subscription = vi.hoisted(() => ({ pendingActivation: false }));

vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    startSubscriptionCheckout: checkout.startSubscriptionCheckout,
    pendingActivation: subscription.pendingActivation,
    startTrial: vi.fn(),
    refreshSubscription: vi.fn(),
  }),
}));
```

Then the four cases become:

```tsx
  it('asks the context to start the subscription once the email is valid', async () => {
    checkout.startSubscriptionCheckout.mockResolvedValue(undefined);
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(checkout.startSubscriptionCheckout).toHaveBeenCalledWith('yearly', 'payer@example.com');
  });

  it('refuses to start without a valid email', async () => {
    renderPaywall();
    await typeEmail('not-an-email');
    await clickContinue();
    expect(checkout.startSubscriptionCheckout).not.toHaveBeenCalled();
  });

  it('shows activating only after a verified checkout, never unlocked', async () => {
    // The callback proves the payment is real. It does not prove the webhook
    // has landed, and this modal must not say that it has.
    checkout.startSubscriptionCheckout.mockImplementation(async () => {
      subscription.pendingActivation = true;
    });
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.getByText(/activating/i)).toBeTruthy();
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('stays quiet when the buyer dismisses the modal', async () => {
    checkout.startSubscriptionCheckout.mockRejectedValue({ userCancelled: true });
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.queryByRole('alert')).toBeNull();
  });
```

Match the file's existing `renderPaywall`, `typeEmail` and `clickContinue` helpers; if it inlines them, keep inlining.

- [ ] **Step 2: Run and watch them fail**

Run: `npx vitest run src/components/PaywallModal.checkout.test.tsx`

Expected: FAIL — the modal still imports `startWebCheckout`, which no longer exists.

- [ ] **Step 3: Rewrite `handleContinue`'s web branch**

In `src/components/PaywallModal.tsx`, change the import to drop `startWebCheckout`:

```tsx
import {
  requestRestoreCode,
  verifyRestoreCode,
  getWebCurrency,
  isDeveloperEmail,
  yearlySavingPercent,
  WEB_PRICES,
  type WebPremium,
} from '@/lib/webBilling';
import { fallbackBillingPlans, fetchBillingPlans, type BillingPlan } from '@/lib/billing';
```

Pull the two new context values: `const { refreshSubscription, startTrial, startSubscriptionCheckout, pendingActivation } = useSubscription();`

Add a catalogue state that starts from the fallback so an amount is on screen immediately (spec §9), and upgrades to the server's numbers when they arrive:

```tsx
  const [plans, setPlans] = useState<BillingPlan[]>(() => fallbackBillingPlans());
  useEffect(() => {
    let active = true;
    fetchBillingPlans().then((next) => {
      if (active && next.length) setPlans(next);
    });
    return () => {
      active = false;
    };
  }, []);
  const catalogue = plans.find((p) => p.code === selectedPlan && p.currency === webCurrency);
```

Replace the whole `if (!EMAIL_RE.test(...)) { ... }` tail of `handleContinue` (everything after the `native` block's closing brace) with:

```tsx
    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Enter a valid email address so we can save your purchase.');
      return;
    }
    setBusy(true);
    try {
      await startSubscriptionCheckout(activePlan, email.trim().toLowerCase());
      // The context has already polled. Whatever it found, the modal does not
      // claim more than the server granted.
      if (pendingActivation === false) {
        toast.info('Still activating — this can take a moment. Check your account shortly.');
      }
    } catch (e: any) {
      if (!e?.userCancelled) toast.error(e?.message ?? 'Payment failed.');
    } finally {
      setBusy(false);
    }
  };
```

`pendingActivation` read inside the handler is the value from the render the click was made in, so it will always be `false` at that point. **Do not rely on it here.** Instead, read the context's live value by not closing over it: the toast is driven by a `useEffect` on `pendingActivation`:

```tsx
  // Drives the post-checkout message from the context's live flag rather than
  // from a stale closure inside the click handler.
  useEffect(() => {
    if (!isOpen || pendingActivation) return;
    if (!submittedRef.current) return;
    submittedRef.current = false;
    toast.info('Still activating — this can take a moment. Check your account shortly.');
  }, [pendingActivation, isOpen]);
```

with `const submittedRef = useRef(false);` declared beside the other state, set to `true` in `handleContinue` immediately before `await startSubscriptionCheckout(...)`. Import `useRef` from React.

- [ ] **Step 4: Render the price from the catalogue**

Replace the price line under the plan toggle (the `<p className="text-center text-sm text-muted-foreground tabular-nums">` block) with:

```tsx
            <p className="text-center text-sm text-muted-foreground tabular-nums">
              {activePlan === 'monthly'
                ? `Monthly plan · ${formatPlanAmount(catalogue)} per month`
                : `Yearly plan · ${formatPlanAmount(catalogue)} per year`}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Renews automatically unless you cancel. Your card is charged today.
            </p>
```

and add, near `formatAmount`'s equivalents at the top of the file:

```tsx
/** The amount the server will charge, in minor units, formatted for display. */
const formatPlanAmount = (plan: BillingPlan | undefined): string => {
  if (!plan) return '—';
  try {
    return new Intl.NumberFormat(plan.currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: plan.currency,
      minimumFractionDigits: 0,
    }).format(plan.amount / 100);
  } catch {
    return `${plan.amount / 100} ${plan.currency}`;
  }
};
```

The `renews unless cancelled` sentence is required by the standing order, and the amount is now the server's, not `WEB_PRICES`'.

- [ ] **Step 5: Show the activating state**

Where the Continue button renders, add above it:

```tsx
          {pendingActivation && (
            <p role="status" className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Payment received — activating…
            </p>
          )}
```

`Loader2` is already imported.

- [ ] **Step 6: Run the checkout tests**

Run: `npx vitest run src/components/PaywallModal.checkout.test.tsx src/components/PaywallModal.trial.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/PaywallModal.tsx src/components/PaywallModal.checkout.test.tsx
git commit -m "feat(billing): check out through subscriptions in the paywall"
```

---

### Task 5: `/account`

**Files:**
- Create: `src/pages/Account.tsx`
- Create: `src/pages/Account.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/AuthGuard.tsx`
- Modify: `src/components/SettingsView.tsx`

**Interfaces:**
- Consumes: `requestEmailCode`, `verifyEmailCode`, `currentAuthUser`, `onAuthChange`, `serverEntitlement`, `type Entitlement` from `@/lib/entitlement`; `fetchBillingPlans`, `cancelSubscription` from `@/lib/billing`; `AccessDiagnostic`.
- Produces: a route `/account` reachable signed out, showing sign-in, the effective grant, paid-only manage-billing controls, and the caller's auth user id.

**Why it must be public.** Access is an admin grant keyed to an auth user id, and this page is the only place that id is readable. Behind the gate, the owner could not read the id that lets them through the gate.

**This page answers the user's first request in full.** Signing in *is* registering — `shouldCreateUser: true` — so there is no separate signup form, and none is wanted: the spec's Decision 10 forbids self-service roles.

- [ ] **Step 1: Register the route and open the path**

In `src/App.tsx`, add the import beside `CheckoutSuccess`:

```tsx
import Account from "./pages/Account";
```

and the route above the catch-all:

```tsx
                    <Route path="/account" element={<Account />} />
```

In `src/components/AuthGuard.tsx`, extend the list:

```tsx
// Reachable without access: the legal pages, the account page where the auth
// user id (the thing an admin grant is keyed to) is readable, and the receipt a
// just-paid buyer is redirected to before their entitlement has been read back.
const PUBLIC_PATHS = ['/terms', '/privacy', '/account', '/checkout/success'];
```

- [ ] **Step 2: Write the failing tests**

Create `src/pages/Account.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const requestEmailCode = vi.hoisted(() => vi.fn());
const verifyEmailCode = vi.hoisted(() => vi.fn());
const currentAuthUser = vi.hoisted(() => vi.fn());
const serverEntitlement = vi.hoisted(() => vi.fn());
const onAuthChange = vi.hoisted(() => vi.fn(() => () => {}));
const cancelSubscription = vi.hoisted(() => vi.fn());

vi.mock('@/lib/entitlement', () => ({
  requestEmailCode,
  verifyEmailCode,
  currentAuthUser,
  serverEntitlement,
  onAuthChange,
}));
vi.mock('@/lib/billing', () => ({
  cancelSubscription,
  fetchBillingPlans: vi.fn().mockResolvedValue([]),
}));

import Account from './Account';

const renderPage = () =>
  render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>,
  );

describe('Account', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentAuthUser.mockResolvedValue(null);
    serverEntitlement.mockResolvedValue(null);
  });

  it('offers email sign-in when signed out', async () => {
    renderPage();
    expect(await screen.findByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /email me a code/i })).toBeTruthy();
  });

  it('signs in with a one-time code and then shows the account id', async () => {
    requestEmailCode.mockResolvedValue({ ok: true });
    verifyEmailCode.mockResolvedValue({ ok: true });
    currentAuthUser.mockResolvedValue({ id: '5ba70276-0000-0000-0000-000000000000', email: 'owner@example.com' });

    renderPage();
    await userEvent.type(await screen.findByLabelText(/email/i), 'owner@example.com');
    await userEvent.click(screen.getByRole('button', { name: /email me a code/i }));
    await userEvent.type(await screen.findByLabelText(/code/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    expect(await screen.findByText('5ba70276-0000-0000-0000-000000000000')).toBeTruthy();
  });

  it('shows no manage-billing controls for a developer grant', async () => {
    // A cancel button on an admin grant would be a lie: there is no
    // subscription behind it to cancel.
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'owner@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'developer', source: 'admin', expiresAt: null, permanent: true,
    });

    renderPage();
    await waitFor(() => expect(screen.getByText(/developer/i)).toBeTruthy());
    expect(screen.queryByRole('button', { name: /cancel subscription/i })).toBeNull();
  });

  it('shows the renewal date and amount for a paid plan', async () => {
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay',
      expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });

    renderPage();
    expect(await screen.findByText(/2030/)).toBeTruthy();
    expect(await screen.findByRole('button', { name: /cancel subscription/i })).toBeTruthy();
  });

  it('does not claim a payment failed when the cancel call fails', async () => {
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    cancelSubscription.mockRejectedValue(new Error('Could not cancel the subscription.'));

    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: /cancel subscription/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not cancel/i);
  });
});
```

- [ ] **Step 3: Run them and watch them fail**

Run: `npx vitest run src/pages/Account.test.tsx`

Expected: FAIL — `Failed to resolve import "./Account"`.

- [ ] **Step 4: Write the page**

Create `src/pages/Account.tsx`:

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { AccessDiagnostic } from '@/components/AccessDiagnostic';
import { Button } from '@/components/ui/button';
import { cancelSubscription, fetchBillingPlans, type BillingPlan } from '@/lib/billing';
import {
  currentAuthUser,
  onAuthChange,
  requestEmailCode,
  serverEntitlement,
  verifyEmailCode,
  type Entitlement,
} from '@/lib/entitlement';

const formatAmount = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  } catch {
    return `${amount / 100} ${currency}`;
  }
};

const formatDate = (iso: string): string | null => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-background px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))]">
    <div className="mx-auto max-w-md space-y-6">{children}</div>
  </main>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card p-5 space-y-3">{children}</section>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
  </div>
);

export const Account = () => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const who = await currentAuthUser();
      setUser(who);
      setEntitlement(who ? await serverEntitlement() : null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    let active = true;
    fetchBillingPlans().then((next) => {
      if (active) setPlans(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const catalogue = useMemo(
    () => plans.find((p) => p.code === entitlement?.plan && p.currency === 'INR'),
    [plans, entitlement],
  );

  const sendCode = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await requestEmailCode(email);
      if (!result.ok) throw new Error(result.message ?? 'Could not send a code.');
      setStep('code');
      toast.success(`We emailed a code to ${email.trim().toLowerCase()}.`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not send a code.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await verifyEmailCode(email, code);
      if (!result.ok) throw new Error(result.message ?? 'That code was not accepted.');
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not verify the code.');
    } finally {
      setBusy(false);
    }
  };

  const onCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      toast.success('Cancellation requested. Access runs to the end of the period you paid for.');
      await refresh();
    } catch (e: unknown) {
      // Never "your subscription failed" — the request did not go through.
      setError(e instanceof Error ? e.message : 'Could not cancel the subscription.');
    } finally {
      setCancelling(false);
    }
  };

  if (checking) {
    return (
      <Shell>
        <div className="flex justify-center py-16">
          <Loader2 role="status" aria-label="Loading your account" className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-foreground">Your account</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your email. There is no password — we send you a code. Signing in for the
          first time creates the account.
        </p>
        <Card>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (busy) return;
              if (step === 'email') void sendCode();
              else void verify();
            }}
          >
            {step === 'email' ? (
              <div className="space-y-1.5">
                <label htmlFor="account-email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="account-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="account-code" className="block text-sm font-medium text-foreground">
                  Code from your email
                </label>
                <input
                  id="account-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground"
                />
              </div>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full min-h-[44px]">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 'email' ? 'Email me a code' : 'Verify'}
            </Button>
          </form>
        </Card>
        <Link to="/" className="text-sm text-primary underline underline-offset-4">
          Back to the app
        </Link>
      </Shell>
    );
  }

  const renewal = entitlement?.expiresAt ? formatDate(entitlement.expiresAt) : null;
  const amount = catalogue ? formatAmount(catalogue.amount, catalogue.currency) : null;
  const paid = entitlement?.source === 'razorpay';

  return (
    <Shell>
      <h1 className="text-2xl font-bold text-foreground">Your account</h1>

      <Card>
        <h2 className="text-sm font-semibold text-foreground">Plan</h2>
        <dl className="space-y-2">
          <Row label="Plan" value={entitlement?.plan ?? 'Free'} />
          <Row label="Source" value={entitlement?.source ?? 'none'} />
          {renewal && <Row label="Renews on" value={renewal} />}
          {paid && amount && <Row label="Amount" value={amount} />}
        </dl>
        {paid && (
          <Button
            variant="outline"
            className="min-h-[44px]"
            disabled={cancelling}
            onClick={() => void onCancel()}
          >
            {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel subscription
          </Button>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-foreground">Your account id</h2>
        <AccessDiagnostic />
      </Card>

      <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4">
        <Check className="h-4 w-4" />
        Back to the app
      </Link>
    </Shell>
  );
};

export default Account;
```

**Note on the sign-in calls:** `requestEmailCode` and `verifyEmailCode` in `src/lib/entitlement.ts` each return `AuthResult { ok: boolean; message?: string }` and never throw for a bad email or a rejected code — an invalid address comes back as `{ ok: false, message: 'Enter a valid email address.' }`. That is why the page checks `result.ok` rather than relying on `catch`. Only a genuinely unexpected failure reaches the `catch`. The `message` is the server's, and it is shown as-is: it is the only thing that can tell the user *why* a code was refused.

`currentAuthUser()` returns `AuthUser { id: string; email: string | null }`, so `user.email` is nullable — the page reads `session.user?.email ?? ''` rather than assuming one.

- [ ] **Step 5: Send the settings card to `/account`**

In `src/components/SettingsView.tsx`, the "Manage Subscription / Upgrade to Pro" button currently only opens the paywall. Add a link to the account page beside it, so a paid user has a way to reach cancel:

```tsx
          <Button
            variant="outline"
            className="min-h-[44px] flex-1"
            onClick={() => navigate('/account')}
          >
            Account &amp; billing
          </Button>
```

`navigate` is already declared on line 32.

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/pages/Account.test.tsx src/components/AuthGuard.test.tsx`

Expected: PASS. `AuthGuard.test.tsx` already asserts `/terms` and `/privacy` are public; add `/account` to its public-paths case if it enumerates them.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Account.tsx src/pages/Account.test.tsx src/App.tsx \
        src/components/AuthGuard.tsx src/components/SettingsView.tsx
git commit -m "feat(account): add the public account page"
```

---

### Task 6: The receipt, server-read

**Files:**
- Modify: `src/pages/CheckoutSuccess.tsx`
- Modify: `src/pages/CheckoutSuccess.test.tsx`

**Interfaces:**
- Consumes: `subscriptions` (read-own RLS) via `@/integrations/supabase/client`; `currentEntitlement` from `@/lib/entitlement`.
- Produces: a receipt that reads the server and shows the same activating state as the modal.

**Why it reads `subscriptions` rather than `localStorage`.** The old receipt matched a query-string order id against a browser record, which meant a buyer who paid on their phone and opened the link on a laptop got "We could not find that order". A server read scoped by RLS shows the truth to whoever is signed in, on any device.

- [ ] **Step 1: Rewrite the tests**

Replace `src/pages/CheckoutSuccess.test.tsx` wholesale:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const maybeSingle = vi.hoisted(() => vi.fn());
const select = vi.hoisted(() => vi.fn());
const currentEntitlement = vi.hoisted(() => vi.fn());

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({ select, order: () => ({ limit: () => ({ maybeSingle }) }) }) },
}));
vi.mock('@/lib/entitlement', () => ({ currentEntitlement }));

import CheckoutSuccess from './CheckoutSuccess';

const renderReceipt = () =>
  render(
    <MemoryRouter>
      <CheckoutSuccess />
    </MemoryRouter>,
  );

describe('CheckoutSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentEntitlement.mockResolvedValue(null);
  });

  it('says activating while the webhook has not landed', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    expect(await screen.findByText(/activating/i)).toBeTruthy();
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('says active once the server grants access', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });
    currentEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    renderReceipt();
    expect(await screen.findByText(/active/i)).toBeTruthy();
    expect(await screen.findByText(/₹2,999/)).toBeTruthy();
  });

  it('says nothing when there is no subscription to show', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    renderReceipt();
    expect(await screen.findByText(/could not find/i)).toBeTruthy();
  });

  it('never claims a failed payment for a subscription that is merely pending', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'monthly', currency: 'INR', amount: 29900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    await screen.findByText(/activating/i);
    expect(screen.queryByText(/failed/i)).toBeNull();
  });
});
```

- [ ] **Step 2: Run and watch them fail**

Run: `npx vitest run src/pages/CheckoutSuccess.test.tsx`

Expected: FAIL — the page still reads `getWebPremium()` and the `order` query parameter.

- [ ] **Step 3: Rewrite the page**

Replace `src/pages/CheckoutSuccess.tsx`'s data layer. Keep its `Shell`, `Row`, `formatAmount`, `formatDate` and `MissingOrder` exactly as they are — they are already right. Replace the imports and the body:

```tsx
import { useEffect, useState } from 'react';
import { currentEntitlement, type Entitlement } from '@/lib/entitlement';

interface SubscriptionRow {
  plan: 'monthly' | 'yearly';
  currency: string;
  amount: number;
  status: 'created' | 'active' | 'cancelled' | 'halted' | 'completed';
  current_period_end: string | null;
}
```

```tsx
/**
 * The receipt for a subscription.
 *
 * It reads the server, scoped by RLS to the signed-in caller, rather than a
 * record this browser wrote. The old version matched a query-string order id
 * against `localStorage`, so a buyer who paid on one device and opened the link
 * on another was told their order could not be found — a lie about a payment
 * that had gone through.
 */
export const CheckoutSuccess = () => {
  const [record, setRecord] = useState<SubscriptionRow | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    let active = true;
    const read = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, currency, amount, status, current_period_end')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const grant = await currentEntitlement().catch(() => null);
      if (!active) return;
      setRecord((data as SubscriptionRow | null) ?? null);
      setEntitlement(grant);
      setAsked(true);
      setLoading(false);
    };
    void read();
    // The webhook may land a moment after the redirect. Re-read on focus so a
    // buyer who switches apps and comes back sees the truth, not a stale
    // "activating".
    const onFocus = () => void read();
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (loading) {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Checking your payment…</p>
      </Shell>
    );
  }

  if (asked && !record) return <MissingOrder />;

  const active = entitlement !== null;
  const endsOn = record?.current_period_end ? formatDate(record.current_period_end) : null;
  const paid = record ? formatAmount(record.amount, record.currency) : null;

  return (
    <Shell>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {active ? 'Subscription active' : 'Payment received'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {active
            ? 'Everything is unlocked on this account.'
            : 'Activating — this usually takes a few seconds. You can close this page.'}
        </p>
      </div>

      <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        <Row label="Plan" value={record ? PLAN_NAMES[record.plan] : 'Premium'} />
        {paid && <Row label="Paid" value={paid} />}
        <Row label="Status" value={active ? 'Active now' : 'Activating'} />
        {/* "Renews on", because this is a subscription: the period end is a date
            we do rebill on, unlike the one-time orders this replaced. */}
        {endsOn && <Row label={active ? 'Renews on' : 'Access until'} value={endsOn} />}
      </dl>

      <Link
        to="/"
        className="mt-6 block rounded-full bg-primary py-4 text-center text-base font-bold text-primary-foreground"
      >
        {active ? 'Start using Pro' : 'Continue to the app'}
      </Link>
    </Shell>
  );
};

export default CheckoutSuccess;
```

Delete the `getWebPremium` / `WebPremium` / `useSearchParams` imports; `PLAN_NAMES` keeps the same shape but is keyed on `SubscriptionRow['plan']`.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/pages/CheckoutSuccess.test.tsx`

Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CheckoutSuccess.tsx src/pages/CheckoutSuccess.test.tsx
git commit -m "feat(billing): read the receipt from the server"
```

---

### Task 7: Backfill, and delete the order-path functions

**Files:**
- Create: `supabase/migrations/20261009120300_backfill_web_subscriptions.sql`
- Delete: `supabase/functions/razorpay-create-order/`, `supabase/functions/razorpay-verify/`, `supabase/functions/razorpay-status/`
- Modify: `src/components/AdBanner.tsx`

**Interfaces:**
- Consumes: `web_subscriptions` (20260908123511), `auth.users`, `entitlements`, `subscriptions`.
- Produces: an `entitlements` grant and a `subscriptions` row for every verified buyer under the old system, plus a banner that no longer flashes.

**Why the backfill must not run twice.** It is idempotent by construction — the `entitlements` upsert conflicts on `user_id`, and the `subscriptions` insert is guarded by `NOT EXISTS` on the unique `razorpay_subscription_id` — because the operator may run it before and after a deploy and nothing should double-grant.

- [ ] **Step 1: Write the backfill migration**

Create `supabase/migrations/20261009120300_backfill_web_subscriptions.sql`:

```sql
-- Carry the buyers who paid under the retired one-time-order path into the new
-- one. Two writes per buyer: an `entitlements` row, which is what actually
-- grants access, and a `subscriptions` row, so the account page has a plan,
-- an amount and a date to show.
--
-- The join is on lower(email) against auth.users, because web_subscriptions
-- recorded an email and an entitlement is keyed to a user id. A buyer with no
-- auth account is skipped: there is nowhere to hang their grant, and inventing
-- a user is not this migration's business.
--
-- Neither table is mutated, so re-running this is safe: the entitlements upsert
-- conflicts on user_id, and the subscriptions insert is guarded by the unique
-- razorpay_subscription_id.

-- 1. Grants.
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
SELECT
  u.id,
  ws.plan,                  -- already 'monthly' | 'yearly', per its own CHECK
  'razorpay',
  ws.current_period_end,
  'backfilled from web_subscriptions'
FROM public.web_subscriptions ws
JOIN auth.users u ON lower(u.email) = lower(ws.email)
WHERE ws.status = 'paid'
  -- A NULL period end cannot be shown as a renewal date and cannot be relied on
  -- as access, so those buyers are left for a human rather than granted a
  -- placeholder. Check the count of them after running this.
  AND ws.current_period_end IS NOT NULL
  AND ws.current_period_end > now()
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan,
      source = EXCLUDED.source,
      expires_at = EXCLUDED.expires_at,
      note = EXCLUDED.note,
      updated_at = now()
  -- Never overwrite an admin grant. The trigger from
  -- 20261009120200 enforces this too; stating it here keeps the intent
  -- readable in the statement that would otherwise be the exception.
  WHERE public.entitlements.source <> 'admin';

-- 2. Subscription rows, so the account page has something to render. These
--    carry no Razorpay id of their own -- the old path used orders, not
--    subscriptions -- so the legacy order id is used as the unique key. It can
--    never collide with a real `sub_...` id.
INSERT INTO public.subscriptions
  (user_id, razorpay_subscription_id, plan, currency, amount, status, current_period_end)
SELECT
  u.id,
  'legacy_order_' || ws.order_id,
  ws.plan,
  -- `subscriptions.currency` has a CHECK for exactly these two values, while
  -- `web_subscriptions.currency` is free text. An unrecognised currency would
  -- abort the whole migration, so it is mapped rather than passed through: a
  -- row whose currency is wrong is better than no backfill at all, and the
  -- amount stays the amount that was actually charged.
  CASE WHEN ws.currency IN ('INR', 'USD') THEN ws.currency ELSE 'INR' END,
  ws.amount,
  'active',
  ws.current_period_end
FROM public.web_subscriptions ws
JOIN auth.users u ON lower(u.email) = lower(ws.email)
WHERE ws.status = 'paid'
  AND ws.current_period_end IS NOT NULL
  AND ws.current_period_end > now()
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.razorpay_subscription_id = 'legacy_order_' || ws.order_id
  );

-- Note: a backfilled `subscriptions` row is display data only. Nothing here
-- writes an entitlement that the first statement did not already write, and no
-- webhook will ever update these rows -- their ids do not exist at Razorpay.
-- `checkout_verified_at` is deliberately left NULL: no checkout signature was
-- ever verified for these, and claiming one was would be a fabrication.
```

**Two things to check before running this**, both about buyers this migration deliberately leaves behind rather than mis-grants:

```sql
SELECT
  count(*) FILTER (WHERE current_period_end IS NULL)        AS no_period_end,
  count(*) FILTER (WHERE current_period_end <= now())       AS already_expired,
  count(*) FILTER (WHERE currency NOT IN ('INR', 'USD'))    AS odd_currency,
  count(*)                                                  AS paid_total
FROM public.web_subscriptions
WHERE status = 'paid';
```

A non-zero `no_period_end` means there is a paying customer with no access after this runs. Tell the operator; do not guess a period for them.

The column names here come from `supabase/migrations/20260908123511_2dd277e5-6868-49cf-8687-29f3c36e0abf.sql`, read while writing this plan: `email`, `plan`, `order_id`, `payment_id`, `amount`, `currency`, `status`, `current_period_end`, `created_at`. Re-read that file if it has changed.

- [ ] **Step 2: Verify the backfill is idempotent**

Run the migration twice, then in the SQL editor:

```sql
SELECT
  (SELECT count(*) FROM public.entitlements WHERE note = 'backfilled from web_subscriptions') AS grants,
  (SELECT count(*) FROM public.subscriptions WHERE razorpay_subscription_id LIKE 'legacy_order_%') AS subs;
```

Expected: the same two numbers after the second run as after the first. A count that grew means the guards are wrong and a buyer has been double-granted.

- [ ] **Step 3: Delete the order-path functions**

```bash
git rm -r supabase/functions/razorpay-create-order \
          supabase/functions/razorpay-verify \
          supabase/functions/razorpay-status
```

Then check nothing still names them:

```bash
grep -rn "razorpay-create-order\|razorpay-verify\|razorpay-status" src supabase --include='*.ts' --include='*.tsx' --include='*.toml'
```

Expected: no matches.

- [ ] **Step 4: Stop the banner flashing**

In `src/components/AdBanner.tsx`, change line 19 to also hold the banner while the server is still answering:

```tsx
  // `checkingServerAccess` is not decoration: before the server has answered, a
  // paying customer looks exactly like a free one, and showing them an upgrade
  // banner they have already acted on is the flash the spec forbids.
  if (checkingServerAccess || isPremium || demoTrialActive || isDismissed) return null;
```

and add `checkingServerAccess` to the destructure on line 8.

- [ ] **Step 5: Run the whole suite**

Run: `npm test`

Expected: green. This is the first run in which no test file references a deleted symbol.

- [ ] **Step 6: Build**

Run: `npm run build`

Expected: succeeds with no unresolved import. A failure here names a file that still imports something deleted in Tasks 2, 3, 6 or 7 Step 3.

- [ ] **Step 7: Commit**

```bash
git add -A supabase/migrations/20261009120300_backfill_web_subscriptions.sql \
           supabase/functions src/components/AdBanner.tsx
git commit -m "feat(billing): backfill old buyers and retire the order path"
```

---

## Operator steps for Plan B

1. **Apply `20261009120300_backfill_web_subscriptions.sql`** after Plan A's migrations, then run its read-back twice (Task 7 Step 2).
2. **Deploy the four new functions and delete the three old ones** from the Supabase dashboard — `git rm` removes them from the repo but a deployed function keeps serving until it is removed or redeployed.
3. **Confirm the email templates** contain `{{ .Token }}` in **both** "Confirm signup" and "Magic Link". Signing in on `/account` is the only way in, and "Confirm signup" is the one a first-time user gets.
4. **Remove `VITE_DEVELOPER_EMAILS` from `.env.local`** (or leave it, if you want the local dev unlock). It has no effect on a production build either way.

## What Plan B deliberately does not do

- **No restyle.** `/account` uses the same shell, card and row idioms as the existing `CheckoutSuccess` page.
- **No self-service role.** `/account` shows the id and the grant SQL; it cannot grant anything. The `INSERT` is the operator's, run in the SQL editor.
- **No native (RevenueCat) change.** `isPremiumUser()` and the AppBuild branch in `PaywallModal` are untouched.
- **No change to `has_premium()`, `current_entitlement()` or `start_trial()`.** This plan adds writers, not rules.
- **No deletion of `web_subscriptions`.** It is the backfill's source and `billing-restore`'s lookup; retiring it is a later, separate decision.
