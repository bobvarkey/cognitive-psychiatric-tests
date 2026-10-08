# Home-page paywall and developer access

**Date:** 2026-10-08
**Status:** Design approved and revised; awaiting written-spec review
**Revised:** 2026-10-08 — the trial scope and the paywall's behaviour were re-specified
after the first version was written. See **Trial scope and anchoring** below; the
earlier *Non-goals* that forbade changing the demo trial no longer apply.
**Branch:** `main` (the `feat/server-side-entitlement` foundation was merged as `56a91e8`)

## Problem

The app needs a working paywall on the home page, and the owner needs to reach
every part of the product with their own account without paying themselves and
without that access appearing in the App Store build.

Beyond that, the paywall has to *do something* for everyone else. A visitor
should be able to try a bounded slice of the product for three days and then
meet a paywall that asks them to subscribe. Today there is no such funnel: the
demo trial is a `localStorage` flag, restartable from a button inside the
paywall itself, and `getDemoTrialStart()` (`subscriptionService.ts:78`) mints a
fresh three days whenever its key is missing — so clearing storage, opening a
private window, or using a second device starts the trial over, indefinitely.
The gate is nominal.

Three things are already true in this repo, and they shape everything below.

1. **A paywall already exists.** `AuthGuard` wraps every route including `/`.
   Any caller who is not premium and not in the demo trial gets a full-screen
   `PaywallModal` with no dismiss. `src/pages/Index.tsx` is just
   `<AssessmentSelector />`. The gap is not the paywall's existence.

2. **A server-side entitlement foundation already exists, and is not wired to
   the gate.** Branch `feat/server-side-entitlement` adds
   `supabase/migrations/20261008120000_entitlements.sql`, `src/lib/entitlement.ts`
   and `src/components/AccountAccessCard.tsx`. The table is keyed to
   `auth.users.id`, `expires_at IS NULL` means permanent, RLS grants read-own-row
   with *no write policy at all*, and `has_premium()` decides access on the
   database clock. `AccountAccessCard` is mounted in Settings only; `AuthGuard`
   still decides access from the client-side path. Nothing writes the table
   except a manual admin `INSERT`.

3. **The migration has not been applied.** `src/integrations/supabase/types.ts`
   lists `web_subscriptions` but not `entitlements`, so the generated types
   predate it. This is what lets us edit that migration in place rather than
   stacking a second one on top.

The request that prompted this work arrived as a plan to hardcode an email and
UUID into `webBilling.ts` and `SubscriptionContext.tsx` and to add a permanent
`web_subscriptions` row expiring in 2099. That plan is not adopted, for the
reasons in **Rejected approach** below.

## Decisions

These were chosen explicitly and are not open for reinterpretation during
implementation.

| # | Decision | Choice |
|---|---|---|
| 1 | Foundation | Build on the `entitlements` table, keyed to `auth.users.id` |
| 2 | Scope | **Additive.** One more way to hold Pro; nothing existing is removed or changed |
| 3 | Native | Suppress **only** admin comps inside the App Store build; paid paths are untouched |
| 4 | Server API | Extend the RPC to report the grant's `plan`/`source` rather than adding a second function |
| 5 | Trial membership | The trial unlocks the **Triage & Core Flows** section: 20 of 96 assessments (21%) |
| 6 | Trial mechanism | Membership is an explicit `trial: true` flag on each of those 20 registry entries, **not** a positional slice — inserting a test at the top must never silently reshuffle what is free |
| 7 | Trial anchoring | The 3-day trial is recorded in `entitlements` as `plan: 'demo'`, `source: 'trial'`, so clearing storage, a private window or a second device cannot restart it |
| 8 | Trial entry | Starting the trial **requires signing in with an email one-time code**. A grant keyed to a user id presupposes a user |

**Consequence of 7 and 8, stated plainly:** an anonymous visitor who will not
sign in can reach nothing but the paywall. The three-day trial is not available
without an account, because a server-anchored grant needs an identity to anchor
to. This is a deliberate narrowing of the funnel, and it is the only reason the
trial can be a real gate rather than a speed bump.

## Non-goals

Explicitly out of scope. Do not do these as part of this work.

