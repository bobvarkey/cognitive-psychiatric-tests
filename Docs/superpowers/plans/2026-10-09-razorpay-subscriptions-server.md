# Razorpay Subscriptions — Plan A: the server billing path

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the retired one-time-order premium path with Razorpay **Subscriptions** on the server: a server-owned plan catalogue, a create-subscription function, a checkout verifier that grants nothing, and a public webhook that is the sole authority for writing `entitlements`.

**Architecture:** Four Deno edge functions and three migrations. The security-critical decision logic — signature comparison, event-to-effect mapping, dedupe-key derivation, request-body validation — is extracted into one framework-free module, `src/lib/billingWebhookCore.ts`, so it can be driven by real failing tests under Vitest (which only collects `src/**`). The edge functions become thin I/O shells around it. `subscriptions` records billing bookkeeping; `entitlements.expires_at` remains the only access rule, so a bookkeeping bug cannot by itself grant access.

**Tech Stack:** Supabase edge functions (Deno, `Deno.serve`, `npm:@supabase/supabase-js@2`), Postgres + RLS, Web Crypto (`crypto.subtle`), Vitest 4.

**Spec:** `Docs/superpowers/specs/2026-10-09-razorpay-subscriptions-design.md`

**Companion plan:** `Docs/superpowers/plans/2026-10-09-razorpay-subscriptions-client.md` (Plan B) covers the client surface, the retirement of the order path, and the backfill. Plan A ships first and is provable alone; nothing in Plan B is required for Plan A's tests to pass.

## Global Constraints

- **Test keys only.** Do not switch to live Razorpay keys. That is a separate, explicit instruction.
- **`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are server-side only.** Never in frontend code, never in a `VITE_` variable, never logged, never returned. If any is missing the function returns **500 `'Payments are not configured.'`** and stops — it never falls back to a guess.
- **Never trust plan id, price, currency, or user id from the browser.** The caller's id comes from `auth.getUser(token)`. Amount, `razorpay_plan_id` and user id are read from the server's own catalogue.
- **No browser client may write `entitlements`.** RLS is enabled with a read-own policy and *no* write policy. The only writers are the webhook, `billing-restore`, and the operator's backfill — all service-role.
- **The webhook verifies before it parses.** HMAC-SHA256 of the **raw body**, compared constant-time to `X-Razorpay-Signature`, before any `JSON.parse` and before any database read or write.
- **Process first, record the event id second.** Recording first turns a retryable failure into a permanently lost grant.
- **A cancelled, halted or completed subscription never extends access.** Only `activated` and `charged` move `expires_at` forward.
- **The developer grant is unwritable by billing**, enforced by `WHERE public.entitlements.source <> 'admin'` in SQL rather than by remembering not to.
- **The webhook must not 5xx on a routine event.** Handled, duplicate, unknown-type and unmapped events all return 200. Only a genuine processing failure returns 500, because Razorpay auto-disables a webhook after 24 hours of non-2xx and exposes no delivery-log API.
- **Never cache authenticated responses or payment data.**
- **Operator-only steps** (Claude cannot reach the Supabase or Razorpay dashboards): setting function secrets, creating the four Razorpay Plans, creating the webhook, applying migrations, deploying functions. Each is called out where it is needed.

## A note on how SQL is verified here

This repo has no SQL test runner, and no Vitest config that reaches `supabase/`. Two consequences govern the shape of these tasks, and both are deliberate rather than overlooked:

1. **Migration tasks carry no Vitest test.** Their verification is an explicit SQL assertion with an expected output, run by the operator in the Supabase SQL editor. Each is written out verbatim in the step that needs it, so it is a check and not a formality.
2. **Testable logic is pushed into `src/`.** `vitest.config.ts` sets `include: ["src/**/*.{test,spec}.{ts,tsx}"]`, which governs *test discovery*, not imports — so a pure module may live in `src/lib/` and be imported by a Deno function over a relative path. Task 3 is where the security-critical decisions live, and it is full TDD.

## Review Focus

The five input classes or failure modes the spec implies that no single task's happy-path test would otherwise exercise. Each has a test in the task that owns the code.

1. **A webhook that grants before it verifies, or after a partial read.** Reading the body as JSON first, or `req.json()` instead of `req.text()`, silently changes the signed bytes and either breaks every signature or defeats verification entirely. Pinned in Task 3 (`hmacSha256Hex` against a known vector) and Task 6 (the shell reads `req.text()` first).
2. **A duplicate delivery compounding access.** If the write were additive (`expires_at = expires_at + interval`) a redelivery would extend the subscription on every retry. Pinned in Task 3 by asserting the effect is an absolute assignment, and in Task 6 by the process-first ordering.
3. **A halted or cancelled subscription still extending access.** `halted` means the last payment failed; if it wrote a new `expires_at`, a failed charge would buy another period. Pinned in Task 3.
4. **A price, plan id or user id trusted from the request body.** A client that sends `amount: 1` must be ignored, not honoured. Pinned in Task 3 (`parseCreateSubscriptionRequest`) and Task 4 (the body is used for nothing else).
5. **The webhook returning 5xx on a routine event and being auto-disabled.** Unknown event types, unmapped subscriptions, duplicates and malformed-but-then-validly-signed bodies must all be 200. Pinned in Task 3 (unknown type → `null`, not a throw) and Task 6 (the status-code table).

---

### Task 1: The plan catalogue

**Files:**
- Create: `supabase/migrations/20261009120000_billing_plans.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: `public.billing_plans (code, currency, amount, interval_unit, total_count, razorpay_plan_id, label, updated_at)`, primary key `(code, currency)`, readable by `anon` and `authenticated`, writable by nobody but the service role. `code` is `'monthly' | 'yearly'`; `currency` is `'INR' | 'USD'`; `amount` is minor units (paise/cents).

**Why a table and not a constant in the function.** Razorpay plan ids are created outside this repo and change when a price changes. As a table the operator updates a price with one `UPDATE`, without a redeploy, and the client still cannot influence it: there is no write policy, so every client write is rejected.

**Why `total_count` is not nullable.** Razorpay requires a finite number of billing cycles. 120 monthly cycles ≈ 10 years and 10 yearly cycles = 10 years, so "renews unless cancelled" holds for any realistic subscription; `subscription.completed` fires only at that horizon.

