# Paywall Developer Access — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing home-page paywall reachable by the owner's account, through a permanent server-side grant keyed to their `auth.users.id`, while suppressing that same grant inside the native App Store build.

**Architecture:** The client stops deciding access from device storage alone and asks the server. A single `current_entitlement()` SQL function returns the caller's active grant (plan, source, expiry, permanence) under the caller's own RLS read policy; `has_premium()` becomes a thin wrapper over it. `src/lib/entitlement.ts` exposes the grant and a composed `serverPremium()` that ignores an `admin`-sourced grant when running inside the native wrapper. `SubscriptionContext` folds that decision in additively and `AuthGuard` renders a neutral loading state while the first answer is outstanding, so the owner never sees the paywall flash.

**Tech Stack:** Vite + React 18 + TypeScript, react-router-dom v7, Supabase (`@supabase/supabase-js` ^2.116.0) with Postgres RLS + SQL functions, Tailwind + shadcn/ui, Vitest 4 + @testing-library/react (jsdom).

**Spec:** `Docs/superpowers/specs/2026-10-08-paywall-developer-access-design.md`

## Global Constraints

- **Additive only.** Nothing existing is removed or changed in behaviour. One more way to hold Pro. The existing RevenueCat store path, the `localStorage` web path, and the demo trial all keep working exactly as they do today.
- **No email address is ever an access key.** Identity is `auth.users.id`, reached only through a verified Supabase session.
- **No browser may write `entitlements`.** RLS is enabled with a read-own-row policy and *no* write policy. The service role is the only writer. This plan adds no writer.
- **The developer's user id never enters the client bundle.** It exists only in an admin `INSERT` run by hand.
- **Fail closed.** RPC error, no session, unreachable backend, or a hung request all mean "no premium". Nothing about the device, its cache or its clock may turn that into a yes.
- **`import.meta.env.DEV` is `false` in both the production PWA and the App Store build.** Never gate a production behaviour on it.
- **The existing test suite must stay green without edits** — `src/lib/webBilling.test.ts` and `src/components/PaywallModal.restore.test.tsx` in particular. If either needs changing, the change is not additive and the implementation has drifted.
- **Operator-only steps** (Claude cannot reach the Supabase project): applying the migration, running the admin `INSERT`, and regenerating types. Each is called out where it is needed.

## Review Focus

Failure modes this plan's tests pin, listed most likely to bite first. Each has a test in the task that owns the code.

1. **A hung RPC must not hang the gate.** The spec bounds the server path by "network", but a request that never settles is not bounded. Without a timeout, `checkingServerAccess` never clears and the app is permanently blank for anyone on a captive-portal or stalled connection. Pinned in Task 3.
2. **Suppression must not fail open in the App Store build.** Deriving native-ness from `!!(await waitForWrapper()) && isNativePurchasesAvailable()` returns `false` both when the wrapper is slow (its `ready` promise has a 1 s timeout) and when it is present but has no Purchases plugin — so in a native app without IAP configured, the admin comp would be honoured. Pinned in Task 2.
3. **A stale answer must not overwrite a newer one.** `SIGNED_OUT` immediately followed by `SIGNED_IN` can land two in-flight checks out of order, leaving a signed-out device holding server-derived access. Pinned in Task 4.
4. **Sign-out must clear server-derived access.** Pinned in Task 4.
5. **The owner must not be told to upgrade while holding the grant.** `premiumSource` gains a new value; two existing `===` comparisons would fall through to "Upgrade" / "Free Tier". Pinned in Task 6.

---

### Task 1: Server — `current_entitlement()` and a `has_premium()` wrapper

**Files:**
- Modify: `supabase/migrations/20261008120000_entitlements.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: `public.current_entitlement() RETURNS TABLE (plan text, source text, expires_at timestamptz, permanent boolean)`, executable by `authenticated` only, returning at most one row — the caller's own active grant. `public.has_premium() RETURNS boolean`, unchanged in signature and meaning.

**Why a table-returning function:** the client needs `source` to apply the native suppression rule. Returning it from the same call that answers "do they hold a grant" keeps the check to one round trip and one source of truth.

**Note on `has_premium()`:** it keeps a caller — `AccountAccessCard.tsx:41` calls `hasPremium()` to render the access badge. It is *not* an uncalled function, so it stays.

- [ ] **Step 1: Edit the migration**

Open `supabase/migrations/20261008120000_entitlements.sql`. Replace the existing `has_premium()` definition and its `REVOKE`/`GRANT` block (currently lines 34–54) with the following. Leave the table definition, the RLS policy, the no-write-policy comment and the admin-grant footer exactly as they are.

```sql
-- The caller's active grant, in full.
--
-- SECURITY INVOKER (the default) on purpose: the caller's own RLS read policy
-- applies, so this can only ever see the caller's own row. `now()` is the
-- database clock, never the device clock.
--
-- A table-returning function is used rather than a boolean because the client
-- needs `source` to apply the native suppression rule, and answering both
-- questions in one call keeps it to a single round trip.
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

