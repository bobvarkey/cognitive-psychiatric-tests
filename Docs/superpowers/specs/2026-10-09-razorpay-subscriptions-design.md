# Razorpay Subscriptions, the account page, and the premium gate

**Date:** 2026-10-09
**Status:** Approved 2026-10-09. Amended the same day to resolve a contradiction
between §7 and §10 over the dev-only developer unlock; as first written, §10's
Testing gate ("the five developer-email-stripping tests must pass unmodified")
was unsatisfiable, because four of the five call storage that §10 also removed.
**Branch:** `main`

**Supersedes, for this work only.** The Non-goals of
`2026-10-08-paywall-developer-access-design.md` forbid two things this design
must do: *"No change to the client-side `localStorage` premium path
(`webBilling.ts`)"* and *"No change to `razorpay-create-order`,
`razorpay-verify`, or `razorpay-status`."* That spec anticipated this work and
fenced it off deliberately:

> **Forward implication.** When the Razorpay web path is eventually routed
> through `entitlements` (out of scope here), `source: 'razorpay'` will be
> honoured inside the native app… recorded here so it is not discovered by
> accident.

That migration is this spec. The two non-goals above are withdrawn **for the
billing path only**. Every other decision, non-goal and security property of
the 2026-10-08 spec stands unchanged, and this document does not restate them
as if new.

## Problem

The app sells Premium through **one-time Razorpay orders**. That path cannot be
the premium path, for reasons the owner's own standing order states as rules:

- *"One-time orders are not the premium path."* An order is a single charge with
  no renewal, no cancellation and no failure signal.
- *"Do not grant lasting access from the frontend callback."* `razorpay-verify`
  writes `current_period_end` from the browser's success callback, and the
  browser then stores the result in `localStorage`. Access is minted client-side.
- *"No browser client may write entitlements."* `saveWebPremium`
  (`webBilling.ts:100`) writes `psycognito.webPremium.v1` from the browser, and
  `SubscriptionContext` honours it as an access source.
- *"Add a public webhook … the webhook is the source of truth."* There is **no
  webhook function in this repo.** Nothing ever downgrades: a cancelled or
  failed subscription keeps access until its stored date passes, and a renewal
  is never recorded.

Two further facts shape the work:

1. **No `/account` page exists.** Routes are `/`, `/history`, `/settings`,
   `/account-deleted`, `/glossary`, `/category/:category`, `/assessment/:id`,
   `/terms`, `/privacy`. Account state today is an `AccountAccessCard` inside
   Settings, behind the gate — so the owner cannot read the auth user id an
   administrator must grant. (A temporary fix for that shipped as `cc604fb`; it
   moves into the page this spec builds.)
2. **There are only two tables** — `web_subscriptions` and `entitlements` — and
   all 96 assessments are in the client bundle. That bounds what RLS can
   enforce, and the **Honest limitations** section states the bound rather than
   implying a stronger guarantee.

## Decisions

Chosen explicitly; not open for reinterpretation during implementation.

| # | Decision | Choice |
|---|---|---|
| 1 | Payment path | Razorpay **Subscriptions** only. One-time orders are retired, not kept alongside |
| 2 | Plan catalogue | A server-owned `billing_plans` table. The browser reads it to display prices and may never send one |
| 3 | Prices | INR ₹299/mo (`29900`) · ₹2,999/yr (`299900`). USD $2.99/mo (`299`) · $24.99/yr (`2499`) |
| 4 | Currencies | Both. USD requires international payments enabled on the Razorpay account — see Assumption 4 |
| 5 | Pricing surface | The existing `PaywallModal` only. **No new `/pricing` route** |
| 6 | Account surface | A **new public `/account` route**, reachable signed out |
| 7 | Account gating | `/account` is open to anyone with access; only the **manage-billing controls** require an active paid subscription |
| 8 | Access source | `entitlements` only, plus the dev-only developer unlock in dev builds. `localStorage` stops being an access source **for billing** |
| 9 | Grant authority | The webhook writes grants. Checkout verify grants nothing |
| 10 | Developer grant | Unchanged: an admin `INSERT` on the exact auth user id. Never written by billing, never overwritten by it |
| 11 | Trial | Unchanged and independent: the existing `start_trial()` RPC, one per account, database clock |
| 12 | Keys | Test keys. Switching to live is a separate, explicit instruction |
| 13 | Implementation shape | Two plans: (A) server billing path, (B) client surface, retirement and backfill. (A) is the part that touches money and must be provable alone |
| 14 | Post-checkout receipt | A public `/checkout/success` page that reads the server, never `localStorage`. Supersedes the in-progress order-backed version |