- No backfill of existing `web_subscriptions` buyers into `entitlements`.
- No change to the client-side `localStorage` premium path (`webBilling.ts`).
- No change to the RevenueCat / store purchase path.
- No change to `razorpay-create-order`, `razorpay-verify`, or `razorpay-status`.
- No removal of `has_premium()` or its SQL grant.
- No change to the 3-day trial's *length*.

**Amended at the revision.** Two of the original non-goals are withdrawn,
because the trial work requires exactly what they forbade:

- ~~"No change to the demo trial, its length, or its restartability."~~ The
  restarts are the thing being fixed. The length stays three days; the
  client-side restart path goes.
- ~~"No change to how the paywall looks, where it appears, or when it is
  shown."~~ The paywall gains a trial-entry state and a per-assessment locked
  state, and stops rendering a close button that does nothing.

What is *not* withdrawn from the original intent: the paywall remains a
full-screen modal, it still gates the app for anyone without access, and the
existing Razorpay and RevenueCat purchase paths are untouched.

## Prerequisite (step 0): reconcile the branch with `origin/main`

**Complete.** The foundation was merged into `main` as `56a91e8`, so
`origin/main` is an ancestor of the working branch and this step is behind us.
The original reasoning is kept below only so the ordering constraint is
recorded.

The branch forked from `534beb2`; `origin/main` was then `6fa0bb7`, **16 commits
further on**. Those 16 commits were exactly the billing subsystem this work sits
next to:

```
src/lib/webBilling.ts                          +234
src/components/PaywallModal.tsx               +232
src/contexts/SubscriptionContext.tsx           +50
src/lib/webBilling.test.ts                    +221 (new)
supabase/functions/razorpay-status/index.ts    +24
```

Building on the branch as-is would mean editing the pre-OTP
`SubscriptionContext` and shipping a regression against the live Razorpay
restore flow. Merging `origin/main` into the branch is **conflict-free** —
verified with `git merge-tree --write-tree` (exit 0, no conflicted files),
because the branch's two commits only add `src/lib/entitlement.ts`, the
entitlements migration, `src/components/AccountAccessCard.tsx`, and one import
line each in `App.tsx` and `SettingsView.tsx`.

The branch has no upstream (`git branch -vv` shows no `[origin/...]`), so either
rebase or merge is safe. **Preferred: rebase the 2 commits onto `origin/main`**
for linear history.

One unrelated change rides along in those commits and is not part of this design:
`App.tsx` switches `import AccountDeleted from "./pages/AccountDeleted"` to a
**named** import, because the branch's base only had the named export.
`origin/main`'s `AccountDeleted.tsx` now exports both, so the rebase resolves
either way and the line is inert. Leave it as the rebase produces it.

Do not start step 1 until `origin/main` is an ancestor of the working branch.

## Design

### 1. Server — edit `20261008120000_entitlements.sql` in place

Keep the table, the RLS policy, the absence of write policies, and the admin
grant instructions exactly as they are. Add one function and redefine another.

```sql
-- The caller's active grant, in full. SECURITY INVOKER (the default) so the
-- caller's own RLS read-policy applies: this can only ever see the caller's row.
CREATE OR REPLACE FUNCTION public.current_entitlement()
RETURNS TABLE (plan text, source text, expires_at timestamptz, permanent boolean)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT e.plan, e.source, e.expires_at, (e.expires_at IS NULL)
  FROM public.entitlements e
  WHERE e.user_id = auth.uid()
    AND (e.expires_at IS NULL OR e.expires_at > now())
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.current_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_entitlement() TO authenticated;

-- Unchanged in meaning: "does the caller hold any active grant". Now a thin
-- wrapper, so the access rule lives in exactly one place.
CREATE OR REPLACE FUNCTION public.has_premium()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.current_entitlement());
$$;
```

`has_premium()` keeps its original `REVOKE`/`GRANT` statements verbatim, and its
signature and meaning are unchanged.

**Note:** `has_premium()` keeps a caller. `AccountAccessCard.tsx:41` uses it for
the access badge, so it is *not* an uncalled function and there is no
carry-an-uncalled-function question to answer. It stays as the source-agnostic
predicate ("does the caller hold *any* grant"), now implemented as a thin
wrapper so the access rule lives in exactly one place.