- [ ] **Step 1: Create the migration**

Create `supabase/migrations/20261009120000_billing_plans.sql`:

```sql
-- The server-owned plan catalogue: the single source of truth for price,
-- currency, interval and the Razorpay plan id.
--
-- This is a table rather than a constant inside the edge function because
-- Razorpay plan ids are created outside this repo and change when a price
-- changes. Here the operator updates a price with one UPDATE, without a
-- redeploy — and the client still cannot influence it, because there is
-- deliberately no write policy below and every client write is rejected.

CREATE TABLE public.billing_plans (
  code             TEXT NOT NULL CHECK (code IN ('monthly','yearly')),
  currency         TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  -- Minor units: paise for INR, cents for USD. Razorpay reports amounts this
  -- way, so storing anything else invites a factor-of-100 bug at the boundary.
  amount           INTEGER NOT NULL CHECK (amount > 0),
  interval_unit    TEXT NOT NULL CHECK (interval_unit IN ('month','year')),
  -- Razorpay requires a finite number of billing cycles. 120 monthly cycles is
  -- about 10 years and 10 yearly cycles is 10 years, so "renews unless
  -- cancelled" holds for any realistic subscription.
  total_count      INTEGER NOT NULL CHECK (total_count > 0),
  razorpay_plan_id TEXT NOT NULL,
  label            TEXT NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (code, currency)
);

ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;

-- Prices are public information: anyone may read the catalogue to see a price.
CREATE POLICY "billing_plans are readable by anyone"
  ON public.billing_plans FOR SELECT USING (true);

GRANT SELECT ON public.billing_plans TO anon, authenticated;
-- There is deliberately NO insert, update or delete policy, and no write grant.
-- Only the service role, which bypasses RLS, may change the catalogue.

-- Seed the four rows. The `razorpay_plan_id` values are placeholders: the
-- operator replaces them with the real plan ids in Operator step 2. They are
-- non-empty on purpose, so a function that reads this table and forgets to
-- check for a real id still fails loudly at Razorpay rather than silently
-- creating a subscription against nothing.
INSERT INTO public.billing_plans
  (code, currency, amount, interval_unit, total_count, razorpay_plan_id, label)
VALUES
  ('monthly', 'INR',  29900, 'month', 120, 'REPLACE_ME_INR_MONTHLY', 'PsyCognito Premium — Monthly'),
  ('yearly',  'INR', 299900, 'year',   10, 'REPLACE_ME_INR_YEARLY',  'PsyCognito Premium — Yearly'),
  ('monthly', 'USD',    299, 'month', 120, 'REPLACE_ME_USD_MONTHLY', 'PsyCognito Premium — Monthly'),
  ('yearly',  'USD',   2499, 'year',   10, 'REPLACE_ME_USD_YEARLY',  'PsyCognito Premium — Yearly');

-- `updated_at` should follow the row. A trigger rather than an application
-- concern, because the only writer is a hand-run SQL statement or the
-- operator's UPDATE, and neither should have to remember.
CREATE OR REPLACE FUNCTION public.touch_billing_plans()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER billing_plans_touch
  BEFORE UPDATE ON public.billing_plans
  FOR EACH ROW EXECUTE FUNCTION public.touch_billing_plans();
```

- [ ] **Step 2: Apply it and verify the rows**

Apply the migration (operator: Supabase SQL editor, or `supabase db push`). Then run this read-back in the Supabase SQL editor:

```sql
SELECT code, currency, amount, interval_unit, total_count, label
FROM public.billing_plans
ORDER BY currency, code;
```

Expected: exactly 4 rows.

```
code    | currency | amount | interval_unit | total_count | label
monthly | INR      |  29900 | month         |         120 | PsyCognito Premium — Monthly
yearly  | INR      | 299900 | year       .  |          10 | PsyCognito Premium — Yearly
monthly | USD      |    299 | month         |         120 | PsyCognito Premium — Monthly
yearly  | USD      |   2499 | year          |          10 | PsyCognito Premium — Yearly
```

(The stray `.` above is a typo in this document only; the column is `year`.)

- [ ] **Step 3: Verify the catalogue is read-only to clients**

The security property "no browser writes the catalogue" is only real if RLS rejects the write. Run this **in the SQL editor as the `anon` role**:

```sql
SET LOCAL ROLE anon;
INSERT INTO public.billing_plans (code, currency, amount, interval_unit, total_count, razorpay_plan_id, label)
VALUES ('monthly','INR',1,'month',1,'x','x');
```

Expected: `ERROR: new row violates row-level security policy for table "billing_plans"`.

If that INSERT **succeeds**, stop. The catalogue is client-writable and Decision 2 of the spec is not met.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20261009120000_billing_plans.sql
git commit -m "feat(billing): add the server-owned plan catalogue"
```

---

### Task 2: `subscriptions` and `webhook_events`

**Files:**
- Create: `supabase/migrations/20261009120100_subscriptions.sql`

**Interfaces:**
- Consumes: `auth.users` (Supabase-managed).
- Produces:
  - `public.subscriptions (id, user_id, razorpay_subscription_id, plan, currency, amount, status, current_period_end, checkout_verified_at, created_at, updated_at)`; `razorpay_subscription_id` is `UNIQUE`; `status` is `'created' | 'active' | 'cancelled' | 'halted' | 'completed'`. Read-own RLS, no write policy.
  - `public.webhook_events (id, event_type, received_at)`, `id` is the Razorpay `X-Razorpay-Event-Id`. **No policies at all** — service-role only.

**Why `current_period_end` is not the access decision.** It records what Razorpay said. `entitlements.expires_at` is what grants access. Keeping them separate means a billing bookkeeping bug cannot by itself grant access.

- [ ] **Step 1: Create the migration**

Create `supabase/migrations/20261009120100_subscriptions.sql`:

```sql
-- Billing bookkeeping for Razorpay Subscriptions, and the webhook dedupe log.
--
-- Deliberately NOT the access rule. `current_period_end` records what Razorpay
-- said; `entitlements.expires_at` is what grants access (20261008120000). One
-- writer per rule is what keeps both checkable — a bookkeeping bug here cannot
-- by itself hand out premium.