## Non-goals

Do not do these as part of this work.

- No change to the RevenueCat / store purchase path, or to native suppression.
- No change to the 3-day trial's length, its membership rule, or its anchoring.
- No removal of `has_premium()` or `current_entitlement()`.
- No email-based access key anywhere. No whitelist, no self-service role.
- No new premium *content* moved server-side. This spec does not attempt to make
  the assessment gate enforceable; it says so plainly instead (see **Honest
  limitations**).
- No `/pricing` route, no marketing page, no redesign of the paywall.
- No switching to live Razorpay keys.

## Design

### 1. Server — the plan catalogue

New table, seeded by migration. This is the single source of truth for price,
currency, interval and the Razorpay plan id.

```sql
CREATE TABLE public.billing_plans (
  code           TEXT NOT NULL CHECK (code IN ('monthly','yearly')),
  currency       TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  amount         INTEGER NOT NULL CHECK (amount > 0),   -- minor units: paise / cents
  interval_unit  TEXT NOT NULL CHECK (interval_unit IN ('month','year')),
  total_count    INTEGER NOT NULL CHECK (total_count > 0),
  razorpay_plan_id TEXT NOT NULL,
  label          TEXT NOT NULL,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (code, currency)
);

ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;

-- Prices are public information; anyone may read the catalogue to see a price.
CREATE POLICY "billing_plans are readable by anyone"
  ON public.billing_plans FOR SELECT USING (true);

GRANT SELECT ON public.billing_plans TO anon, authenticated;
-- No INSERT/UPDATE/DELETE policy: only the service role may change the catalogue.
```

Seed rows (the four `razorpay_plan_id` values are operator-supplied — see
**Operator steps**):

| code | currency | amount | interval_unit | total_count | label |
|---|---|---|---|---|---|
| `monthly` | `INR` | `29900` | `month` | `120` | PsyCognito Premium — Monthly |
| `yearly` | `INR` | `299900` | `year` | `10` | PsyCognito Premium — Yearly |
| `monthly` | `USD` | `299` | `month` | `120` | PsyCognito Premium — Monthly |
| `yearly` | `USD` | `2499` | `year` | `10` | PsyCognito Premium — Yearly |

**Why a table and not a constant in the function.** Razorpay plan ids are
created outside this repo and change when a price changes. As a table the
operator updates a price with one `UPDATE`, without a redeploy, and the client
still cannot influence it: there is no write policy, so every client write is
rejected. As a client constant it would be exactly the thing the standing order
forbids — *"Never trust plan id, price, currency, or user id from the browser."*

**`total_count`.** Razorpay requires a finite number of billing cycles. 120
monthly cycles ≈ 10 years and 10 yearly cycles = 10 years, so *"renews unless
cancelled"* holds for any realistic subscription; `subscription.completed` fires
only at that horizon. It is a catalogue value the operator can raise without a
code change.

### 2. Server — `subscriptions` and `webhook_events`

```sql
CREATE TABLE public.subscriptions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_subscription_id  TEXT NOT NULL UNIQUE,
  plan                      TEXT NOT NULL CHECK (plan IN ('monthly','yearly')),
  currency                  TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  amount                    INTEGER NOT NULL,
  status                    TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created','active','cancelled','halted','completed')),
  current_period_end        TIMESTAMPTZ,
  checkout_verified_at      TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_idx ON public.subscriptions (user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "a user reads only their own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT ON public.subscriptions TO authenticated;
-- No write policy: the browser cannot write this table either.
```

`current_period_end` is deliberately not the access decision. It records what
Razorpay said; `entitlements.expires_at` is what grants access. Keeping them
separate means a billing bookkeeping bug cannot by itself grant access.

```sql
CREATE TABLE public.webhook_events (
  id          TEXT PRIMARY KEY,          -- Razorpay's X-Razorpay-Event-Id
  event_type  TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies at all: service-role access only. It is not a user-facing table.
```