**Why a table-returning function:** the client needs `source` to apply the
native suppression rule. Returning it from the same call that answers "do they
hold a grant" keeps the check to one round trip and one source of truth.

### 2. Client access decision — `src/lib/entitlement.ts`

Replace the boolean with the full grant, and add the composed decision.

```ts
export type EntitlementPlan = 'developer' | 'monthly' | 'yearly' | 'demo';
export type EntitlementSource = 'admin' | 'razorpay' | 'trial' | 'demo';

export interface Entitlement {
  plan: EntitlementPlan;
  source: EntitlementSource;
  expiresAt: string | null;
  /** true when expires_at IS NULL, i.e. the grant never lapses. */
  permanent: boolean;
}

/** The caller's active grant as the server reports it, or null. Fails closed. */
export async function currentEntitlement(): Promise<Entitlement | null>;

/**
 * The grant as this device may honour it, or null — `serverPremium()`'s rule,
 * but keeping `source` visible. The trial is a grant too, and downstream code
 * has to be able to tell a three-day trial from a paid plan.
 */
export async function serverEntitlement(): Promise<Entitlement | null>;

/**
 * Whether the server grants access *on this device*. An admin comp is ignored
 * inside the native wrapper, so the App Store build never inherits it.
 */
export async function serverPremium(): Promise<boolean>;
```

Requirements:

- **Fails closed.** An RPC error, no session, or an unreachable backend all
  resolve to `null` / `false`. Nothing about the device, its cache, or its clock
  can turn that into a yes.
- `currentEntitlement()` reads only `current_entitlement()`; it does not fall
  back to `has_premium()`.
- `serverPremium()` composes the grant with the device:

  ```ts
  const ent = await currentEntitlement();
  if (!ent) return false;                              // fails closed
  if (ent.source === 'admin' && (await isNativeApp())) return false;  // step 3
  return true;
  ```

  Suppression applies to admin grants only. It is **not** a blanket "ignore the
  server inside the native app" — a `razorpay` source must still return `true`.
- The existing narrow RPC cast stays, scoped to the one call, because
  `current_entitlement` is absent from the generated `Database` types. Delete it
  once types are regenerated (step 6).
- `requestEmailCode`, `verifyEmailCode`, `signOut`, `currentAuthUser` and
  `onAuthChange` are unchanged.

### 3. Native detection

Two pieces, so that both a React consumer and a plain async caller can use it.

**`src/lib/appbuild/revenuecat.ts`** gains one exported function, next to the
existing synchronous `isNativePurchasesAvailable()`:

```ts
/** True only inside the native wrapper, once its ready promise has settled. */
export async function isNativeApp(): Promise<boolean> {
  return !!(await waitForWrapper()) && isNativePurchasesAvailable();
}
```

**`src/hooks/useIsNativeApp.ts`** (new) wraps it for React:

```ts
useIsNativeApp(): { isNative: boolean; resolved: boolean }
```

The async step is unavoidable: the wrapper injects its plugin after first paint,
with a 1 s timeout (`src/lib/appbuild/wrapper.ts:24`). `PaywallModal.tsx:87`
already handles the same race and is the precedent to copy. `src/lib/entitlement.ts`
imports the plain `isNativeApp()`, not the hook — the access decision is not a
React concern.

**Suppression rule.** A grant is suppressed when running native **and**
`source === 'admin'`. `source` is the discriminator, not `plan`, because it
generalises: any comp an administrator issues later is also suppressed on
native, while a genuine paid grant (`razorpay`) is not.

All existing native detection stays in `src/lib/appbuild/`. The new hook is a
thin consumer of it; it must not read `window.AppbuildWrapper` directly.

**Forward implication.** When the Razorpay web path is eventually routed through
`entitlements` (out of scope here), `source: 'razorpay'` will be honoured inside
the native app and will unlock it without IAP. That is a product decision for
that migration, and it is recorded here so it is not discovered by accident.

### 4. `SubscriptionContext` — the single point of truth

`AuthGuard`, `AdBanner`, `AssessmentSelector`, `AssessmentCard` and
`SettingsView` all read access through `useSubscription()`. Changing the context
changes the gate everywhere with no call-site churn.

Add to the context value:

- `serverPremium: boolean` — the composed decision from step 2.
- `checkingServerAccess: boolean` — true from mount until the first answer.
- `premiumSource` gains `'developer'`, reported only when the grant's `source` is
  `admin`.

Fold the new source in **additively**:

```
isPremium = isPremiumUser() || !!webPremium || <the server holds a grant>
```

Re-check on mount and on every `onAuthChange`, and clear the server grant on
sign-out so a signed-out device cannot keep server-derived access.

**The context must keep the grant's `source`, not just a boolean.** Added at the
revision. A trial is a grant, so `serverPremium` is true for a 3-day trial as
well as for a paid plan — a boolean cannot tell them apart, and the trial work
needs exactly that distinction, because a trial unlocks a subset of the
assessments while a paid plan unlocks all of them. Deriving `premiumSource` from
a bare boolean would map a trial to `'developer'` and hand a trial user the whole
product.

`premiumSource` precedence: `web` → `developer` → `demo` → `store` → `none`, read
from the grant's `source`:
`admin` → `developer`; `razorpay` → `web`; `trial` and `demo` → `demo` (it *is*
the demo trial). `developer` outranks `demo` so the owner sees why they have
access.

### 5. `AuthGuard` — no paywall flash

`AuthGuard` currently shows `PaywallModal` whenever access is absent. With an
async check in the path, a developer would see the paywall for the duration of
the RPC.

Required behaviour:

- While `checkingServerAccess` is true **and** no other source already grants
  access, render a neutral loading state — not the paywall.
- Once resolved, show `PaywallModal` if and only if access is still absent.
- Public paths (`/terms`, `/privacy`) and the demo-trial path are unchanged.

The loading state must always terminate, or the app is permanently blank. All
three paths are bounded and each must clear `checkingServerAccess` in a
`finally`:

| Path | Bound | Result |
|---|---|---|
| Server answers | network | access honoured or refused |
| RPC errors / no session | immediate | `null` → refused, paywall shows |
| Wrapper never injects its plugin | 1 s `waitForWrapper` timeout | `isNativeApp()` → `false`, no suppression |

Because the third path resolves to "not native", a browser is never suppressed
and a slow wrapper never blocks the gate.

### 6. Steps the operator runs

Claude cannot reach the Supabase project; these are manual.

1. Apply the edited `20261008120000_entitlements.sql`.
2. Run the admin grant once, in the Supabase SQL editor:
   ```sql
   INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
   VALUES ('5ba70276-e265-4afb-84fb-fea80d335e8b', 'developer', 'admin', NULL, 'owner')
   ON CONFLICT (user_id) DO UPDATE
     SET plan = 'developer', source = 'admin', expires_at = NULL;
   ```
   `AccountAccessCard.tsx:98` renders this exact statement with the signed-in
   account's own id, so it can be copied rather than typed.
3. Regenerate types (`supabase gen types typescript`) and delete the RPC cast in
   `src/lib/entitlement.ts`.

### 7. Testing

`src/lib/entitlement.test.ts` (new):

- fails closed on RPC error, on no session, and when the returned row is empty;
- web + `source: 'admin'` → `true`;
- native + `source: 'admin'` → `false` (the whole point);
- native + `source: 'razorpay'` → `true` (suppression is not blanket);
- an entitlement with `expires_at` in the past is not returned by the server and
  therefore yields `false`.

`src/contexts/SubscriptionContext.test.tsx` (new):

- `serverPremium: true` makes `isPremium` true when every other source is off;
- `premiumSource` reports `'developer'`;
- sign-out clears `serverPremium`;
- `checkingServerAccess` is true on first render and false after resolution.

For the trial (added at the revision):

`supabase/functions/trial-start/index.ts` — tested by its contract, since edge
functions have no runner here; the logic is exercised through the client module
that calls it.

- refuses a request with no JWT, or with a token `auth.getUser` rejects;
- **is idempotent**: a second call for a user who already has a trial row returns
  the same `expires_at` and performs no insert;
- a user holding a paid grant is returned that grant and is never given a trial
  row;
- the inserted row is `plan: 'demo'`, `source: 'trial'`, expiring 3 days out.