CREATE TABLE public.subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  plan                     TEXT NOT NULL CHECK (plan IN ('monthly','yearly')),
  currency                 TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  amount                   INTEGER NOT NULL,
  status                   TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created','active','cancelled','halted','completed')),
  current_period_end       TIMESTAMPTZ,
  -- Set by billing-verify-checkout. Records that a signed checkout callback was
  -- seen; it grants nothing on its own.
  checkout_verified_at     TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_idx ON public.subscriptions (user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Read your own rows, and only your own. There is deliberately no write policy:
-- rows are written only by the functions, under the service role.
CREATE POLICY "a user reads only their own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT ON public.subscriptions TO authenticated;

-- The webhook dedupe log. `id` is Razorpay's X-Razorpay-Event-Id, or a digest of
-- the raw body when that header is absent, so a missing header cannot defeat
-- deduplication.
--
-- Written AFTER the event is processed, never before: recording first would
-- swallow a retry, because the retry would see a duplicate and return 200 while
-- the grant was never written.
CREATE TABLE public.webhook_events (
  id          TEXT PRIMARY KEY,
  event_type  TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies at all, and no grants to anon or authenticated: this is not a
-- user-facing table. Service-role access only.
```

- [ ] **Step 2: Apply it and verify the shape**

Apply the migration, then run:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'subscriptions'
ORDER BY ordinal_position;
```

Expected: 11 rows, in this order — `id`, `user_id`, `razorpay_subscription_id`, `plan`, `currency`, `amount`, `status`, `current_period_end`, `checkout_verified_at`, `created_at`, `updated_at`.

- [ ] **Step 3: Verify neither table is client-writable**

Run each statement separately, in the SQL editor as `anon`:

```sql
SET LOCAL ROLE anon;
INSERT INTO public.subscriptions (user_id, razorpay_subscription_id, plan, currency, amount)
VALUES (gen_random_uuid(), 'sub_x', 'monthly', 'INR', 1);

SET LOCAL ROLE anon;
INSERT INTO public.webhook_events (id, event_type) VALUES ('evt_x', 'subscription.activated');
```

Expected for both: `ERROR: new row violates row-level security policy` (for `subscriptions`, the `user_id` foreign key may trip first — either error means the write did not land; a returned `INSERT 0 1` means stop).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20261009120100_subscriptions.sql
git commit -m "feat(billing): add subscriptions and the webhook dedupe log"
```

---

### Task 3: The pure billing core

**Files:**
- Create: `src/lib/billingWebhookCore.ts`
- Test: `src/lib/billingWebhookCore.test.ts`

**Interfaces:**
- Consumes: Web Crypto (`crypto.subtle`), available as a global in both Deno and Node 18+.
- Produces, all from `src/lib/billingWebhookCore.ts`:
  - `type SubscriptionStatus = 'created' | 'active' | 'cancelled' | 'halted' | 'completed'`
  - `type BillingPlanCode = 'monthly' | 'yearly'`, `type BillingCurrency = 'INR' | 'USD'`
  - `hmacSha256Hex(secret: string, message: string): Promise<string>` — lowercase hex
  - `sha256Hex(value: string): Promise<string>` — lowercase hex
  - `constantTimeEqual(a: string, b: string): boolean`
  - `interface EventEffect { status: SubscriptionStatus; writesEntitlement: boolean }`
  - `effectForEvent(eventType: string): EventEffect | null` — `null` means "ignore at 200"
  - `eventIdFor(eventIdHeader: string | null, rawBody: string): Promise<string>`
  - `parseCreateSubscriptionRequest(body: unknown): { ok: true; plan: BillingPlanCode; currency: BillingCurrency } | { ok: false; error: string }`

**Why this module is in `src/` and not in `supabase/functions/_shared/`.** `vitest.config.ts` sets `include: ["src/**/*.{test,spec}.{ts,tsx}"]`. That governs test *discovery*; it does not restrict what a test may import, but it does decide where a test file can live. Putting the pure module in `src/` means its test can sit beside it and be collected. The Deno functions then import it over a relative path — `'../../../src/lib/billingWebhookCore.ts'` — which Deno resolves natively because the extension is explicit. The module imports nothing at all, so it is valid in both runtimes.

**Why `writesEntitlement` is a separate field from `status`.** The event-to-status mapping and the "may this move `expires_at` forward" decision look like one table but answer two different questions. A future event that sets `status: 'active'` without extending access is expressible; so is one that extends without being the primary status event. Collapsing them is how `halted` would come to extend a paid period after a failed charge.

- [ ] **Step 1: Write the failing test**

Create `src/lib/billingWebhookCore.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  constantTimeEqual,
  effectForEvent,
  eventIdFor,
  hmacSha256Hex,
  parseCreateSubscriptionRequest,
  sha256Hex,
} from './billingWebhookCore';

describe('hmacSha256Hex', () => {
  // RFC 4231 test case 2: key = "Jefe", data = "what do ya want for nothing?".
  it('matches the RFC 4231 vector', async () => {
    await expect(hmacSha256Hex('Jefe', 'what do ya want for nothing?')).resolves.toBe(
      '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
    );
  });

  it('is lowercase hex of the right length', async () => {
    const digest = await hmacSha256Hex('secret', 'message');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when the signed bytes change', async () => {
    const a = await hmacSha256Hex('secret', '{"a":1}');
    const b = await hmacSha256Hex('secret', '{"a": 1}');
    // Whitespace matters: this is exactly why the raw body must be signed and
    // not a re-serialisation of the parsed object.
    expect(a).not.toBe(b);
  });
});

describe('sha256Hex', () => {
  it('matches the empty-string vector', async () => {
    await expect(sha256Hex('')).resolves.toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('constantTimeEqual', () => {
  it('accepts an identical pair', () => {
    expect(constantTimeEqual('abc123', 'abc123')).toBe(true);
  });

  it('rejects a one-character difference', () => {
    expect(constantTimeEqual('abc123', 'abc124')).toBe(false);
  });

  it('rejects a length difference without throwing', () => {
    expect(constantTimeEqual('abc', 'abcd')).toBe(false);
    expect(constantTimeEqual('', 'a')).toBe(false);
  });
});

describe('effectForEvent', () => {
  it('activates on activated, and may extend access', () => {
    expect(effectForEvent('subscription.activated')).toEqual({
      status: 'active',
      writesEntitlement: true,
    });
  });

  it('activates on charged, and may extend access', () => {
    expect(effectForEvent('subscription.charged')).toEqual({
      status: 'active',
      writesEntitlement: true,
    });
  });

  it('records a cancellation but does not extend access', () => {
    // Access runs to the end of the period already paid for.
    expect(effectForEvent('subscription.cancelled')).toEqual({
      status: 'cancelled',
      writesEntitlement: false,
    });
  });

  it('records a halt but does not extend access', () => {
    // halted means the last payment failed. Extending here would sell another
    // period on a charge that never succeeded.
    expect(effectForEvent('subscription.halted')).toEqual({
      status: 'halted',
      writesEntitlement: false,
    });
  });

  it('records completion but does not extend access', () => {
    expect(effectForEvent('subscription.completed')).toEqual({
      status: 'completed',
      writesEntitlement: false,
    });
  });

  it('returns null for an unknown event, so the caller answers 200', () => {
    expect(effectForEvent('payment.failed')).toBeNull();
    expect(effectForEvent('')).toBeNull();
    expect(effectForEvent('subscription.activated ')).toBeNull();
  });

  it('never moves access forward for anything but activated and charged', () => {
    const extending = ['subscription.activated', 'subscription.charged'];
    for (const type of [
      'subscription.activated',
      'subscription.charged',
      'subscription.cancelled',
      'subscription.halted',
      'subscription.completed',
    ]) {
      expect(effectForEvent(type)!.writesEntitlement).toBe(extending.includes(type));
    }
  });
});

describe('eventIdFor', () => {
  it('prefers the header when present', async () => {
    await expect(eventIdFor('evt_123', '{"a":1}')).resolves.toBe('evt_123');
  });

  it('ignores surrounding whitespace in the header', async () => {
    await expect(eventIdFor('  evt_123  ', '{"a":1}')).resolves.toBe('evt_123');
  });

  it('falls back to a body digest when the header is missing', async () => {
    // A missing header must not defeat deduplication.
    const id = await eventIdFor(null, '{"a":1}');
    expect(id).toBe(`body:${await sha256Hex('{"a":1}')}`);
  });

  it('falls back when the header is present but empty', async () => {
    await expect(eventIdFor('', '{"a":1}')).resolves.toBe(`body:${await sha256Hex('{"a":1}')}`);
  });

  it('gives different ids to different bodies', async () => {
    expect(await eventIdFor(null, '{"a":1}')).not.toBe(await eventIdFor(null, '{"a":2}'));
  });
});

describe('parseCreateSubscriptionRequest', () => {
  it('accepts a well-formed request', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'INR' })).toEqual({
      ok: true,
      plan: 'monthly',
      currency: 'INR',
    });
  });

  it('accepts the other three combinations', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'yearly', currency: 'INR' })).toMatchObject({ ok: true });
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'USD' })).toMatchObject({ ok: true });
    expect(parseCreateSubscriptionRequest({ plan: 'yearly', currency: 'USD' })).toMatchObject({ ok: true });
  });

  it('rejects a missing plan or currency', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'monthly' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ currency: 'INR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({})).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest(null)).toMatchObject({ ok: false });
  });

  it('rejects a plan or currency that is not in the catalogue', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'weekly', currency: 'INR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'EUR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ plan: 'MONTHLY', currency: 'INR' })).toMatchObject({ ok: false });
  });

  it('ignores — never honours — a price, amount or plan id in the body', () => {
    const result = parseCreateSubscriptionRequest({
      plan: 'monthly',
      currency: 'INR',
      amount: 1,
      price: 1,
      razorpay_plan_id: 'plan_attacker',
      user_id: '00000000-0000-0000-0000-000000000000',
    });
    // The result carries only the two catalogue keys, so nothing else can be
    // read out of it even by accident.
    expect(result).toEqual({ ok: true, plan: 'monthly', currency: 'INR' });
    expect(Object.keys(result).sort()).toEqual(['currency', 'ok', 'plan']);
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `npx vitest run src/lib/billingWebhookCore.test.ts`

Expected: FAIL — `Failed to resolve import "./billingWebhookCore"`. The module does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/billingWebhookCore.ts`:

```ts
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

const EFFECTS: Readonly<Record<string, EventEffect>> = Object.freeze({
  'subscription.activated': { status: 'active', writesEntitlement: true },
  'subscription.charged': { status: 'active', writesEntitlement: true },
  'subscription.cancelled': { status: 'cancelled', writesEntitlement: false },
  'subscription.halted': { status: 'halted', writesEntitlement: false },
  'subscription.completed': { status: 'completed', writesEntitlement: false },
});

/**
 * What an event type means, or `null` for "not ours — answer 200 and move on".
 *
 * `null` rather than a throw, because the webhook is auto-disabled after 24
 * hours of non-2xx and Razorpay exposes no delivery-log API. An event type we
 * do not handle is routine, not an error.
 */
export const effectForEvent = (eventType: string): EventEffect | null =>
  EFFECTS[eventType] ?? null;

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
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `npx vitest run src/lib/billingWebhookCore.test.ts`

Expected: PASS, 20 tests.

- [ ] **Step 5: Run the whole suite**

Run: `npm test`

Expected: green. No existing test touches this module.

- [ ] **Step 6: Commit**

```bash
git add src/lib/billingWebhookCore.ts src/lib/billingWebhookCore.test.ts
git commit -m "feat(billing): extract the testable billing core"
```

---

### Task 4: `billing-create-subscription`

**Files:**
- Create: `supabase/functions/billing-create-subscription/index.ts`

**Interfaces:**
- Consumes: `parseCreateSubscriptionRequest` from `../../../src/lib/billingWebhookCore.ts`; `billing_plans` and `subscriptions` from Tasks 1–2.
- Produces: a **public-to-authenticated-users** function returning `{ subscriptionId, keyId, amount, currency, label }` on success, or `{ error }` with a 4xx/5xx status. It inserts a `subscriptions` row with `status = 'created'`.

**Why no `start_at`.** The standing order says to use it *"only after checkout authorization"*. Scheduling a future start before the user has authorized a mandate would be authorizing on their behalf. The subscription starts on authorization; the free window is the separate app-side trial.

**Why `keyId` is safe to return.** The Razorpay key id is publishable. The secret is never returned, never logged, and never reaches the browser.

- [ ] **Step 1: Create the function**

Create `supabase/functions/billing-create-subscription/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { parseCreateSubscriptionRequest } from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')?.trim();
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    // Fail loudly and stop. Never fall back to a guess, and never a partial
    // configuration: an id without a secret would create subscriptions that
    // could never be verified.
    if (!keyId || !keySecret) return json({ error: 'Payments are not configured.' }, 500);

    // The caller's identity comes from the JWT, never from the body.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Not signed in.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Not signed in.' }, 401);

    const parsed = parseCreateSubscriptionRequest(await req.json().catch(() => null));
    if (!parsed.ok) return json({ error: parsed.error }, 400);

    // The price, the interval and the Razorpay plan id all come from here, and
    // only from here. The body supplied a plan code and a currency; nothing it
    // sent is trusted for anything else.
    const { data: plan, error: planError } = await supabase
      .from('billing_plans')
      .select('amount, currency, total_count, razorpay_plan_id, label')
      .eq('code', parsed.plan)
      .eq('currency', parsed.currency)
      .maybeSingle();

    if (planError || !plan) return json({ error: 'That plan is not available.' }, 404);

    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: plan.razorpay_plan_id,
        total_count: plan.total_count,
        quantity: 1,
        customer_notify: 1,
        // The only note we attach, and the only place the user id appears in
        // the Razorpay payload. It is a convenience for the dashboard, not a
        // trust boundary: the webhook resolves the user from this table.
        notes: { user_id: user.id },
      }),
    });

    if (!response.ok) {
      console.error('Razorpay rejected the subscription', response.status, await response.text());
      return json({ error: 'Could not start checkout.' }, 502);
    }

    const subscription = (await response.json()) as { id?: string };
    const subscriptionId = subscription?.id;
    if (!subscriptionId) return json({ error: 'Could not start checkout.' }, 502);

    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      razorpay_subscription_id: subscriptionId,
      plan: parsed.plan,
      currency: plan.currency,
      amount: plan.amount,
      status: 'created',
    });
    if (insertError) {
      console.error('Could not record the subscription', insertError);
      return json({ error: 'Could not start checkout.' }, 500);
    }

    return json({
      subscriptionId,
      keyId,
      amount: plan.amount,
      currency: plan.currency,
      label: plan.label,
    });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not start checkout.' }, 500);
  }
});
```

- [ ] **Step 2: Type-check and lint the new file**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: no errors from `src/`. The edge function sits outside `tsconfig.app.json`'s include, so it is not type-checked by the app build — that is pre-existing for all three existing functions and is not changed here.

- [ ] **Step 3: Verify the missing-secret path**

Deploy with the secrets unset, then:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-create-subscription" \
  -H "Authorization: Bearer $USER_JWT" -H 'Content-Type: application/json' \
  -d '{"plan":"monthly","currency":"INR"}'
```

Expected: `500`, with body `{"error":"Payments are not configured."}`. If it returns 200 or 400, the guard is not first and must be moved.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/billing-create-subscription/index.ts
git commit -m "feat(billing): create a Razorpay subscription from the server catalogue"
```

---

### Task 5: `billing-verify-checkout`

**Files:**
- Create: `supabase/functions/billing-verify-checkout/index.ts`

**Interfaces:**
- Consumes: `hmacSha256Hex`, `constantTimeEqual` from `../../../src/lib/billingWebhookCore.ts`; `subscriptions` from Task 2.
- Produces: a function returning `{ verified: true }` on a good signature, `{ error }` + 400 on a bad one. It writes `subscriptions.checkout_verified_at` and **never** writes `entitlements`.

**Why it grants nothing.** A valid checkout signature proves control of the payment, not that the mandate is live. The webhook is the source of truth, and the client shows *"Payment received — activating…"* until it lands.

- [ ] **Step 1: Create the function**

Create `supabase/functions/billing-verify-checkout/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { constantTimeEqual, hmacSha256Hex } from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    if (!keySecret) return json({ error: 'Payments are not configured.' }, 500);

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Not signed in.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Not signed in.' }, 401);

    const body = await req.json().catch(() => ({}));
    const paymentId = String(body?.razorpay_payment_id ?? '');
    const subscriptionId = String(body?.razorpay_subscription_id ?? '');
    const signature = String(body?.razorpay_signature ?? '');
    if (!paymentId || !subscriptionId || !signature) {
      return json({ error: 'Missing payment details.' }, 400);
    }

    // Razorpay's subscription checkout signs `payment_id|subscription_id`.
    const expected = await hmacSha256Hex(keySecret, `${paymentId}|${subscriptionId}`);
    if (!constantTimeEqual(expected, signature)) {
      return json({ error: 'Payment could not be verified.' }, 400);
    }

    // Scoped to the caller's own row. A signature proves the payment is real;
    // it does not prove this session is the one that made it, so the update is
    // keyed to the JWT's user id as well as the subscription id.
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ checkout_verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('razorpay_subscription_id', subscriptionId)
      .eq('user_id', user.id);
    if (updateError) {
      console.error('Could not record the verified checkout', updateError);
      return json({ error: 'Payment could not be verified.' }, 500);
    }

    // No entitlements write. That is the whole point.
    return json({ verified: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Payment could not be verified.' }, 500);
  }
});
```

- [ ] **Step 2: Verify a bad signature is rejected**

```bash
curl -s -w '\n%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-verify-checkout" \
  -H "Authorization: Bearer $USER_JWT" -H 'Content-Type: application/json' \
  -d '{"razorpay_payment_id":"pay_x","razorpay_subscription_id":"sub_x","razorpay_signature":"deadbeef"}'
```

Expected: `400` and `{"error":"Payment could not be verified."}`.

- [ ] **Step 3: Verify a good signature still writes no entitlement**

Compute a real signature over a subscription you own (operator: Razorpay dashboard → the test subscription → the payment id, or use a Razorpay test signature helper), POST it, then run in the SQL editor:

```sql
SELECT count(*) FROM public.entitlements WHERE source = 'razorpay';
```

Expected: **unchanged** from before the call. This is the security property that separates the checkout callback from the grant; if this count went up, `billing-verify-checkout` has taken over the webhook's job and must be corrected.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/billing-verify-checkout/index.ts
git commit -m "feat(billing): verify a subscription checkout without granting access"
```

---

### Task 6: `billing-webhook`

**Files:**
- Create: `supabase/functions/billing-webhook/index.ts`
- Modify: `supabase/config.toml`

**Interfaces:**
- Consumes: `hmacSha256Hex`, `constantTimeEqual`, `effectForEvent`, `eventIdFor` from `../../../src/lib/billingWebhookCore.ts`; `subscriptions`, `webhook_events`, `entitlements`.
- Produces: a **public** function — `verify_jwt = false` — that writes `subscriptions.status`, sets `entitlements.expires_at` for `activated`/`charged`, and records the dedupe row **after** processing.

**Order of operations, which is the security-relevant part:**

1. `const raw = await req.text()` — the raw body, read before any parsing.
2. Read `X-Razorpay-Signature`; absent or malformed → 400.
3. HMAC the raw body with `RAZORPAY_WEBHOOK_SECRET`, compare constant-time; mismatch → 400. **No entitlement write happens before this passes.**
4. Only now `JSON.parse(raw)`.
5. Event id from `X-Razorpay-Event-Id`, or a body digest.
6. **Process first, record the event id second.** Recording first would swallow a retry: insert the dedupe row, then fail, and the retry sees a duplicate and returns 200 while the grant was never written.
7. Map `razorpay_subscription_id` → the `subscriptions` row → `user_id`. Not found → log and return 200.

- [ ] **Step 1: Add the function config**

`supabase/config.toml` currently holds one line, `project_id = "lusgyknbmprhmxbkkdbo"`. Append:

```toml
# The webhook is called by Razorpay, not by a user, and authenticates by HMAC
# signature over the raw body. It accepts no user JWT, so JWT verification must
# be off — with it on, every delivery would be rejected before the signature
# check and no grant would ever be written.
[functions.billing-webhook]
verify_jwt = false
```

- [ ] **Step 2: Create the function**

Create `supabase/functions/billing-webhook/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  constantTimeEqual,
  effectForEvent,
  eventIdFor,
  hmacSha256Hex,
} from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // 1. The RAW body, before any parsing. JSON.parse followed by re-stringify
  //    would change the signed bytes and break every signature.
  const raw = await req.text();

  // 2. The signature header.
  const signature = (req.headers.get('X-Razorpay-Signature') ?? '').trim();
  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return json({ error: 'Missing or malformed signature.' }, 400);
  }

  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')?.trim();
  if (!secret) return json({ error: 'Payments are not configured.' }, 500);

  // 3. Verify before parsing. No database read or write has happened yet.
  const expected = await hmacSha256Hex(secret, raw);
  if (!constantTimeEqual(expected, signature.toLowerCase())) {
    return json({ error: 'Invalid signature.' }, 400);
  }

  // 4. Only now is the body trusted enough to parse.
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Malformed body.' }, 400);
  }

  try {
    const eventType = String(payload?.event ?? '');
    const effect = effectForEvent(eventType);
    // 5. Idempotent dedupe key, derived before processing so it is available
    //    for the record-after step below.
    const eventId = await eventIdFor(req.headers.get('X-Razorpay-Event-Id'), raw);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const razorpaySubscriptionId = String(
      payload?.payload?.subscription?.entity?.id ?? '',
    );

    // An unknown event type is routine, not an error: answer 200 so Razorpay
    // does not disable the webhook.
    if (effect && razorpaySubscriptionId) {
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan')
        .eq('razorpay_subscription_id', razorpaySubscriptionId)
        .maybeSingle();

      if (subError) throw subError;

      if (sub) {
        // The period end Razorpay reports, in seconds since the epoch.
        const currentEnd = payload?.payload?.subscription?.entity?.current_end;
        const periodEnd =
          typeof currentEnd === 'number' && currentEnd > 0
            ? new Date(currentEnd * 1000).toISOString()
            : null;

        const { error: statusError } = await supabase
          .from('subscriptions')
          .update({
            status: effect.status,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_subscription_id', razorpaySubscriptionId);
        if (statusError) throw statusError;

        if (effect.writesEntitlement && periodEnd) {
          // An absolute assignment, never an increment: applying the same
          // event twice produces the same row, so a redelivery cannot compound
          // access. `plan` comes from the subscription row the server wrote at
          // checkout, never from the webhook body.
          //
          // No `WHERE source <> 'admin'` guard appears here because PostgREST's
          // upsert cannot express a conditional update. The guard lives in the
          // BEFORE INSERT OR UPDATE trigger added by Task 7, which binds every
          // writer of this table rather than only this one. Deploy Task 7's
          // migration with this function, or the owner's grant is overwritable.
          const { error: grantError } = await supabase
            .from('entitlements')
            .upsert(
              {
                user_id: sub.user_id,
                plan: sub.plan,
                source: 'razorpay',
                expires_at: periodEnd,
                note: `razorpay ${eventType} ${razorpaySubscriptionId}`,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' },
            );
          if (grantError) throw grantError;
        }
      } else {
        // Not our subscription. Retrying will not help, so do not ask for one.
        console.warn('Webhook for an unknown subscription', razorpaySubscriptionId);
      }
    }

    // 6. Record AFTER processing. Recording first would swallow a retry: the
    //    retry would see a duplicate and return 200 while the grant was never
    //    written.
    const { error: dedupeError } = await supabase
      .from('webhook_events')
      .insert({ id: eventId, event_type: eventType });
    // A unique-violation here means a genuine concurrent redelivery that both
    // processed. Processing is idempotent, so the second write was harmless.
    if (dedupeError && dedupeError.code !== '23505') throw dedupeError;

    return json({ received: true });
  } catch (e) {
    // A genuine processing failure must NOT be a silent 200: Razorpay would
    // stop retrying and the grant would be lost permanently.
    console.error('Webhook processing failed', e);
    return json({ error: 'Processing failed.' }, 500);
  }
});
```

- [ ] **Step 3: Confirm the entitlement write carries no guard of its own**

Read back the function you just wrote and confirm the `entitlements` write is a plain `upsert(..., { onConflict: 'user_id' })` whose `plan` comes from `sub.plan` — the row the server wrote at checkout — and not from the webhook body:

```bash
grep -n "from('entitlements')" -A 14 supabase/functions/billing-webhook/index.ts
```

Expected: exactly one `from('entitlements')`, one `onConflict: 'user_id'`, and `plan: sub.plan`. **No `rpc(` call appears anywhere in this function**, and no `payload` value feeds `plan`, `amount`, or `user_id`.

The `WHERE source <> 'admin'` guard the spec describes is deliberately **absent here**, because PostgREST's `upsert` has no conditional-update form and a read-then-write in this function would race a concurrent webhook. It is enforced instead by the `BEFORE INSERT OR UPDATE` trigger on `entitlements` that **Task 7, Step 1** adds, which binds every writer of the table rather than only this one. **Apply Task 7's migration before deploying this function** — until it exists, a cancellation would overwrite the owner's developer grant.

- [ ] **Step 4: Verify the signature gate is first**

```bash
curl -s -w '\n%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-webhook" \
  -H 'Content-Type: application/json' \
  -H 'X-Razorpay-Signature: 0000000000000000000000000000000000000000000000000000000000000000' \
  -d '{"event":"subscription.charged","payload":{"subscription":{"entity":{"id":"sub_x","current_end":9999999999}}}}'
```

Expected: `400` and `{"error":"Invalid signature."}`, and — checked immediately after in the SQL editor:

```sql
SELECT count(*) FROM public.entitlements WHERE source = 'razorpay';
SELECT count(*) FROM public.webhook_events;
```

Expected: both counts are **unchanged**. A bad signature must leave no trace at all.

- [ ] **Step 5: Verify an unsigned and a malformed request**

```bash
curl -s -w '\n%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-webhook" \
  -H 'Content-Type: application/json' -d '{"event":"subscription.charged"}'

curl -s -w '\n%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-webhook" \
  -H 'Content-Type: application/json' \
  -H 'X-Razorpay-Signature: nothex' -d '{}'
```

Expected: both `400`.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/billing-webhook/index.ts supabase/config.toml
git commit -m "feat(billing): add the public subscription webhook"
```

---

### Task 7: The admin-grant guard, and `billing-cancel` / `billing-restore`

**Files:**
- Create: `supabase/migrations/20261009120200_entitlement_admin_guard.sql`
- Create: `supabase/functions/billing-cancel/index.ts`
- Create: `supabase/functions/billing-restore/index.ts`

**Interfaces:**
- Consumes: `entitlements` (20261008120000), `subscriptions` and `webhook_events` (Task 2), `web_subscriptions` (20260908123511).
- Produces:
  - A trigger `entitlements_protect_admin` on `public.entitlements` that discards any non-`admin` write to a row whose current `source` is `'admin'`.
  - `billing-cancel` — no input, returns `{ cancelled: true }`, writes no `entitlements`.
  - `billing-restore` — no input, returns `{ restored: boolean }`, upserts an `entitlements` grant for a verified pre-existing buyer.

**Why a trigger rather than a `WHERE` clause.** The spec writes the guard as part of an SQL upsert (`ON CONFLICT ... DO UPDATE ... WHERE source <> 'admin'`). The webhook reaches Postgres through PostgREST's `upsert`, which has no conditional-update form — so there is nowhere for that clause to live on the function side. Putting the guard in a `BEFORE` trigger puts it in the database, which is where the spec says it belongs, and makes it apply to *every* writer (the webhook, `billing-restore`, and the operator's backfill) rather than only the one that remembered to include it.

**Why a trigger that silently discards rather than raising.** Raising would surface as a 500 from the webhook, which must not 5xx on a routine event. An admin's row simply does not move.

- [ ] **Step 1: Write the guard migration**

Create `supabase/migrations/20261009120200_entitlement_admin_guard.sql`:

```sql
-- Billing must never overwrite a developer grant.
--
-- The standing order requires that "webhooks and failed charges must not remove
-- it". The spec expresses that as `WHERE public.entitlements.source <> 'admin'`
-- inside the webhook's upsert — but the webhook writes through PostgREST, whose
-- upsert has no conditional-update form, so there is no place for that clause on
-- the function side.
--
-- A BEFORE trigger puts the rule in the database instead, which is stronger: it
-- binds every writer — the webhook, billing-restore, and the operator's backfill
-- — rather than only the one that remembered to include the clause.
--
-- It discards silently rather than raising. Raising would surface as a 500 from
-- the webhook, and a webhook is auto-disabled after 24 hours of non-2xx.

CREATE OR REPLACE FUNCTION public.protect_admin_entitlement()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  existing_source text;
BEGIN
  -- Only a write that would replace an existing admin row is of interest.
  -- A brand-new row, or a row that is not the caller's business, passes.
  IF TG_OP <> 'UPDATE' THEN
    RETURN NEW;
  END IF;

  SELECT e.source INTO existing_source
  FROM public.entitlements e
  WHERE e.user_id = NEW.user_id;

  IF existing_source = 'admin' THEN
    -- Leave the row exactly as it is.
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER entitlements_protect_admin
  BEFORE UPDATE ON public.entitlements
  FOR EACH ROW EXECUTE FUNCTION public.protect_admin_entitlement();

-- An upsert that hits an existing row is an UPDATE, so the trigger covers it.
-- An insert of a user who already holds an admin row cannot happen: the primary
-- key is user_id, so it conflicts and takes the UPDATE path.
```

- [ ] **Step 2: Verify the guard actually protects a developer grant**

Run in the SQL editor. Substitute a real auth user id for `$USER_ID`. **Use a throwaway test account, not the owner's** — this writes and then removes a row.

```sql
-- Seed an admin grant.
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('$USER_ID', 'developer', 'admin', NULL, 'guard test')
ON CONFLICT (user_id) DO UPDATE SET plan='developer', source='admin', expires_at=NULL;

-- Try to clobber it the way the webhook would.
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('$USER_ID', 'monthly', 'razorpay', now() + interval '30 days', 'guard test')
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan, source = EXCLUDED.source, expires_at = EXCLUDED.expires_at;

-- It must still be the admin grant.
SELECT plan, source, expires_at FROM public.entitlements WHERE user_id = '$USER_ID';
```

Expected: `developer | admin | NULL`. If it returns `monthly | razorpay | <a date>`, the guard is not working and the owner's access is at the mercy of every webhook.

Then clean up, because the next step reuses the same `$USER_ID` and needs a clean slate:

```sql
DELETE FROM public.entitlements WHERE user_id = '$USER_ID';
```

Without this, the next step's upsert lands on the surviving `source='admin'` row, the trigger discards it, and that step's own `UPDATE` is discarded with it — so it would report `developer | admin` instead of `yearly | razorpay` and look like a broken trigger. It is not; it is a dirty fixture.

- [ ] **Step 3: Verify a non-admin row still updates**

```sql
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('$USER_ID', 'monthly', 'razorpay', now() + interval '30 days', 'guard test')
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan, source = EXCLUDED.source, expires_at = EXCLUDED.expires_at;

UPDATE public.entitlements SET plan = 'yearly' WHERE user_id = '$USER_ID';

SELECT plan, source FROM public.entitlements WHERE user_id = '$USER_ID';
```

Expected: `yearly | razorpay`. The trigger must not block ordinary billing writes.

Then clean up: `DELETE FROM public.entitlements WHERE user_id = '$USER_ID';`

- [ ] **Step 4: Create `billing-cancel`**

Create `supabase/functions/billing-cancel/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')?.trim();
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    if (!keyId || !keySecret) return json({ error: 'Payments are not configured.' }, 500);

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Not signed in.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Not signed in.' }, 401);

    // No input is read. The subscription is resolved from the caller's own id.
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('razorpay_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError) throw subError;
    if (!sub) return json({ error: 'There is no active subscription to cancel.' }, 400);

    const response = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${sub.razorpay_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
          'Content-Type': 'application/json',
        },
        // Keep the period already paid for. Cancelling immediately would take
        // away time the user has paid for.
        body: JSON.stringify({ cancel_at_cycle_end: 1 }),
      },
    );

    if (!response.ok) {
      console.error('Razorpay refused the cancellation', response.status, await response.text());
      return json({ error: 'Could not cancel the subscription.' }, 502);
    }

    // No entitlements write. The webhook records the cancellation, exactly as
    // it records everything else, and access runs to the period end.
    return json({ cancelled: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not cancel the subscription.' }, 500);
  }
});
```

- [ ] **Step 5: Create `billing-restore`**

Create `supabase/functions/billing-restore/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Not signed in.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Not signed in.' }, 401);

    // The email comes from the verified session and nowhere else. Any email in
    // the body is ignored, so this cannot be used to claim someone else's
    // purchase or to probe whether an address has ever paid.
    if (!user.email || !user.email_confirmed_at) {
      return json({ error: 'Confirm your email address first.' }, 403);
    }

    const { data: purchase, error: lookupError } = await supabase
      .from('web_subscriptions')
      .select('plan, current_period_end')
      .ilike('email', user.email)
      .eq('status', 'paid')
      .gt('current_period_end', new Date().toISOString())
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!purchase) return json({ restored: false });

    const { error: grantError } = await supabase.from('entitlements').upsert(
      {
        user_id: user.id,
        plan: purchase.plan,
        source: 'razorpay',
        expires_at: purchase.current_period_end,
        note: 'restored from web_subscriptions',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (grantError) throw grantError;

    return json({ restored: true, plan: purchase.plan, expiresAt: purchase.current_period_end });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not restore access.' }, 500);
  }
});
```

- [ ] **Step 6: Verify restore cannot be used to probe another address**

```bash
curl -s -w '\n%{http_code}\n' -X POST \
  "https://<project-ref>.supabase.co/functions/v1/billing-restore" \
  -H "Authorization: Bearer $USER_JWT" -H 'Content-Type: application/json' \
  -d '{"email":"someone-else@example.com"}'
```

Expected: `{"restored":false}` if the **JWT's own** address has no purchase — never a result about `someone-else@example.com`. If the response differs when that body field changes, the function is reading the body and must be corrected.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/20261009120200_entitlement_admin_guard.sql \
        supabase/functions/billing-cancel/index.ts \
        supabase/functions/billing-restore/index.ts
git commit -m "feat(billing): protect the admin grant, and add cancel and restore"
```

---

## Operator steps for Plan A

Claude cannot reach the Supabase or Razorpay dashboards. These are manual, and Plan A is not live until they are done.

1. **Set the function secrets** (test keys only): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`. Until they are set, every function returns *"Payments are not configured."*
2. **Create the four Razorpay Plans** matching Decision 3 exactly (₹299/mo, ₹2,999/yr, $2.99/mo, $24.99/yr), and replace the four `REPLACE_ME_*` values in `billing_plans` with the real `plan_id`s.
3. **Create the webhook** in the Razorpay dashboard → `https://<project-ref>.supabase.co/functions/v1/billing-webhook`, subscribing `subscription.activated`, `.charged`, `.cancelled`, `.halted`, `.completed`, with the same `RAZORPAY_WEBHOOK_SECRET`. **Watch its dashboard**: there is no delivery-log API, and it auto-disables after 24 hours of non-2xx.
4. **Apply the migrations** in order, then deploy `billing-create-subscription`, `billing-verify-checkout`, `billing-cancel`, `billing-restore`, and finally `billing-webhook`.
5. **Confirm international payments is enabled** on the Razorpay account, or the USD rows cannot be sold (spec Assumption 4).

The three migrations from `2026-10-08-paywall-developer-access.md` and its admin `INSERT` are still a prerequisite and remain unchanged.

## What Plan A deliberately does not do

- **No client changes.** `PaywallModal` still calls the retired order path until Plan B lands. Both systems exist for the length of that gap, which is why Plan B follows immediately.
- **No deletion of `razorpay-create-order`, `razorpay-verify` or `razorpay-status`.** Plan B §12.
- **No backfill.** Plan B §12.
- **No entitlement rule change.** `has_premium()` and `current_entitlement()` are untouched: a `source = 'razorpay'` row was already permitted by the existing `CHECK`, and an unexpired `expires_at` was already the right rule. This plan adds a *writer*, not a rule.