-- Anonymous callers cannot ask; signed-in callers can.
REVOKE EXECUTE ON FUNCTION public.current_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_entitlement() TO authenticated;

-- "Does the caller hold any active grant." Now a thin wrapper, so the access
-- rule lives in exactly one place. Signature and meaning are unchanged.
CREATE OR REPLACE FUNCTION public.has_premium()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.current_entitlement());
$$;

-- Kept verbatim: anonymous callers cannot ask; signed-in callers can.
REVOKE EXECUTE ON FUNCTION public.has_premium() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_premium() TO authenticated;
```

- [ ] **Step 2: Operator applies the migration**

Claude cannot reach the Supabase project. The operator runs the edited file against project `lusgyknbmprhmxbkkdbo` (Supabase SQL editor, or `supabase db push`).

Expected: no error. If the table already exists under a different definition, stop and re-check before applying — the edit assumes the table is absent, which `src/integrations/supabase/types.ts` confirms (it lists `web_subscriptions` but not `entitlements`).

- [ ] **Step 3: Operator verifies the functions exist and are correctly locked down**

Run in the Supabase SQL editor:

```sql
-- 1. Both functions exist, with the right shape.
SELECT proname, prosecdef AS security_definer, proretset AS returns_set
FROM pg_proc
WHERE proname IN ('current_entitlement', 'has_premium')
ORDER BY proname;
```

Expected: two rows. `returns_set` is `true` for `current_entitlement`, `false` for `has_premium`. `security_definer` is `false` for both — that is what makes the caller's RLS policy apply.

```sql
-- 2. anon cannot execute, authenticated can.
SELECT p.proname, r.rolname
FROM pg_proc p
JOIN pg_proc_acl a ON a.prooid = p.oid
JOIN pg_roles r ON r.oid = a.grantee
WHERE p.proname IN ('current_entitlement', 'has_premium');
```

Expected: rows naming `authenticated` only. No row granting `anon` or `PUBLIC`.

```sql
-- 3. A browser still cannot write the table.
SELECT polname, polcmd FROM pg_policy WHERE polrelid = 'public.entitlements'::regclass;
```

Expected: exactly one policy (`Users read own entitlement`), `polcmd = 'r'` (SELECT). Any `a`/`w`/`d` row is a security regression — stop.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20261008120000_entitlements.sql
git commit -m "feat(entitlement): report the caller's grant from current_entitlement()

has_premium() becomes a thin wrapper so the access rule lives in one
place. The table, its RLS policy and the deliberate absence of write
policies are unchanged.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Native detection that fails closed

**Files:**
- Modify: `src/lib/appbuild/wrapper.ts`
- Modify: `src/lib/appbuild/revenuecat.ts`
- Test: `src/lib/appbuild/revenuecat.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `isWrapperPresent(): boolean` in `wrapper.ts`; `isNativeApp(): Promise<boolean>` in `revenuecat.ts`.

**Two deliberate deviations from spec §3, both to be confirmed at plan review.**

*First, the implementation of `isNativeApp()`.* The spec sketches it as `!!(await waitForWrapper()) && isNativePurchasesAvailable()`. That fails **open** in two ways, both of which would honour the owner's admin comp inside the App Store build:

- `waitForWrapper()` resolves `null` after a 1 s timeout (`wrapper.ts:24`). A wrapper slower than 1 s reads as "not native".
- `isNativePurchasesAvailable()` reports whether the RevenueCat plugin is registered, which is a different question from whether we are inside the native app. A native build with no Purchases plugin reads as "not native".

Native-ness is "is the wrapper there", not "is IAP configured", so this plan tests wrapper presence instead.

*Second, the `useIsNativeApp` React hook is not built.* The spec calls for one so that "both a React consumer and a plain async caller can use it". No React consumer exists: `serverPremium()` is called from an effect in `SubscriptionContext`, which is not a render-time concern, and `PaywallModal` already resolves its own `native` state at `PaywallModal.tsx:87`. A hook with no caller is untested code, so it is dropped. If a render-time consumer appears later, add it then, over the same `isNativeApp()`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/appbuild/revenuecat.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const wrapper = vi.hoisted(() => ({
  waitForWrapper: vi.fn(),
  isWrapperPresent: vi.fn(),
}));