### 3. Server — `billing-create-subscription`

Authenticated. Replaces `razorpay-create-order` for the premium path.

- **Auth:** `Authorization: Bearer <user JWT>`; the caller's id comes from
  `auth.getUser(token)` — never from the body.
- **Input:** `{ plan: 'monthly' | 'yearly', currency: 'INR' | 'USD' }` and
  nothing else. Amount, plan id and user id are **not accepted**; a request
  carrying them is ignored, not honoured.
- **Steps:**
  1. Reject anything but those two `plan` and two `currency` literals → 400.
  2. Read the `billing_plans` row for `(plan, currency)`. Absent → 404.
  3. Require `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Missing → **500
     `'Payments are not configured.'`** and stop; do not guess.
  4. `POST https://api.razorpay.com/v1/subscriptions` with
     `{ plan_id, total_count, quantity: 1, customer_notify: 1, notes: { user_id } }`,
     authenticated with HTTP Basic over the key pair.
  5. Insert a `subscriptions` row: caller's id, `razorpay_subscription_id`,
     `plan`, `currency`, `amount`, `status = 'created'`.
  6. Return `{ subscriptionId, keyId, amount, currency, label }`.

**`keyId` is safe to return** — the Razorpay key id is publishable. The secret is
never returned, never logged, and never reaches the browser.

**No `start_at`.** The standing order says to use it *"only after checkout
authorization"*; scheduling a future start before the user has authorized a
mandate would be authorizing on their behalf. The subscription starts on
authorization, and the free window is the separate app-side trial (Decision 11).

### 4. Server — `billing-verify-checkout`

Authenticated. Separates "the user finished checkout" from "the user is paid".

- **Input:** `{ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }`.
- **Verify:** HMAC-SHA256 of `` `${payment_id}|${subscription_id}` `` keyed with
  `RAZORPAY_KEY_SECRET`, compared to `razorpay_signature` with the existing
  constant-time comparison (`razorpay-verify/index.ts:73`).
- **Mismatch → 400, no write.**
- **Match →** set `subscriptions.checkout_verified_at = now()` for the row whose
  `razorpay_subscription_id` matches **and** whose `user_id` is the caller → return
  `{ verified: true }`.

**It writes no `entitlements` row.** That is the whole point: a valid checkout
signature proves control of the payment, not that the mandate is live. The
webhook is the source of truth, and the client shows *"Payment received —
activating…"* until the webhook lands.

### 5. Server — `billing-webhook`

**Public.** `verify_jwt = false`; it is called by Razorpay, not by a user. It
accepts **no** user JWT.

Order of operations, which is the security-relevant part:

1. `const raw = await req.text()` — the **raw body**, read before any parsing.
2. Read `X-Razorpay-Signature`. Absent or malformed → **400**.
3. `expected = HMAC-SHA256(raw, RAZORPAY_WEBHOOK_SECRET)`; compare constant-time.
   Mismatch → **400**. **No entitlement write happens before this passes.**
4. Only now `JSON.parse(raw)`. A body that fails to parse after a valid
   signature → 400.
5. Event id from `X-Razorpay-Event-Id`, falling back to SHA-256 of the raw body
   when the header is absent, so a missing header cannot defeat deduplication.
6. **Process first, record the event id second.** Recording first would swallow a
   retry: insert the dedupe row, then fail, and the retry sees a duplicate and
   returns 200 while the grant was never written. Processing is idempotent by
   construction (§ below), so a duplicate delivery is harmless even before the
   dedupe row exists.
7. Map `razorpay_subscription_id` → our `subscriptions` row → `user_id`. Not
   found → log and return **200** (it is not our subscription; retrying will not
   help).

Applied events:

| Event | `subscriptions.status` | `entitlements` |
|---|---|---|
| `subscription.activated` | `active` | upsert; `expires_at = current_end` |
| `subscription.charged` | `active` | upsert; `expires_at = current_end` |
| `subscription.cancelled` | `cancelled` | **unchanged** — access runs to the paid period end |
| `subscription.halted` | `halted` | **not extended** — access lapses at `current_end` |
| `subscription.completed` | `completed` | unchanged — the mandate will not renew |