`src/lib/trialScope.test.ts` (new) — the membership rule, extracted so it can be
tested without rendering a 1200-line component:

- the 20 flagged keys are exactly the Triage & Core Flows section;
- no entry outside that section carries `trial: true`;
- an assessment with no `trial` flag is locked.

`src/components/AssessmentSelector` — lock enforcement, via the extracted
predicate rather than by rendering the whole selector:

- a locked key is refused when there is no access;
- a locked key is allowed when `isProSource` is true;
- a locked key is allowed while the trial is running;
- a flagged key is allowed with no access at all, because it is the trial's whole
  content.

Regression: the existing suite must stay green **without edits** —
`src/lib/webBilling.test.ts` and `src/components/PaywallModal.restore.test.tsx`
in particular. If either needs changing, the change is not additive and the
implementation has drifted from decision 2.

## Trial scope and anchoring

Added at the revision. Two changes to the trial, so that it becomes a real gate
and so that it does not give the whole product away.

### 8. Membership — which assessments the trial unlocks

The trial unlocks the **Triage & Core Flows** section of the registry: the 20
entries from `triage` through `consciousness`, at the top of
`AssessmentSelector.tsx`'s `assessments` array. That is 21% of 96, which is the
"25%" asked for, rounded to a section boundary so the free set is a rule rather
than an arbitrary cut.

The mechanism is an explicit flag, not a position. `AssessmentInfo` gains one
optional member:

```ts
interface AssessmentInfo {
  key: AssessmentKey;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  category: Category[];
  description: string;
  /** Open to a 3-day trial without a paid plan. Absent means locked. */
  trial?: boolean;
}
```

and each of the 20 free entries gets `trial: true` written on it.

**Why a flag and not `assessments.slice(0, 20)`:** position is not a property
anyone maintains. Inserting one new assessment at the top of the array would
silently evict `consciousness` from the free set and hand a different test to
every trial user, with no diff that says so. A flag survives reordering, and
`git diff` shows exactly which tests are free.

**Adding a test later:** a new entry is locked unless someone writes
`trial: true` on it. That is the safe default — the failure mode is a test that
is too locked, which is visible, rather than one that is silently free.

### 9. Anchoring — a trial that cannot be restarted

The trial row goes in the same `entitlements` table, as `plan: 'demo'`,
`source: 'trial'`, `expires_at = now() + interval '3 days'`. The existing CHECK
constraints already permit exactly this pair, so no schema change is needed.

The browser still cannot write the table — that is the property the whole design
rests on — so a new edge function does it under the service role:

**`supabase/functions/trial-start/index.ts`** (new), following the JWT-validation
shape of `razorpay-status/index.ts` and the service-role write shape of
`razorpay-verify/index.ts`:

- valid user JWT required; the caller's id comes from `auth.getUser(token)`;
- **idempotent**: if the caller already has any row in `entitlements` — a paid
  one, an admin one, or an expired trial — it returns that row and writes
  nothing. A trial can be started once, ever, per account;
- otherwise inserts the 3-day trial row and returns it.

Because the row is keyed to `auth.users.id` and the function refuses to write a
second one, clearing storage, a private window, a second device and a reinstall
all fail to restart it. The three days are on the database clock.

**Removed:** `resetDemoTrial()` and the paywall's demo-restart button
(`PaywallModal.tsx:418`). Leaving a control that silently no-ops is worse than
removing it.

**Retained:** `DEMO_TRIAL_DAYS = 3` and the trial's length. Only the restart
path goes.

**Consequence, restated because it is the price of this:** starting a trial now
requires a signed-in account, so a visitor who declines to sign in reaches only
the paywall. Decision 8 records this as intended.

### 10. Locked assessments

Three enforcement points, all in `AssessmentSelector.tsx`, because that one
component owns both the list and the selected-assessment render.

| # | Point | Behaviour for a locked assessment |
|---|---|---|
| 1 | `openAssessment(key)` (~line 425) | Opens the paywall instead of navigating. Covers every tile click and the psychosis Previous/Next chain. |
| 2 | the `if (selectedAssessment)` branch (line 493) | A deep link to `/assessment/<locked-key>` bypasses `openAssessment` — line 407 sets the state directly. This branch renders the paywall instead of the assessment. |
| 3 | `renderTile` (line 965) | A lock affordance on the tile itself, so the set is legible before anyone clicks. |