vi.mock('./wrapper', () => ({
  waitForWrapper: wrapper.waitForWrapper,
  isWrapperPresent: wrapper.isWrapperPresent,
  getPurchasesPlugin: () => null,
}));

describe('isNativeApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('is true when the wrapper settled and is present', async () => {
    wrapper.waitForWrapper.mockResolvedValue({ appInfo: {}, capabilities: {} });
    wrapper.isWrapperPresent.mockReturnValue(true);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(true);
  });

  it('is true when the wrapper is present but never became ready', async () => {
    // waitForWrapper gives up after 1s; the wrapper object is still there.
    wrapper.waitForWrapper.mockResolvedValue(null);
    wrapper.isWrapperPresent.mockReturnValue(true);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(true);
  });

  it('is false in a plain browser', async () => {
    wrapper.waitForWrapper.mockResolvedValue(null);
    wrapper.isWrapperPresent.mockReturnValue(false);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(false);
  });

  it('is false, not a rejection, when the wrapper probe throws', async () => {
    wrapper.waitForWrapper.mockRejectedValue(new Error('boom'));
    wrapper.isWrapperPresent.mockReturnValue(false);
    const { isNativeApp } = await import('./revenuecat');
    await expect(isNativeApp()).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/appbuild/revenuecat.test.ts`
Expected: FAIL — `isNativeApp is not a function` (and `isWrapperPresent` is not exported from `./wrapper`).

- [ ] **Step 3: Add `isWrapperPresent()` to `wrapper.ts`**

Append to `src/lib/appbuild/wrapper.ts`. This file is the only module allowed to touch `window.AppbuildWrapper`, so the new helper belongs here.

```ts
/**
 * True when the native wrapper object exists at all, whether or not its `ready`
 * promise has settled.
 *
 * Distinct from the result of `waitForWrapper()`: that resolves `null` after a
 * one-second timeout, so a slow wrapper is indistinguishable from a browser.
 * For deciding whether we are inside the App Store build, presence is the
 * question, and treating a slow wrapper as a browser would fail open.
 */
export function isWrapperPresent(): boolean {
  return typeof window !== 'undefined' && !!window.AppbuildWrapper;
}
```

- [ ] **Step 4: Add `isNativeApp()` to `revenuecat.ts`**

Add to the import line at the top of `src/lib/appbuild/revenuecat.ts`:

```ts
import { getPurchasesPlugin, isWrapperPresent, waitForWrapper } from './wrapper';
```

Then append, next to the existing synchronous `isNativePurchasesAvailable()`:

```ts
/**
 * True only inside the native wrapper.
 *
 * Async because the wrapper injects itself after first paint; `waitForWrapper`
 * waits up to a second for it. A wrapper that is present but slow, or present
 * without a Purchases plugin, still counts as native — this answers "are we in
 * the App Store build", not "is IAP configured". Getting that wrong in the
 * permissive direction would unlock an admin comp inside the shipped app.
 */
export async function isNativeApp(): Promise<boolean> {
  try {
    await waitForWrapper();
  } catch {
    /* fall through to the presence check */
  }
  return isWrapperPresent();
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/appbuild/revenuecat.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/appbuild/wrapper.ts src/lib/appbuild/revenuecat.ts src/lib/appbuild/revenuecat.test.ts
git commit -m "feat(appbuild): isNativeApp() keyed on wrapper presence

Native-ness is \"is the wrapper there\", not \"is the RevenueCat plugin
registered\". The spec's sketch failed open for a slow wrapper and for a
native build with no Purchases plugin, either of which would honour an
admin comp inside the App Store build.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: The client access decision

**Files:**
- Modify: `src/lib/entitlement.ts`
- Test: `src/lib/entitlement.test.ts`

**Interfaces:**
- Consumes: `isNativeApp()` from Task 2.
- Produces: `EntitlementPlan`, `EntitlementSource`, `Entitlement`; `currentEntitlement(): Promise<Entitlement | null>`; `serverPremium(): Promise<boolean>`.

**Existing exports unchanged:** `requestEmailCode`, `verifyEmailCode`, `signOut`, `currentAuthUser`, `hasPremium`, `onAuthChange`, `AuthResult`, `AuthUser`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/entitlement.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sb = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: sb.rpc, auth: {} },
}));

const native = vi.hoisted(() => ({ isNativeApp: vi.fn() }));
vi.mock('@/lib/appbuild/revenuecat', () => ({ isNativeApp: native.isNativeApp }));

import { currentEntitlement, serverPremium } from './entitlement';

const row = (over: Partial<Record<string, unknown>> = {}) => ({
  plan: 'developer',
  source: 'admin',
  expires_at: null,
  permanent: true,
  ...over,
});