Any other event type → **200**, ignored.

**Idempotent by construction.** For `activated` and `charged` the write is an
upsert keyed on `user_id` whose value is the absolute `current_end` from
Razorpay, so applying the same event twice produces the same row. `cancelled`,
`halted` and `completed` never move `expires_at` forward. Nothing here is
additive, so a redelivery cannot compound.

**The developer grant is protected in SQL, not in code:**

```sql
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ($1, $2, 'razorpay', to_timestamp($3), $4)
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan,
      source = EXCLUDED.source,
      expires_at = EXCLUDED.expires_at,
      updated_at = now()
  WHERE public.entitlements.source <> 'admin';
```

The `WHERE` makes an admin grant unwritable by billing, which is what the
standing order requires: *"Webhooks and failed charges must not remove it."*

**It must not 5xx.** A webhook is auto-disabled after 24 hours of non-2xx
responses, and Razorpay exposes no delivery-log API — only the dashboard. So:
handled, duplicated, unknown-type and unmapped events all return **200**. A
genuine processing failure returns **500** so Razorpay retries, and is logged
loudly, because a silent success would lose the grant permanently.

### 6. Server — access rule (unchanged)

`current_entitlement()` and `has_premium()` are not modified by this work. A
`source = 'razorpay'` row is already permitted by the existing `CHECK`
constraint on `entitlements.source`, and the existing rule — an unexpired
`expires_at`, or `NULL` for a permanent grant — is already the right rule for a
subscription that lapses when it stops being paid. This work adds a **writer**,
not a rule.

### 7. Client — `SubscriptionContext`

`isPremium` loses the `localStorage` term **for billing**, and keeps one
explicit, separate term for the dev-only developer unlock:

```
isPremium = isPremiumUser()
          || <the server holds a grant>
          || (import.meta.env.DEV && isDevUnlocked())
```

What is removed as an access source is the browser-written `WebPremium` record —
the one `saveWebPremium` wrote from the client when an order was paid. The dev
term is a different thing and stays, because it cannot exist in a production
build: `import.meta.env.DEV` is the literal `false` there, so the minifier drops
the term, the email list and the call together. Five tests in
`webBilling.test.ts` exist to prove exactly that, which is why they must keep
passing unmodified.

`premiumSource` keeps its existing
precedence (`web` → `developer` → `demo` → `store` → `none`) and its existing
mapping from the grant's `source` (`razorpay` → `web`). `checkingServerAccess`
already exists and is what keeps the banner from flashing while entitlement is
loading — it is unchanged, and the post-checkout refresh below reuses it.

### 8. Client — `/account`, a new public route

Added to `PUBLIC_PATHS` alongside `/terms` and `/privacy`, so it is reachable
**signed out**. That is not incidental: access is an admin grant keyed to an auth
user id, and this page is where that id is readable. If it sat behind the gate,
the owner could not obtain the id that lets them through the gate.

Contents, in order:

1. **Sign in** — email one-time code, reusing `requestEmailCode` /
   `verifyEmailCode`. `shouldCreateUser: true` means signing in *is* registering;
   no separate signup form exists or is wanted (Decision 10 forbids a
   self-service role).
2. **Plan** — the effective grant: `plan`, `source`, and either the trial end or
   the renewal date, with amount and currency (`subscriptions.amount` /
   `currency` for a paid plan, the catalogue for a trial). This satisfies
   *"Account must show plan, trial-end or renewal date, amount, currency."*
3. **Manage billing** — rendered only when the caller holds an **active paid
   subscription**:
   - *Cancel subscription* → `billing-cancel` → Razorpay's cancel API. The
     webhook is what records it; the button does not assume success.
   - When `status = 'halted'`: a recoverable state — *"Your last payment didn't
     go through"* and a link to retry. A failed payment never marks the user paid.
   - *Nothing* is rendered for a `developer`, `trial` or `demo` grant — those
     hold access without a subscription, and a "cancel" button there would be a
     lie.
4. **Auth user id** — the id and the exact `INSERT … ON CONFLICT` grant statement,
   with a copy button. This is the `AccessDiagnostic` component from `cc604fb`,
   moved here and kept as the diagnostic screen the standing order requires.