Point 2 is the one that is easy to miss: `/assessment/hamd` typed into the
address bar reaches the render, not the click handler.

Access is `isProSource(premiumSource)` **or** a trial that is still running.
Both are already in the context after steps 1–6; this adds no new source of
truth.

## Security properties

Stated so they can be checked rather than assumed.

- No email address is used as an access key anywhere in this design. Identity is
  `auth.users.id`, reached only through a verified Supabase session.
- No browser can write `entitlements`: RLS is enabled with a read-own-row policy
  and no write policy, so every client write is rejected. **Amended at the
  revision:** this design now adds exactly one writer, the `trial-start` edge
  function, running under the service role. It writes at most one row, for the
  caller's own id, only when the caller has no row at all, and never with a paid
  `source`. The browser-write prohibition is unchanged.
- The developer's account id never enters the client bundle. It lives in one
  admin `INSERT` run by hand.
- Suppression is decided from a server-reported field, not from client state, so
  a user cannot talk their way into the App Store build by editing storage.
- **The trial cannot be restarted by the user**, because the only thing that
  starts one is a service-role insert keyed to a verified auth user id, and that
  insert is skipped whenever any row already exists for that id. Storage,
  incognito, a second device and a reinstall are all inert.
- **A locked assessment stays locked against a deep link.** Enforcement is in the
  `if (selectedAssessment)` render branch, not only in the click handler, so
  typing a URL reaches the same gate.
- The client still decides *whether to honour* the server's answer, which is
  inherent to a client-side gate. It is not a new weakness: the existing
  `localStorage` path is more permissive and is untouched by this work.

## Rejected approach

The originally proposed plan is not adopted. Recorded here so it is not
re-proposed without new information.

- **Hardcoding the owner's email and UUID into `webBilling.ts` and
  `SubscriptionContext.tsx`.** Ships a personal email address and the bypass test
  into the public JS bundle. It also contradicts the repo's own documented rule
  in `webBilling.ts:42` — *"There is no server-side ownership check, which is
  exactly why this must never ship"* — and would break five existing tests in
  `webBilling.test.ts` that pin production builds as stripping developer emails.
- **A permanent `web_subscriptions` row expiring in 2099.** Keys access to an
  email, writes a fictitious ₹2,999 payment into a billing table used for
  revenue, and is redundant: the `entitlements` grant reaches the same outcome
  without either problem.
- **Removing the `import.meta.env.DEV` guard** so the existing developer unlock
  applies to production builds. That guard is the reason the dev list is dropped
  by the minifier in production; removing it would ship the list.

## Assumptions to confirm at review

1. ~~The paywall's presentation is unchanged.~~ **Withdrawn at the revision.**
   The presentation does change: the paywall gains a trial-entry state, its dead
   close button goes, and locked tiles gain a lock affordance. It remains a
   full-screen modal that gates the app.
2. **The operator can apply the migration and run the `INSERT`.** If the
   `entitlements` table already exists in the deployed project under a different
   definition, step 1 must be re-checked before applying.
3. **`5ba70276-e265-4afb-84fb-fea80d335e8b` is the auth user id** created by
   signing in with the owner's email through the one-time-code flow. If the grant
   silently never matches, re-read the `id` column in Supabase → Authentication →
   Users and use that row's id.
4. **The operator can deploy a new edge function.** `trial-start` is new and must
   be deployed with `supabase functions deploy trial-start`, and
   `SUPABASE_SERVICE_ROLE_KEY` must be available to it. If it cannot be deployed,
   the trial cannot be anchored server-side and decision 7 is not achievable —
   the fallback is decision 7 abandoned in favour of the client-side trial, which
   is nominal. Confirm before starting that work.
5. **The 20 free assessments are the right 20.** The Triage & Core Flows section
   is taken whole because it is the section at the top of the registry. If the
   intent was a smaller or different set, the flag list is one edit per entry.
6. **Existing trial users are not migrated.** A device with a live
   `localStorage` trial at deploy time keeps it until it expires; the server only
   takes over what it is asked to start. No backfill is proposed, consistent with
   the standing non-goal.