describe('currentEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    native.isNativeApp.mockResolvedValue(false);
  });

  it('maps a returned row to camelCase', async () => {
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await currentEntitlement()).toEqual({
      plan: 'developer',
      source: 'admin',
      expiresAt: null,
      permanent: true,
    });
    expect(sb.rpc).toHaveBeenCalledWith('current_entitlement');
  });

  it('is null when the RPC errors', async () => {
    sb.rpc.mockResolvedValue({ data: null, error: { message: 'permission denied' } });
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the function returns no rows', async () => {
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the RPC rejects outright', async () => {
    sb.rpc.mockRejectedValue(new Error('network down'));
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the request hangs, rather than hanging the caller', async () => {
    vi.useFakeTimers();
    sb.rpc.mockReturnValue(new Promise(() => {}));
    const pending = currentEntitlement();
    await vi.advanceTimersByTimeAsync(5000);
    await expect(pending).resolves.toBeNull();
  });
});

describe('serverPremium', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('is false with no grant', async () => {
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await serverPremium()).toBe(false);
  });

  it('honours an admin grant in a browser', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await serverPremium()).toBe(true);
  });

  it('suppresses an admin grant inside the native app', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await serverPremium()).toBe(false);
  });

  it('does not suppress a paid grant inside the native app', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({
      data: [row({ plan: 'yearly', source: 'razorpay', permanent: false })],
      error: null,
    });
    expect(await serverPremium()).toBe(true);
  });

  it('does not consult native-ness when there is no grant', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await serverPremium()).toBe(false);
    expect(native.isNativeApp).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/entitlement.test.ts`
Expected: FAIL — `currentEntitlement is not a function`, `serverPremium is not a function`.

- [ ] **Step 3: Implement**

In `src/lib/entitlement.ts`, add the import:

```ts
import { isNativeApp } from '@/lib/appbuild/revenuecat';
```

Add below the existing `AuthUser` interface:

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
```

Add below the existing `callHasPremium` cast:

```ts
/** A row as PostgREST returns it: snake_case, and strings for the TEXT columns. */
interface EntitlementRow {
  plan: string;
  source: string;
  expires_at: string | null;
  permanent: boolean;
}

/**
 * `current_entitlement` is likewise absent from the generated `Database` types
 * until the migration is applied and the types are regenerated. The cast is
 * confined to this one call; delete it once the types catch up (Task 7).
 * It returns a set, so the payload is an array of rows.
 */
const callCurrentEntitlement = supabase.rpc as unknown as (
  fn: 'current_entitlement',
) => Promise<{ data: EntitlementRow[] | null; error: { message: string } | null }>;

/** A hung request is a failed request. Bound it so the gate can always clear. */
const RPC_TIMEOUT_MS = 5000;

async function withTimeout<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), RPC_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * The caller's active grant, as the server reports it.
 *
 * Fails closed: an RPC error, an unreachable backend, a request that never
 * settles, or a signed-out user all resolve to null. Nothing about this device,
 * its cache or its clock can turn that into a grant.
 */
export async function currentEntitlement(): Promise<Entitlement | null> {
  const { data, error } = await withTimeout(
    callCurrentEntitlement('current_entitlement'),
    { data: null, error: { message: 'timed out' } },
  );
  if (error) return null;

  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  return {
    plan: row.plan as EntitlementPlan,
    source: row.source as EntitlementSource,
    expiresAt: row.expires_at ?? null,
    permanent: row.permanent === true,
  };
}

/**
 * Whether the server grants access *on this device*.
 *
 * An admin comp is ignored inside the native wrapper, so the App Store build
 * never inherits the owner's grant. Suppression keys on `source`, not `plan`,
 * so any comp an administrator issues later is also suppressed, while a genuine
 * paid grant is not.
 */
export async function serverPremium(): Promise<boolean> {
  const ent = await currentEntitlement();
  if (!ent) return false;
  if (ent.source === 'admin' && (await isNativeApp())) return false;
  return true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/entitlement.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/entitlement.ts src/lib/entitlement.test.ts
git commit -m "feat(entitlement): read the caller's grant and compose the device rule

currentEntitlement() is bounded by a 5s timeout, because a request that
never settles is a failed request and an unbounded one would leave the
gate permanently blank. serverPremium() suppresses an admin-sourced
grant inside the native wrapper and nothing else.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Fold the server decision into `SubscriptionContext`

**Files:**
- Modify: `src/contexts/SubscriptionContext.tsx`
- Test: `src/contexts/SubscriptionContext.test.tsx`

**Interfaces:**
- Consumes: `currentAuthUser`, `onAuthChange`, `serverPremium` from Task 3.
- Produces: context value gains `serverPremium: boolean`, `checkingServerAccess: boolean`; `premiumSource` widens to `'store' | 'web' | 'demo' | 'developer' | 'none'`.

**Additive.** `isPremium = isPremiumUser() || !!webPremium || serverPremium`. Do not change `isPremiumUser`, the `webPremium` path, the demo trial, or `restoreWebPurchaseForSession`.

- [ ] **Step 1: Write the failing test**

Create `src/contexts/SubscriptionContext.test.tsx`:

```tsx
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ent = vi.hoisted(() => ({
  currentAuthUser: vi.fn(),
  serverPremium: vi.fn(),
  onAuthChange: vi.fn(),
}));
vi.mock('@/lib/entitlement', () => ({
  currentAuthUser: ent.currentAuthUser,
  serverPremium: ent.serverPremium,
  onAuthChange: ent.onAuthChange,
}));