The page is reachable by anyone with access; only section 3 is paid-only. Gating
the whole page on "has a paid plan" would lock out the owner's own developer
grant and every running trial — the same class of bug as `e33ee13`.

### 9. Client — `PaywallModal`, still the only pricing surface

- Reads the catalogue from `billing_plans` and displays it. It sends only
  `{ plan, currency }`; it never sends a price.
- **Before authorization**, shows the first charge date, amount, currency and
  plan, and states that it renews unless cancelled. Account creation is not
  consent to charge, so this is shown at the point of paying, not at sign-in.
- Currency comes from the existing `getWebCurrency()` (INR for India, USD
  elsewhere), now selecting a catalogue row rather than a client constant.
- The 3-day trial entry is unchanged and still calls `start_trial`.
- **After checkout:** `billing-create-subscription` → Razorpay Checkout with the
  returned `subscription_id` → `handler` → `billing-verify-checkout` → the modal
  shows *"Payment received — activating…"* and re-reads `current_entitlement()`
  every 2 s for up to 30 s, and again on window focus. This is what makes
  *"hide it as soon as verified access is active, including after checkout,
  without a manual refresh"* true, while `checkingServerAccess` prevents a flash.
  If the webhook has not landed within the bound, the message becomes "still
  activating — check back shortly" rather than a false success. A buyer
  redirected to the dedicated receipt in §14 sees the same state there.

### 10. Client — `webBilling.ts` shrinks

Removed: `startWebCheckout` (the order path), and the **billing** use of
`getWebPremium` / `saveWebPremium` / `STORE_KEY`. After this work no payment path
reads or writes them, and a paid account is recorded only in `entitlements`.

Retained, unchanged: `getWebCurrency`, `yearlySavingPercent`, `parseDeveloperEmails`,
`DEVELOPER_EMAILS`, `isDeveloperEmail` — and, because they are that unlock's own
store, `getWebPremium` / `saveWebPremium` / `STORE_KEY` as well. The dev-only
developer unlock behind `import.meta.env.DEV` keeps working, which five tests pin
as stripped from production builds. **It must stay stripped and dev-only**; it is
the only acceptable form of an email-based unlock, and only because it cannot
exist in a production bundle.

That retention narrows `restoreWebPurchase`. It is the function `isDeveloperEmail`
used to feed; once `restoreWebPurchaseForSession` is deleted it has no other
caller, so it resolves the dev unlock or returns `null` — it must not reach for a
session this work removes.

Retained, re-pointed: the restore-by-verified-email flow
(`requestRestoreCode` / `verifyRestoreCode`). It still proves email ownership
with a one-time code, but on success it now calls `billing-restore` (§13), which
writes a **server-side `entitlements` row** rather than a `localStorage` flag.
`restoreWebPurchaseForSession` is deleted with it: the context reads the grant
directly through `current_entitlement()`, so there is nothing left for it to
restore. The browser proves who it is; the server decides what that is worth.

New `src/lib/billing.ts`: `fetchBillingPlans()`, `startSubscription(plan, currency)`,
`verifyCheckout(...)`, `cancelSubscription()`, `waitForEntitlement({ timeoutMs })`.

### 11. Trial interaction

`start_trial()` is unchanged: one trial per account ever, refused when **any**
`entitlements` row already exists for the caller. Two consequences, both
intended and both worth stating:

- Subscribing during a trial overwrites the `demo`/`trial` row with a
  `razorpay` row, because the webhook upserts on `user_id`. The user moves from
  a 3-day grant to a paid one without a gap.
- Cancelling a subscription does **not** restore trial eligibility. A trial is
  once per account, and a lapsed subscriber has used theirs.

### 12. Retiring the order path, and existing buyers

`razorpay-create-order`, `razorpay-verify` and `razorpay-status` are **deleted**,
not merely left unlinked, so exactly one payment system exists. `razorpay-status`
is subsumed by `current_entitlement()`, which the context already calls, and
`restoreWebPurchaseForSession` goes with it. `web_subscriptions` is retained as a
historical billing record: it is read only by `billing-restore` (§13) and by the
backfill below, both under the service role and keyed to a verified email, and
never by the browser.

Buyers are kept whole by a **backfill script the operator runs**, never
automatically on deploy:

```sql
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
SELECT u.id, ws.plan, 'razorpay', ws.current_period_end,
       'backfill web_subscriptions ' || ws.order_id
FROM public.web_subscriptions ws
JOIN auth.users u ON lower(u.email) = lower(ws.email)
WHERE ws.status = 'paid' AND ws.current_period_end > now()
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan, source = EXCLUDED.source,
      expires_at = EXCLUDED.expires_at, updated_at = now()
  WHERE public.entitlements.source <> 'admin';
```

The same `source <> 'admin'` guard applies: a backfill must not overwrite the
owner's developer grant either.

A second, read-only query lists paid rows with no matching auth user. Those are
buyers who paid without ever creating an account; they have no user id to key a
grant to. The script **reports them** rather than silently dropping them, and
the retained restore flow is how they recover: they sign in with the email they
paid with, and the server writes their grant. This is the case the standing
order's *"A failed payment shows recovery"* does not cover, and it is handled
rather than assumed away.

### 13. Server — `billing-cancel` and `billing-restore`

Two small authenticated functions. Both take no meaningful input, both resolve
the caller from their verified session, both write under the service role, and
both carry the same `source <> 'admin'` guard as the webhook.

**`billing-cancel`.** No input; the caller's own subscription is resolved from
their id. Finds the row whose `status = 'active'` and whose
`razorpay_subscription_id` is set, then calls Razorpay's
`POST /v1/subscriptions/{id}/cancel` with `cancel_at_cycle_end: 1`, so the user
keeps the period they already paid for. **It does not write `entitlements`** —
the webhook records the cancellation, exactly as it records everything else. No
active subscription → 400, and the UI never offers the control in that state.

**`billing-restore`.** No input. The email comes from the verified session; any
email in the body is ignored, so this cannot be used to claim someone else's
purchase or to probe whether an email has paid. Looks up `web_subscriptions` for
a row where `lower(email)` equals the session's **confirmed** email with
`status = 'paid'` and `current_period_end > now()`. If one exists, and the caller
holds no `admin` row, it upserts an `entitlements` grant (`source = 'razorpay'`,
`expires_at = current_period_end`). This is the only route by which a
pre-existing buyer who never created an account recovers, and it is idempotent:
the same lookup on the same verified email produces the same row.

### 14. Client — `/checkout/success`, the receipt

A buyer who has just paid lands on `/checkout/success`, reachable without access
— it joins `/terms`, `/privacy` and `/account` in `PUBLIC_PATHS` — because it is
reached in the window between the checkout callback and the webhook landing, when
the buyer legitimately holds no entitlement yet and the gate would otherwise
bounce them to a paywall they had just paid to satisfy.

**It reads from the server, never from browser storage.** This is the one
substantive change from the version already in progress, which reads
`WebPremium.orderId` out of `localStorage` — a field that ceases to exist when
§10 removes `WebPremium`:

- plan, amount and currency come from the caller's own `subscriptions` row
  (RLS: read-own) and the effective grant from `current_entitlement()`, not from
  `WebPremium`;
- while no entitlement is present yet, it shows the activating state and re-reads
  every 2 s for up to 30 s, exactly as §9 does — **a receipt is not a claim of
  access**, and it grants nothing;
- if the webhook has not landed within the bound it says so and points at
  `/account`, rather than rendering a paid receipt for a payment it cannot
  confirm;
- the retired path's order id is not a field it can show; a `subscriptions`-backed
  receipt shows the Razorpay subscription id instead.

The receipt is a *view* over the same two server tables the rest of the app
reads. It must not become a second source of truth for whether the user is paid;
`entitlements` remains the only one.

## Security properties

Stated so they can be checked rather than assumed.

- **The webhook verifies before it parses.** The raw body is HMAC-SHA256'd with
  `RAZORPAY_WEBHOOK_SECRET` and compared constant-time to `X-Razorpay-Signature`
  before any JSON parsing and before any database read or write. Missing,
  malformed and mismatched signatures are all 400 with no state change.
- **The webhook accepts no user JWT**, and the checkout-verify path cannot grant
  access. Lasting access is written only by a body Razorpay signed.
- **No browser writes `entitlements`.** RLS is enabled with a read-own policy and
  no write policy. The only writers are the webhook, `billing-restore` and the
  backfill — all under the service role, none reachable by a client write.
- **No email is an access key.** Identity is `auth.users.id` through a verified
  session. The one email-keyed flow, restore, ends in a server-side write keyed
  to the verified user id.
- **Prices, currency, plan ids and user ids come from the server.** The browser
  sends `{ plan, currency }` and nothing else.
- **A cancelled, halted or completed subscription never extends access.**
  `cancelled` and `completed` leave `expires_at` alone; `halted` does not touch
  it. Only `activated` and `charged` move it forward.
- **The developer grant is unwritable by billing**, enforced by the
  `WHERE source <> 'admin'` clause rather than by remembering not to.
- **A duplicate delivery cannot compound access**, because every write sets an
  absolute `current_end` rather than adding to a total.
- **The production bundle contains no developer email list**, because the
  dev-only unlock keeps its `import.meta.env.DEV` guard.

## Honest limitations

Stated because the standing order asks for enforcement that the current
architecture cannot provide, and it would be wrong to imply otherwise.

- **The assessment gate remains advisory.** *"Enforce on every premium function
  and query with RLS"* presumes premium queries exist. They do not: all 96
  assessments are in the client bundle and no request is made to render one.
  RLS here covers `entitlements`, `subscriptions` and `billing_plans` — the
  *records* — and not the *content*. A determined user with developer tools
  reaches premium content. This is pre-existing, is unchanged by this work, and
  would require moving content server-side to fix, which is out of scope.
- **The client decides whether to honour the server's answer.** Inherent to a
  client-side gate, and already recorded in the 2026-10-08 spec. This work
  removes the more permissive `localStorage` path; it does not make the gate
  authoritative.
- **USD sales depend on the Razorpay account.** A USD catalogue row can be
  created and displayed whether or not the account can charge in USD.
  Assumption 4 is the check.

## Operator steps

Claude cannot reach the Supabase or Razorpay dashboards; these are manual.

1. **Set the function secrets** (test keys): `RAZORPAY_KEY_ID`,
   `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`. If any is missing the
   functions refuse with *"Payments are not configured."* — they never fall back
   to a guess. **Do not switch to live keys.**
2. **Create the four Razorpay Plans** to match Decision 3 and paste their
   `plan_id`s into `billing_plans` (`UPDATE` or the seed migration).
3. **Create the webhook** in the Razorpay dashboard →
   `https://<project-ref>.supabase.co/functions/v1/billing-webhook`, subscribing
   `subscription.activated`, `.charged`, `.cancelled`, `.halted`, `.completed`,
   with the same `RAZORPAY_WEBHOOK_SECRET`. **Watch its dashboard**: there is no
   delivery-log API, and it auto-disables after 24 hours of non-2xx.
4. **Apply the migrations**, then deploy `billing-create-subscription`,
   `billing-verify-checkout`, `billing-webhook`. The webhook must be deployed
   with JWT verification **off**.
5. **Run the backfill** (§12) and read its unmatched-rows report.
6. **Confirm international payments is enabled** on the Razorpay account, or set
   the USD rows' `razorpay_plan_id` to a working plan and note that USD cannot be
   sold.

The 2026-10-08 operator queue still stands unchanged and is a prerequisite: the
three paywall migrations, the admin grant, and the types regeneration.

## Testing

Edge functions have no runner in this repo; their logic is tested through the
client module that calls them and by contract for the SQL they emit.

`src/lib/billing.test.ts` (new):

- `fetchBillingPlans` maps the catalogue rows and returns `null`/`[]` on error
  rather than throwing into a render;
- `startSubscription` sends **only** `{ plan, currency }` — asserted on the
  invoked function's argument, so a future edit that adds `amount` fails;
- `verifyCheckout` returns `verified: false` and does not treat a transport error
  as success;
- `waitForEntitlement` resolves on the first non-null entitlement and rejects at
  its bound, rather than hanging.

`src/components/PaywallModal.subscription.test.tsx` (new):

- the displayed price, currency and amount come from the catalogue, not from a
  constant in the bundle;
- the first-charge date, amount, currency and plan are shown before Checkout is
  opened, with the renewal statement;
- a completed checkout shows the activating state, and the paywall is gone once
  the entitlement arrives — with no manual refresh;