vi.mock('@/services/subscriptionService', () => ({
  createDemoSubscription: vi.fn(),
  setDemoUnlockAll: vi.fn(),
  getDemoUnlockAll: () => false,
  getDemoTrialMsLeft: () => 0,
  resetDemoTrial: vi.fn(),
  DEMO_TRIAL_DAYS: 3,
  isPremiumUser: () => false,
  isDemoTrialActive: () => false,
  getPremiumFeatures: () => ({}),
  getSubscription: () => null,
}));

vi.mock('@/lib/webBilling', () => ({
  completeRestoreFromEmailLink: () => Promise.resolve(null),
  getWebPremium: () => null,
  restoreWebPurchase: vi.fn(),
  restoreWebPurchaseForSession: () => Promise.resolve(null),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { SubscriptionProvider, useSubscription } from './SubscriptionContext';

const Probe = () => {
  const { isPremium, premiumSource, serverPremium, checkingServerAccess } = useSubscription();
  return (
    <div>
      <span data-testid="premium">{String(isPremium)}</span>
      <span data-testid="source">{premiumSource}</span>
      <span data-testid="server">{String(serverPremium)}</span>
      <span data-testid="checking">{String(checkingServerAccess)}</span>
    </div>
  );
};

let listeners: Array<() => void> = [];

describe('SubscriptionContext server access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listeners = [];
    ent.onAuthChange.mockImplementation((cb: () => void) => {
      listeners.push(cb);
      return () => {};
    });
    ent.currentAuthUser.mockResolvedValue({ id: 'u1', email: 'owner@example.com' });
    ent.serverPremium.mockResolvedValue(true);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('grants premium from the server alone and reports the source', async () => {
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('true'));
    expect(screen.getByTestId('source').textContent).toBe('developer');
  });

  it('reports checking on first render and stops once the answer lands', async () => {
    ent.serverPremium.mockResolvedValue(false);
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    expect(screen.getByTestId('checking').textContent).toBe('true');
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
  });

  it('clears server access on sign-out', async () => {
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('true'));

    ent.currentAuthUser.mockResolvedValue(null);
    ent.serverPremium.mockResolvedValue(false);
    await act(async () => {
      listeners.forEach((cb) => cb());
    });

    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('false'));
    expect(screen.getByTestId('source').textContent).toBe('none');
  });

  it('does not ask the server when nobody is signed in', async () => {
    ent.currentAuthUser.mockResolvedValue(null);
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(ent.serverPremium).not.toHaveBeenCalled();
  });

  it('keeps the newest answer when two checks overlap', async () => {
    let releaseSlow: (v: boolean) => void = () => {};
    ent.serverPremium
      .mockImplementationOnce(() => new Promise<boolean>((r) => { releaseSlow = r; }))
      .mockResolvedValueOnce(false);

    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );

    // Second check (signed out) resolves first; the first must not overwrite it.
    ent.currentAuthUser.mockResolvedValue(null);
    await act(async () => {
      listeners.forEach((cb) => cb());
    });
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    await act(async () => {
      releaseSlow(true);
    });

    expect(screen.getByTestId('server').textContent).toBe('false');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: FAIL — `checkingServerAccess` and `serverPremium` are `undefined`, so the first assertions fail.

- [ ] **Step 3: Implement**

In `src/contexts/SubscriptionContext.tsx`, extend the import from `@/lib/webBilling`'s sibling — add a new import line:

```ts
import { currentAuthUser, onAuthChange, serverPremium as fetchServerPremium } from '@/lib/entitlement';
```

Extend `SubscriptionContextType` (inside the interface, after `premiumSource`):

```ts
  /** Where the current premium access comes from. */
  premiumSource: 'store' | 'web' | 'demo' | 'developer' | 'none';
  /** The server's decision for this device, composed with the native rule. */
  serverPremium: boolean;
  /** True from mount until the first server answer, right or wrong. */
  checkingServerAccess: boolean;
```

Replace the existing `premiumSource` property declaration in the interface (it is currently typed `'store' | 'web' | 'demo' | 'none'` on one line) with the widened one above — do not leave two declarations.

Add the state, beside the existing `webPremium` state:

```ts
  const [serverGranted, setServerGranted] = useState(false);
  const [checkingServerAccess, setCheckingServerAccess] = useState(true);
```

Add the effect, after the existing session-restore effect (the one ending at what is currently line 124):

```ts
  // The server's answer, asked once on mount and again whenever the session
  // changes. `seq` guards against a slow earlier check overwriting a newer one:
  // a sign-out followed by a sign-in can leave two checks in flight, and the
  // older answer must not win.
  useEffect(() => {
    let cancelled = false;
    let seq = 0;

    const check = async () => {
      const mine = ++seq;
      let granted = false;
      try {
        const who = await currentAuthUser();
        // No session, no question: an anonymous caller can hold no grant.
        if (who) granted = await fetchServerPremium();
      } catch {
        granted = false;
      }
      if (cancelled || mine !== seq) return;
      setServerGranted(granted);
      setCheckingServerAccess(false);
    };

    void check();
    const unsubscribe = onAuthChange(() => {
      void check();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
```

Change the premium computation:

```ts
  const isPremium = useMemo(
    () => isPremiumUser() || !!webPremium || serverGranted,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [webPremium, serverGranted, subscription, demoUnlockAll, demoTrialMsLeft],
  );
```

Change the source precedence. `developer` outranks `demo` so the owner sees why they have access:

```ts
  const premiumSource: 'store' | 'web' | 'demo' | 'developer' | 'none' = webPremium
    ? 'web'
    : serverGranted
      ? 'developer'
      : (demoTrialActive && demoUnlockAll)
        ? 'demo'
        : isPremium
          ? 'store'
          : 'none';
```

Add both fields to the `value` object literal, after `premiumSource`:

```ts
    serverPremium: serverGranted,
    checkingServerAccess,
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Confirm the additive constraint still holds**

Run: `npx vitest run src/lib/webBilling.test.ts src/components/PaywallModal.restore.test.tsx`
Expected: PASS, unchanged. `PaywallModal` does not read the new fields, so the partial `useSubscription` mock in `PaywallModal.restore.test.tsx:15` keeps working.

- [ ] **Step 6: Commit**

```bash
git add src/contexts/SubscriptionContext.tsx src/contexts/SubscriptionContext.test.tsx
git commit -m "feat(subscription): fold the server grant into the access decision

Additive: isPremium gains one more disjunct and premiumSource one more
value. A sequence guard stops a slow earlier check from overwriting a
newer one, which matters on sign-out.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: `AuthGuard` — no paywall flash

**Files:**
- Modify: `src/components/AuthGuard.tsx`
- Test: `src/components/AuthGuard.test.tsx`

**Interfaces:**
- Consumes: `checkingServerAccess` from Task 4.
- Produces: nothing new.

**Why:** with an async check in the access path, the owner would otherwise see the paywall for the duration of the RPC.

- [ ] **Step 1: Write the failing test**

Create `src/components/AuthGuard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sub = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/contexts/SubscriptionContext', () => ({ useSubscription: () => sub.value }));

vi.mock('@/components/PaywallModal', () => ({
  PaywallModal: () => <div data-testid="paywall">paywall</div>,
}));

import { AuthGuard } from './AuthGuard';

const setSub = (over: Record<string, unknown>) => {
  sub.value = {
    isPremium: false,
    demoTrialActive: false,
    showPaywall: false,
    setShowPaywall: vi.fn(),
    checkingServerAccess: false,
    ...over,
  };
};

describe('AuthGuard', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('shows neither the app nor the paywall while the server is still deciding', () => {
    setSub({ checkingServerAccess: true });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.queryByTestId('paywall')).toBeNull();
    expect(screen.queryByTestId('app')).toBeNull();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('shows the paywall once the answer is no', () => {
    setSub({ checkingServerAccess: false });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('paywall')).toBeTruthy();
    expect(screen.queryByTestId('app')).toBeNull();
  });

  it('lets a server-granted owner straight through, without a paywall frame', () => {
    setSub({ isPremium: true, checkingServerAccess: true });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('app')).toBeTruthy();
    expect(screen.queryByTestId('paywall')).toBeNull();
  });

  it('does not gate a public path', () => {
    window.history.pushState({}, '', '/terms');
    setSub({ checkingServerAccess: false });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('app')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/AuthGuard.test.tsx`
Expected: FAIL — the first test finds the paywall instead of a loading state.

- [ ] **Step 3: Implement**

Replace the body of `src/components/AuthGuard.tsx` from the import line down:

```tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/terms', '/privacy'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isPremium, demoTrialActive, showPaywall, setShowPaywall, checkingServerAccess } =
    useSubscription();

  const isPublic =
    typeof window !== 'undefined' && PUBLIC_PATHS.includes(window.location.pathname);

  // Anything already granted short-circuits the wait, so an existing buyer never
  // sees a spinner they do not need.
  const hasAccess = isPremium || demoTrialActive;
  const waiting = checkingServerAccess && !hasAccess;

  if (!hasAccess && !isPublic) {
    if (waiting) {
      // Neutral, and never the paywall: for the duration of the RPC we do not
      // yet know, and showing the paywall to someone who holds a grant is the
      // exact flash this exists to prevent.
      return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
          <Loader2 role="status" aria-label="Checking access" className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <PaywallModal isOpen={true} onClose={() => {}} onSelectPlan={() => {}} />
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Paywall opened on demand (Settings, header "Pro" button, banners). */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={() => setShowPaywall(false)}
      />
    </>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/AuthGuard.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/AuthGuard.tsx src/components/AuthGuard.test.tsx
git commit -m "fix(paywall): hold the gate open while the server decides

An async access check in the path would show the owner the paywall for
the duration of the RPC. A neutral loading state shows instead, and any
source that already grants access short-circuits it.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Tell the truth in the two places that read `premiumSource`

**Files:**
- Modify: `src/services/subscriptionService.ts`
- Modify: `src/components/AssessmentSelector.tsx:792`
- Modify: `src/components/SettingsView.tsx:83`
- Test: `src/services/subscriptionService.test.ts`

**Interfaces:**
- Consumes: the widened `premiumSource` from Task 4.
- Produces: `isProSource(source: string | null | undefined): boolean` from `@/services/subscriptionService`.

**Why extract rather than edit two conditions in place:** both sites test `premiumSource === 'store' || premiumSource === 'web'`, and the owner's source is now `'developer'`. Without the fix they would hold the grant and still be shown "Upgrade" / "Free Tier". A single named predicate keeps the two sites from drifting apart again, and unlike a JSX condition inside two very large components it can be tested directly.

- [ ] **Step 1: Write the failing test**

Create `src/services/subscriptionService.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isProSource } from './subscriptionService';

describe('isProSource', () => {
  it('counts every source that grants Pro', () => {
    expect(isProSource('store')).toBe(true);
    expect(isProSource('web')).toBe(true);
    expect(isProSource('developer')).toBe(true);
  });

  it('does not count the trial or the absence of access', () => {
    expect(isProSource('demo')).toBe(false);
    expect(isProSource('none')).toBe(false);
    expect(isProSource(null)).toBe(false);
    expect(isProSource(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/services/subscriptionService.test.ts`
Expected: FAIL — `isProSource is not a function`.

- [ ] **Step 3: Add the predicate**

Append to `src/services/subscriptionService.ts`:

```ts
/**
 * Whether a `premiumSource` value means a real, paid-for or granted Pro tier,
 * as opposed to a trial or no access at all.
 *
 * One predicate because two components render a Pro badge from it; keeping the
 * list in a single place is what stops them disagreeing. `developer` is a
 * server-side grant an administrator issued, which is not a trial.
 */
export const isProSource = (source: string | null | undefined): boolean =>
  source === 'store' || source === 'web' || source === 'developer';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/services/subscriptionService.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Use it in both components**

In `src/components/AssessmentSelector.tsx:792`, change:

```jsx
{premiumSource === 'store' || premiumSource === 'web' ? 'Pro' : 'Upgrade'}
```

to:

```jsx
{isProSource(premiumSource) ? 'Pro' : 'Upgrade'}
```

In `src/components/SettingsView.tsx:83`, change:

```jsx
{premiumSource === 'store' || premiumSource === 'web' ? 'Cognito Pro' : 'Free Tier'}
```

to:

```jsx
{isProSource(premiumSource) ? 'Cognito Pro' : 'Free Tier'}
```

Add `isProSource` to the existing `@/services/subscriptionService` import in each file. `SettingsView.tsx` already imports several names from that module — extend that import rather than adding a second one.

Leave `SettingsView.tsx:85` (`premiumSource === 'demo' && ' (3-day demo active)'`) alone — a developer grant is not a demo, and it must not say it is.

- [ ] **Step 6: Verify the whole suite is green**

Run: `npx vitest run`
Expected: PASS. 58 pre-existing tests plus the 25 added here (4 + 10 + 5 + 4 + 2), all green, with no edits to `webBilling.test.ts` or `PaywallModal.restore.test.tsx`.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/services/subscriptionService.ts src/services/subscriptionService.test.ts src/components/AssessmentSelector.tsx src/components/SettingsView.tsx
git commit -m "fix(ui): show the developer grant as Pro, not as the free tier

Both sites compared premiumSource against 'store' and 'web' only, so an
owner holding a server grant would have been told to upgrade. The list of
sources now lives in one predicate so the two cannot drift apart again.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Operator handoff — grant, regenerate, verify end to end

**Files:**
- Modify: `src/lib/entitlement.ts` (delete the two RPC casts once types exist)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing new.

Claude cannot reach the Supabase project, so steps 1–4 are the operator's.

- [ ] **Step 1: Operator applies the migration**

If Task 1 Step 2 has not already been run, apply `supabase/migrations/20261008120000_entitlements.sql` now.

- [ ] **Step 2: Operator runs the admin grant, once**

In the Supabase SQL editor. The id is the owner's own `auth.users.id`; `AccountAccessCard` renders this same statement with the signed-in account's own id, so it can be copied rather than typed.

```sql
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('5ba70276-e265-4afb-84fb-fea80d335e8b', 'developer', 'admin', NULL, 'owner')
ON CONFLICT (user_id) DO UPDATE
  SET plan = 'developer', source = 'admin', expires_at = NULL;
```

Verify:

```sql
SELECT user_id, plan, source, expires_at IS NULL AS permanent
FROM public.entitlements;
```

Expected: exactly one row, `plan = developer`, `source = admin`, `permanent = true`.

If this row never matches, the id is wrong: re-read `id` under Supabase → Authentication → Users for the account created by signing in through the one-time-code flow, and re-run with that value.

- [ ] **Step 3: Operator regenerates types**

```bash
supabase gen types typescript --project-id lusgyknbmprhmxbkkdbo > src/integrations/supabase/types.ts
```

- [ ] **Step 4: Operator confirms the grants are gone from the generated types path**

Run: `grep -n "current_entitlement\|has_premium" src/integrations/supabase/types.ts`
Expected: both names present. If either is missing the regeneration did not pick up the migration — stop and re-run step 1.

- [ ] **Step 5: Delete the two RPC casts**

In `src/lib/entitlement.ts`, remove `callHasPremium` and `callCurrentEntitlement` and their doc comments, and call `supabase.rpc(...)` directly:

```ts
export async function hasPremium(): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_premium');
  if (error) return false;
  return data === true;
}
```

```ts
export async function currentEntitlement(): Promise<Entitlement | null> {
  const { data, error } = await withTimeout(
    supabase.rpc('current_entitlement'),
    { data: null, error: { message: 'timed out' } },
  );
  if (error) return null;

  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  return {
    plan: row.plan as EntitlementPlan,
    source: row.source as EntitlementSource,
    expiresAt: row.expires_at ?? null,
    permanent: row.permanent === true,
  };
}
```

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0. If `supabase.rpc` does not accept these names, the types did not regenerate — do not re-add the casts, fix step 3.

Run: `npx vitest run src/lib/entitlement.test.ts`
Expected: PASS. The test mocks `supabase.rpc` directly, so it is indifferent to the cast.

- [ ] **Step 6: Operator verifies end to end, in a browser**

1. `npm run dev`, open the app.
2. The paywall shows.
3. Sign in with the owner's email through the paywall's restore flow. Enter the one-time code.
4. Expected: the app loads, and the header reads **Pro**, not "Upgrade".
5. Open Settings → Account & Access. Expected: **Premium active**.
6. Sign out. Expected: the paywall returns and the header no longer reads Pro.
7. Confirm suppression is *not* observable in a browser: `isNativeApp()` returns false there, so the grant is honoured. The App Store suppression cannot be verified from a browser and is covered by the Task 2 unit tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib/entitlement.ts
git commit -m "refactor(entitlement): drop the RPC casts now the types exist

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## What this plan does not do

Deliberately out of scope, to be covered by a separate follow-on plan:

- **Scoping the trial to 25% of assessments.** Requires a `trial` flag on registry entries, a per-assessment lock in `AssessmentSelector`, a route-level guard, and the paywall trigger for a locked test.
- **Anchoring the trial server-side so it cannot be restarted.** Requires a trial-start edge function writing `entitlements` with `source: 'trial'`, and the paywall's restart button removed.
- **Removing the dead close button** at `PaywallModal.tsx:320`, which is wired to a no-op `onClose` and so looks dismissable when it is not.

Both of the first two contradict the current spec's non-goals ("No change to the demo trial, its length, or its restartability"; "No change to how the paywall looks, where it appears, or when it is shown"), so the spec must be revised before that plan is written.