- a checkout whose webhook never lands ends on the "still activating" message,
  not on a success claim;
- a failed payment shows recovery and does not render the user as paid.

`src/pages/Account.test.tsx` (new):

- signed out, it renders the email-code sign-in and no plan section;
- a `developer` grant shows the grant and **no** cancel control;
- a running `trial` shows the trial end date and **no** cancel control;
- an `active` paid subscription shows plan, renewal date, amount, currency and
  the cancel control;
- a `halted` subscription shows the recovery state and does not read as paid;
- the auth user id and the grant statement render for a signed-in account and
  **never** for a signed-out visitor.

`src/pages/CheckoutSuccess.test.tsx` (exists in progress; rewritten to these):

- a buyer with no entitlement yet sees the activating state and no paid receipt;
- the receipt's plan, amount and currency come from the server row — asserted by
  making `localStorage` hold a contradictory `WebPremium` and requiring the page
  to ignore it, which is the regression that matters here;
- once the entitlement arrives, the receipt renders without a manual refresh;
- if the webhook never lands within the 30 s bound, the page says so and links to
  `/account`, and does not render as paid;
- a visitor with no session sees the sign-in prompt, not a receipt.

`src/lib/entitlement.test.ts` (existing, extended):

- a `source: 'razorpay'` grant yields `premiumSource: 'web'` and access.

Regression, and it is a real gate rather than a formality:

- `src/lib/webBilling.test.ts` — the five developer-email-stripping tests must
  pass **unmodified**. They are the proof that the dev unlock stays dev-only.
  The order-checkout tests are expected to be deleted with the code they cover.
- The whole suite green, and `tsc` clean, after the `webPremium` term is removed
  from `SubscriptionContext`.

## Assumptions to confirm

1. **The owner can set function secrets and deploy functions** in the Supabase
   project. If not, the webhook cannot exist and the whole design fails; there is
   no fallback that satisfies "the webhook is the source of truth".
2. **Only test keys will be used** for now. This spec is written for test keys;
   live keys are a separate instruction and a separate verification pass.
3. **Four Razorpay Plans will be created** matching Decision 3 exactly. A price
   change afterwards is an `UPDATE` to `billing_plans` plus a new Razorpay Plan —
   never an edit to a live plan.
4. **International payments is enabled** on the Razorpay account, or USD cannot
   be sold and the USD rows and the `getWebCurrency()` USD branch should be
   dropped together.
5. **The four Razorpay webhook events are the complete set this product needs.**
   If Razorpay emits something else material for subscriptions, it is not
   handled and will be ignored at 200.
6. **Retiring the order path is acceptable**, including that `web_subscriptions`
   buyers are migrated by a script rather than automatically, and that buyers
   with no account recover through the restore flow.
7. **The `/account` page being public is acceptable.** It exposes a sign-in form
   and, to a signed-in user, only their own account data.

## Rejected approaches

Recorded so they are not re-proposed without new information.

- **Keeping the one-time order path alongside Subscriptions.** Forbidden by
  *"Do not … add a second payment or entitlement system"*, and it would leave the
  browser-written `localStorage` grant live, which is the defect being fixed.
- **Granting access from the checkout callback** so the paywall clears
  immediately. Forbidden: *"A valid checkout signature does not by itself grant
  lasting access."* The activating state in §9 is the honest UI for the real
  delay.
- **An email whitelist for the owner's account.** Proposed again during this
  work and declined. Forbidden by *"No email check, localStorage flag, or
  self-service role"*, ships a personal address into the public bundle, and was
  already rejected by name in the 2026-10-08 spec. The sanctioned paths are the
  admin grant on the auth user id, and the dev-only `VITE_DEVELOPER_EMAILS`
  unlock that cannot exist in a production build.
- **A `razorpay_plan_id` or price held in the client bundle.** The standing order
  forbids trusting it, and a table the client cannot write is the cheaper way to
  be sure.
- **Recording the webhook event id before processing.** It converts a retryable
  failure into a permanently lost grant.
- **Reading `subscriptions.current_period_end` for the access decision.** It is
  billing bookkeeping; `entitlements.expires_at` is the access rule, and one
  writer per rule is what keeps them checkable.
