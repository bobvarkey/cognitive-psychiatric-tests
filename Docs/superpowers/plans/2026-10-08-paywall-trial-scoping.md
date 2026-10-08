# Trial Scoping and Anchoring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the three-day trial into a real gate: starting it requires an email one-time code, it is recorded server-side so it cannot be restarted, and it unlocks only the 20 assessments in the registry's Triage & Core Flows section. Everything else meets a paywall.

**Architecture:** Membership is an explicit `trial: true` flag on registry entries, read through one predicate so the list is testable without rendering the 1200-line selector. Anchoring is a new `trial-start` edge function that inserts a `plan: 'demo'`, `source: 'trial'` row under the service role, at most once per auth user. The client calls it, then re-reads its grant. Lock enforcement sits at the three points in `AssessmentSelector` that can reach an assessment — including the deep-link render branch, which bypasses the click handler.

**Tech Stack:** Vite + React 18 + TypeScript, Supabase (Postgres RLS, SQL functions, Deno edge functions), Tailwind + shadcn/ui, Vitest 4 + @testing-library/react (jsdom).

**Spec:** `Docs/superpowers/specs/2026-10-08-paywall-developer-access-design.md` — sections 8, 9 and 10. Global Constraints and Review Focus below are this plan's own; the spec's apply as well.

**Depends on:** `Docs/superpowers/plans/2026-10-08-paywall-developer-access.md` (the foundation). **Do not start this plan until that one is complete and its Task 7 verification passes**, because this plan reads `premiumSource`, which the foundation introduces, and relies on its source-aware derivation.

**A note on scope.** The foundation plan was explicitly additive. This one is not: it removes the client-side trial restart and changes the paywall's behaviour. Both are recorded as withdrawn non-goals in the spec, at the revision dated 2026-10-08.

## Global Constraints

- **No email address is ever an access key.** Identity is `auth.users.id`, reached only through a verified Supabase session.
- **No browser may write `entitlements`.** This plan adds exactly one writer: the `trial-start` edge function, under the service role. It writes at most one row, for the caller's own id, only when that id has no row at all, and never with a paid `source`.
- **The developer's user id never enters the client bundle.**
- **The trial's length stays three days.** Only its restartability and its scope change.
- **Fail closed.** An edge-function error, a missing session, or unreachable backend means "no trial", and the paywall shows.
- **`import.meta.env.DEV` is `false` in both the production PWA and the App Store build.** Never gate a production behaviour on it.
- **The existing suite must stay green without edits** — `webBilling.test.ts`, `PaywallModal.restore.test.tsx`, `registry.test.ts` in particular. `registry.test.ts` gains assertions; it must not need any *changed*.

## Review Focus

Failure modes this plan's tests pin, most likely to bite first. Each has a test in the task that owns the code.

1. **A trial must be startable exactly once.** Two concurrent calls, or one call from a client that retries, must not produce a second three-day window. The insert is guarded by a re-read, because a bare "is there a row" check races. Pinned in Task 3.
2. **The lock must survive a deep link.** `/assessment/hamd` typed into the address bar sets the selected assessment directly (`AssessmentSelector.tsx:407`), never passing through `openAssessment`. Enforcing only in the click handler leaves the whole product open by URL. Pinned in Task 6.
3. **A trial user must not reach the 76.** The foundation's `premiumSource` is `'demo'` for a trial and `'developer'` for the owner's comp; a lock keyed on "is premium" rather than on the source hands the trial everything. Pinned in Tasks 1 and 5.
4. **An unlocked assessment must stay unlocked during a trial.** The trial's whole content is the flagged subset, so over-tightening is a user-visible bug: a trial visitor clicking the first tile must get an assessment, not a paywall. Pinned in Tasks 1 and 6.
5. **The paywall must not render a control that does nothing.** Its close button is wired to a no-op `onClose` in the blocking instance. Pinned in Task 7.

---

### Task 1: The trial-membership predicate

**Files:**
- Create: `src/lib/trialScope.ts`
- Test: `src/lib/trialScope.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `TrialScoped`; `isTrialAssessment(a: TrialScoped): boolean`; `canOpenAssessment(a: TrialScoped, access: { fullAccess: boolean; trialActive: boolean }): boolean`.

**Why a separate module, not a condition inline:** the selector is over 1200 lines and imports 96 components, so a rule written inside it can only be tested by rendering all of that. Here it is two pure functions.

- [ ] **Step 1: Write the failing test**

Create `src/lib/trialScope.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { canOpenAssessment, isTrialAssessment } from './trialScope';

describe('isTrialAssessment', () => {
  it('reads the explicit flag', () => {
    expect(isTrialAssessment({ trial: true })).toBe(true);
    expect(isTrialAssessment({ trial: false })).toBe(false);
  });

  it('locks anything that does not say so', () => {
    expect(isTrialAssessment({})).toBe(false);
    expect(isTrialAssessment({ trial: undefined })).toBe(false);
  });
});

describe('canOpenAssessment', () => {
  const free = { trial: true };
  const locked = {};

  it('opens everything for a paid plan or an admin grant', () => {
    expect(canOpenAssessment(locked, { fullAccess: true, trialActive: false })).toBe(true);
    expect(canOpenAssessment(free, { fullAccess: true, trialActive: false })).toBe(true);
  });

  it('opens only the flagged subset during a trial', () => {
    expect(canOpenAssessment(free, { fullAccess: false, trialActive: true })).toBe(true);
    expect(canOpenAssessment(locked, { fullAccess: false, trialActive: true })).toBe(false);
  });

  it('opens nothing without access', () => {
    expect(canOpenAssessment(free, { fullAccess: false, trialActive: false })).toBe(false);
    expect(canOpenAssessment(locked, { fullAccess: false, trialActive: false })).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/trialScope.test.ts`
Expected: FAIL — cannot resolve `./trialScope`.

- [ ] **Step 3: Implement**

Create `src/lib/trialScope.ts`:

```ts
/**
 * Which assessments a 3-day trial unlocks, and who may open what.
 *
 * Membership is an explicit flag on the registry entry, never a position in the
 * array. Inserting a new assessment at the top of the registry would otherwise
 * evict one from the free set and hand a different test to every trial user,
 * with no diff that says so.
 */

/** The part of a registry entry this module cares about. */
export interface TrialScoped {
  /** Open to a 3-day trial without a paid plan. Absent means locked. */
  trial?: boolean;
}

/**
 * Whether an assessment is open to a trial.
 *
 * Anything that does not say `trial: true` is locked. That is the safe default:
 * a test which is too locked is visible and gets reported, while one that is
 * silently free is neither.
 */
export const isTrialAssessment = (a: TrialScoped): boolean => a.trial === true;

/**
 * Whether the current visitor may open this assessment.
 *
 * A paid plan or an admin grant opens everything; a running trial opens only the
 * flagged subset; no access opens nothing.
 */
export const canOpenAssessment = (
  a: TrialScoped,
  access: { fullAccess: boolean; trialActive: boolean },
): boolean => access.fullAccess || (access.trialActive && isTrialAssessment(a));
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/trialScope.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/trialScope.ts src/lib/trialScope.test.ts
git commit -m "feat(trial): a predicate for trial membership and access

Reads an explicit flag rather than a position in the registry, so adding
an assessment at the top cannot silently change what is free. Pure
functions, so the rule is testable without rendering the selector.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Flag the 20 free assessments

**Files:**
- Modify: `src/components/AssessmentSelector.tsx` (the `AssessmentInfo` interface at ~line 170, and 20 entries in `assessments` from ~line 180)
- Modify: `src/__tests__/registry.test.ts`

**Interfaces:**
- Consumes: `isTrialAssessment` from Task 1.
- Produces: `trial?: boolean` on `AssessmentInfo`.

The 20 are the **Triage & Core Flows** section, which is already delimited by a `// ─── Triage & Core Flows ───` comment at the top of the array:

`triage`, `adhd-outpatient`, `adhd`, `adhdScreener`, `opd-psych-eval`, `cdr`, `fast`, `dementia`, `daphne6`, `moca`, `miniace`, `minicog`, `fab`, `mse`, `cognitiveSyndromes`, `iqcode`, `adam`, `tulia`, `callosal`, `consciousness`.

- [ ] **Step 1: Write the failing test**

In `src/__tests__/registry.test.ts`, add the import and a new describe block. Leave the four existing tests untouched.

```ts
import { isTrialAssessment } from '../lib/trialScope';

const TRIAL_KEYS = [
  'triage', 'adhd-outpatient', 'adhd', 'adhdScreener', 'opd-psych-eval',
  'cdr', 'fast', 'dementia', 'daphne6', 'moca',
  'miniace', 'minicog', 'fab', 'mse', 'cognitiveSyndromes',
  'iqcode', 'adam', 'tulia', 'callosal', 'consciousness',
];

describe('Trial membership', () => {
  it('flags exactly the Triage & Core Flows section, in order', () => {
    const flagged = assessments.filter(isTrialAssessment).map((a: any) => a.key);
    expect(flagged).toEqual(TRIAL_KEYS);
  });

  it('is a minority of the catalogue', () => {
    const flagged = assessments.filter(isTrialAssessment);
    // 20 of 96. Asserted as a range so adding assessments does not break it,
    // but a change that made the trial most of the product would.
    expect(flagged.length / assessments.length).toBeLessThan(0.3);
    expect(flagged.length).toBeGreaterThanOrEqual(20);
  });

  it('leaves the section that follows locked', () => {
    const locked = assessments.filter((a: any) => !isTrialAssessment(a)).map((a: any) => a.key);
    expect(locked).toContain('hamd');
    expect(locked).toContain('panss');
    expect(locked).toContain('bprs');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/registry.test.ts`
Expected: FAIL — `flagged` is `[]`, so `toEqual(TRIAL_KEYS)` fails and the locked-list test fails on `hamd`.

- [ ] **Step 3: Add the flag to the interface**

In `src/components/AssessmentSelector.tsx`, add one member to `AssessmentInfo`:

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

- [ ] **Step 4: Flag the 20 entries**

Add `trial: true` to each of the 20 entries listed above, immediately after `category`. For example the first three become:

```ts
  { key: 'triage', name: 'Psychiatric Triage', subtitle: 'Clinical Routing', icon: Shield, gradient: 'from-blue-600 to-indigo-700', category: ['all'], trial: true, description: '...' },
  { key: 'adhd-outpatient', name: 'ADHD Outpatient Flow', subtitle: 'Treatment Algorithm', icon: Activity, gradient: 'from-blue-600 to-indigo-700', category: ['all', 'cognitive'], trial: true, description: '...' },
  { key: 'adhd', name: 'ADHD (DSM-5)', subtitle: 'Diagnostic Criteria', icon: Focus, gradient: 'from-amber-500 to-orange-600', category: ['all', 'cognitive'], trial: true, description: '...' },
```

Change nothing else on any entry. The 76 entries from `delusions` onward get no flag.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/registry.test.ts`
Expected: PASS, 7 tests (4 existing plus 3 new).

- [ ] **Step 6: Commit**

```bash
git add src/components/AssessmentSelector.tsx src/__tests__/registry.test.ts
git commit -m "feat(trial): flag the 20 assessments a trial unlocks

The Triage & Core Flows section, which is the top of the registry. The
flag is explicit on each entry, so the free set cannot shift when an
assessment is added above it.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: The `trial-start` edge function

**Files:**
- Create: `supabase/functions/trial-start/index.ts`

**Interfaces:**
- Consumes: the `entitlements` table and its CHECK constraints (`plan IN ('developer','monthly','yearly','demo')`, `source IN ('admin','razorpay','trial','demo')`) — already in place, so no schema change.
- Produces: an HTTP endpoint returning `{ plan, source, expiresAt, permanent, started }`, or `{ error }` with a 401/500.

**Idempotency is the whole point.** A trial that can be started twice is not a gate.

- [ ] **Step 1: Write the function**

Create `supabase/functions/trial-start/index.ts`, following the JWT validation of `razorpay-status/index.ts` and the service-role write of `razorpay-verify/index.ts`:

```ts
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const TRIAL_DAYS = 3;
const DAY_MS = 86_400_000;

// Starts the caller's 3-day trial, at most once, ever.
//
// The identity comes ONLY from the verified JWT: any user id in the request body
// is ignored, so this cannot be used to start a trial for someone else.
//
// The row is written with the service role, because no browser may write
// `entitlements` — RLS grants read-own-row and no write policy at all. This
// function is the single deliberate exception, and it is narrow: one row, for
// the caller's own id, only when that id has no row of any kind.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const match = /^Bearer\s+(\S+)$/i.exec(req.headers.get('Authorization') ?? '');
    const token = match?.[1];
    if (!token) return json({ error: 'Sign-in required.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    // Validates signature, expiry and that the user exists. An anon key is not a
    // user token and fails here.
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Sign-in required.' }, 401);

    // Any existing row wins — a paid plan, an admin comp, or a trial that has
    // expired. An expired trial is spent: it is not a reason to grant a new one.
    const existing = await readEntitlement(supabase, user.id);
    if (existing) return json({ ...existing, started: false });

    const expiresAt = new Date(Date.now() + TRIAL_DAYS * DAY_MS).toISOString();
    const { data: inserted, error: insertError } = await supabase
      .from('entitlements')
      .insert({
        user_id: user.id,
        plan: 'demo',
        source: 'trial',
        expires_at: expiresAt,
        note: 'self-serve 3-day trial',
      })
      .select('plan, source, expires_at')
      .single();

    if (insertError) {
      // `user_id` is the primary key, so a concurrent call that inserted first
      // makes this one fail. That is the correct outcome, not an error: re-read
      // and return the row that won, so a retry cannot mint a second trial.
      const raced = await readEntitlement(supabase, user.id);
      if (raced) return json({ ...raced, started: false });
      console.error(insertError);
      return json({ error: 'Could not start a trial.' }, 500);
    }

    return json({
      plan: inserted.plan,
      source: inserted.source,
      expiresAt: inserted.expires_at,
      permanent: inserted.expires_at === null,
      started: true,
    });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error.' }, 500);
  }
});

async function readEntitlement(supabase: any, userId: string) {
  const { data } = await supabase
    .from('entitlements')
    .select('plan, source, expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) return null;
  return {
    plan: data.plan,
    source: data.source,
    expiresAt: data.expires_at,
    permanent: data.expires_at === null,
  };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 2: Operator deploys it**

Claude cannot reach the Supabase project.

```bash
supabase functions deploy trial-start --project-ref lusgyknbmprhmxbkkdbo
```

Expected: `Deployed Functions on project lusgyknbmprhmxbkkdbo: trial-start`. The function needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, which Supabase injects into every edge function by default; no extra secret is required.

- [ ] **Step 3: Operator verifies the contract by hand**

With a real user JWT (`USER_JWT` from a browser session) run the request twice:

```bash
curl -s -X POST 'https://lusgyknbmprhmxbkkdbo.supabase.co/functions/v1/trial-start' \
  -H "Authorization: Bearer $USER_JWT" | jq
```

Expected first call: `{"plan":"demo","source":"trial","expiresAt":"...","permanent":false,"started":true}`.

Run the identical command again. Expected: the **same** `expiresAt`, and `"started":false`. That is the idempotency requirement; a second `started:true` or a later `expiresAt` means the guard is wrong.

Then confirm no second row exists:

```sql
SELECT count(*) FROM public.entitlements WHERE user_id = '<that user id>';
```

Expected: `1`.

And that no JWT is refused:

```bash
curl -s -X POST 'https://lusgyknbmprhmxbkkdbo.supabase.co/functions/v1/trial-start' | jq
```

Expected: `{"error":"Sign-in required."}` with HTTP 401.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/trial-start/index.ts
git commit -m "feat(trial): a one-shot, server-side trial start

An expired trial is spent, so any existing row wins and the function
returns it with started:false. The insert is guarded by a re-read, since
user_id is the primary key and a concurrent call would otherwise race.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Client `startTrial()`

**Files:**
- Modify: `src/lib/entitlement.ts`
- Test: `src/lib/entitlement.test.ts` (extend)

**Interfaces:**
- Consumes: the `trial-start` endpoint from Task 3; the `Entitlement` type from the foundation.
- Produces: `TrialStart { entitlement: Entitlement | null; started: boolean }`; `startTrial(): Promise<TrialStart>`.

- [ ] **Step 1: Write the failing test**

Append to `src/lib/entitlement.test.ts`. The existing `sb` mock needs a `functions.invoke` member and an `auth.getSession` member — add them to the `vi.hoisted` block and the `vi.mock` factory at the top of the file:

```ts
const sb = vi.hoisted(() => ({
  rpc: vi.fn(),
  getSession: vi.fn(),
  invoke: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: sb.rpc,
    auth: { getSession: sb.getSession },
    functions: { invoke: sb.invoke },
  },
}));
```

Then the new tests:

```ts
describe('startTrial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sb.getSession.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
  });

  it('sends the user JWT and never an email', async () => {
    sb.invoke.mockResolvedValue({
      data: { plan: 'demo', source: 'trial', expiresAt: '2026-10-11T00:00:00Z', permanent: false, started: true },
      error: null,
    });
    const result = await startTrial();
    expect(result.started).toBe(true);
    expect(result.entitlement).toEqual({
      plan: 'demo',
      source: 'trial',
      expiresAt: '2026-10-11T00:00:00Z',
      permanent: false,
    });
    const [fn, opts] = sb.invoke.mock.calls[0];
    expect(fn).toBe('trial-start');
    expect(opts.headers.Authorization).toBe('Bearer user-jwt');
    expect(JSON.stringify(opts.body ?? {})).not.toMatch(/@/);
  });

  it('starts nothing without a session', async () => {
    sb.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const result = await startTrial();
    expect(result).toEqual({ entitlement: null, started: false });
    expect(sb.invoke).not.toHaveBeenCalled();
  });

  it('reports an already-spent trial as not started, and keeps the grant', async () => {
    sb.invoke.mockResolvedValue({
      data: { plan: 'demo', source: 'trial', expiresAt: '2026-10-11T00:00:00Z', permanent: false, started: false },
      error: null,
    });
    const result = await startTrial();
    expect(result.started).toBe(false);
    expect(result.entitlement?.source).toBe('trial');
  });

  it('fails closed when the function errors', async () => {
    sb.invoke.mockResolvedValue({ data: null, error: new Error('500') });
    expect(await startTrial()).toEqual({ entitlement: null, started: false });
  });

  it('fails closed when the function throws', async () => {
    sb.invoke.mockRejectedValue(new Error('network down'));
    expect(await startTrial()).toEqual({ entitlement: null, started: false });
  });
});
```

Add `startTrial` to the import at the top of the test file.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/entitlement.test.ts`
Expected: FAIL — `startTrial is not a function`.

- [ ] **Step 3: Implement**

Append to `src/lib/entitlement.ts`:

```ts
export interface TrialStart {
  /** The grant now held, or null if none was started and none existed. */
  entitlement: Entitlement | null;
  /** True only when this call is what created the trial. */
  started: boolean;
}

/**
 * Start the 3-day trial, once.
 *
 * The server decides. It refuses to write a second row for an account that has
 * any row already, so `started: false` on a second call is the expected, correct
 * answer rather than an error — the caller should treat the returned grant, if
 * any, as the truth either way.
 *
 * Fails closed: no session, an error, or a throw all mean no trial.
 */
export async function startTrial(): Promise<TrialStart> {
  const nothing: TrialStart = { entitlement: null, started: false };
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) return nothing;

    const { data, error } = await supabase.functions.invoke('trial-start', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (error || !data) return nothing;

    return {
      entitlement: {
        plan: data.plan as EntitlementPlan,
        source: data.source as EntitlementSource,
        expiresAt: data.expiresAt ?? null,
        permanent: data.permanent === true,
      },
      started: data.started === true,
    };
  } catch {
    return nothing;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/entitlement.test.ts`
Expected: PASS, 17 tests (12 existing plus 5 new).

- [ ] **Step 5: Commit**

```bash
git add src/lib/entitlement.ts src/lib/entitlement.test.ts
git commit -m "feat(trial): start the trial through the server

started:false is the correct answer on a second call, not an error, so
the caller reads the returned grant either way.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Wire the trial in, and take the restart path out

**Files:**
- Modify: `src/contexts/SubscriptionContext.tsx`
- Modify: `src/components/SettingsView.tsx`
- Test: `src/contexts/SubscriptionContext.test.tsx` (extend)

**Interfaces:**
- Consumes: `startTrial` from Task 4.
- Produces: the context gains `startTrial: () => Promise<boolean>` and `trialActive: boolean`; it **loses** `restartDemoTrial` and `demoUnlockAll`/`toggleDemoUnlockAll` only if a grep shows they are unused elsewhere — see step 3.

**This is the task that stops being additive.** The client can no longer start a trial on its own, and the restart affordance goes.

- [ ] **Step 1: Find every consumer of the restart path**

Run: `grep -rn "restartDemoTrial\|resetDemoTrial" --include=*.ts --include=*.tsx src`
Expected: the definition in `subscriptionService.ts`, the context wiring, `PaywallModal.tsx:93` and `:418`, and `SettingsView.tsx:36`. Write the list down; every one must be handled before this task is done, or TypeScript will fail at step 7.

- [ ] **Step 2: Write the failing test**

Append to `src/contexts/SubscriptionContext.test.tsx`. Add `startTrial` to the `ent` mock and its factory, and add a `trial` result helper:

```ts
const TRIAL = { plan: 'demo', source: 'trial', expiresAt: '2026-10-11T00:00:00Z', permanent: false } as const;
```

```ts
describe('SubscriptionContext trial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listeners = [];
    ent.onAuthChange.mockImplementation((cb: () => void) => {
      listeners.push(cb);
      return () => {};
    });
    ent.currentAuthUser.mockResolvedValue({ id: 'u1', email: 'someone@example.com' });
    ent.serverEntitlement.mockResolvedValue(null);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reports the trial as running once it is started', async () => {
    ent.startTrial.mockResolvedValue({ entitlement: TRIAL, started: true });
    ent.serverEntitlement
      .mockResolvedValueOnce(null)   // before
      .mockResolvedValue(TRIAL);     // after starting

    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(screen.getByTestId('trial').textContent).toBe('false');

    await act(async () => {
      await started!.startTrial();
    });

    await waitFor(() => expect(screen.getByTestId('trial').textContent).toBe('true'));
    expect(screen.getByTestId('source').textContent).toBe('demo');
  });

  it('reports no trial when the server refuses to start one', async () => {
    ent.startTrial.mockResolvedValue({ entitlement: null, started: false });
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    await act(async () => {
      await started!.startTrial();
    });
    expect(screen.getByTestId('trial').textContent).toBe('false');
    expect(screen.getByTestId('premium').textContent).toBe('false');
  });
});
```

Add a `trial` span to the `Probe` component and capture the context value in a module-level `started` variable:

```tsx
let started: ReturnType<typeof useSubscription> | null = null;

const Probe = () => {
  const value = useSubscription();
  started = value;
  return (
    <div>
      <span data-testid="premium">{String(value.isPremium)}</span>
      <span data-testid="source">{value.premiumSource}</span>
      <span data-testid="server">{String(value.serverPremium)}</span>
      <span data-testid="checking">{String(value.checkingServerAccess)}</span>
      <span data-testid="trial">{String(value.trialActive)}</span>
    </div>
  );
};
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: FAIL — `trialActive` and `startTrial` are undefined.

- [ ] **Step 4: Implement**

In `src/contexts/SubscriptionContext.tsx`:

Extend the import from Task 4's module:

```ts
import { currentAuthUser, onAuthChange, serverEntitlement, startTrial as requestTrial, type Entitlement } from '@/lib/entitlement';
```

Add to `SubscriptionContextType`, replacing the `restartDemoTrial` member:

```ts
  /** Request the 3-day trial from the server. Resolves true once it is running. */
  startTrial: () => Promise<boolean>;
  /** Whether a trial grant is currently active on this device. */
  trialActive: boolean;
```

Add the handler, beside the existing `restoreWebAccess`:

```ts
  // The server decides whether a trial may start, and refuses a second one for
  // an account that already has a row. Re-reading the grant afterwards, rather
  // than trusting the response, keeps this one source of truth.
  const startTrial = async (): Promise<boolean> => {
    const result = await requestTrial();
    if (!result.entitlement) return false;
    setEntitlement(result.entitlement);
    setCheckingServerAccess(false);
    return true;
  };
```

Derive `trialActive` next to `premiumSource`:

```ts
  // A trial grant is a grant, so `isPremium` is true during a trial too. Only the
  // source says which kind it is, which is what lets the assessment lock give a
  // trial its subset and a paid plan everything.
  const trialActive = entitlement?.source === 'trial' || entitlement?.source === 'demo';
```

Add both to the `value` object literal, and delete `restartDemoTrial` from it. Keep `demoTrialActive` and `demoTrialMsLeft` — `PaywallModal.restore.test.tsx:15` mocks them, and the demo-trial path is not what this task removes.

- [ ] **Step 5: Handle the consumers found in step 1**

In `src/components/SettingsView.tsx:36`, remove `restartDemoTrial` from the destructure and replace the control that called it with one that calls `startTrial`. Keep the surrounding copy's meaning — a trial is now started, not restarted.

In `src/components/PaywallModal.tsx:93`, remove `restartDemoTrial` from the destructure. Its call site at `:418` is handled in Task 7.

In `src/services/subscriptionService.ts`, delete `resetDemoTrial`. Leave `DEMO_TRIAL_DAYS`, `getDemoTrialStart`, `getDemoTrialMsLeft` and `isDemoTrialActive` alone: the length is unchanged and the local trial still runs out on its own for anyone mid-trial at deploy time.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 7: Check nothing still references the removed path**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0. Any "Property 'restartDemoTrial' does not exist" error names a consumer step 1 missed.

Run: `grep -rn "restartDemoTrial\|resetDemoTrial" --include=*.ts --include=*.tsx src`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/contexts/SubscriptionContext.tsx src/components/SettingsView.tsx src/services/subscriptionService.ts
git commit -m "feat(trial): start the trial server-side and drop the client restart

The client could mint itself a fresh three days, and a button in the
paywall did exactly that. Both go. An expired trial is spent.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Lock enforcement at all three points

**Files:**
- Modify: `src/components/AssessmentSelector.tsx`
- Test: `src/components/AssessmentSelector.lock.test.tsx`

**Interfaces:**
- Consumes: `canOpenAssessment` from Task 1; `premiumSource` and `trialActive` from Task 5.
- Produces: nothing new.

The three points, all in this one component:

| # | Location | Why it is needed |
|---|---|---|
| 1 | `openAssessment` (~line 425) | Every tile click and the psychosis Previous/Next chain go through it |
| 2 | the `if (selectedAssessment)` branch (line 493) | A deep link sets the state at line 407 without passing through `openAssessment` |
| 3 | `renderTile` (line 965) | So the free set is legible before anyone clicks |

- [ ] **Step 1: Write the failing test**

Create `src/components/AssessmentSelector.lock.test.tsx`. The selector is heavy, so this test targets the predicate wiring rather than rendering all 96 tiles:

```tsx
import { describe, expect, it } from 'vitest';
import { canOpenAssessment } from '@/lib/trialScope';
import { assessments } from './AssessmentSelector';

const byKey = (key: string) => assessments.find((a: any) => a.key === key)!;

describe('assessment lock', () => {
  it('gives a paid plan everything', () => {
    const access = { fullAccess: true, trialActive: false };
    expect(canOpenAssessment(byKey('hamd'), access)).toBe(true);
    expect(canOpenAssessment(byKey('triage'), access)).toBe(true);
  });

  it('gives a trial only the flagged subset', () => {
    const access = { fullAccess: false, trialActive: true };
    expect(canOpenAssessment(byKey('triage'), access)).toBe(true);
    expect(canOpenAssessment(byKey('hamd'), access)).toBe(false);
    expect(canOpenAssessment(byKey('panss'), access)).toBe(false);
  });

  it('gives someone with nothing nothing', () => {
    const access = { fullAccess: false, trialActive: false };
    expect(canOpenAssessment(byKey('triage'), access)).toBe(false);
    expect(canOpenAssessment(byKey('hamd'), access)).toBe(false);
  });

  it('covers every registry key without throwing', () => {
    const access = { fullAccess: false, trialActive: true };
    for (const a of assessments) {
      expect(typeof canOpenAssessment(a, access)).toBe('boolean');
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/AssessmentSelector.lock.test.tsx`
Expected: PASS for the first three once Task 2 is done — this file pins the rule, and it should go green here. If it fails, the flags from Task 2 are wrong; fix them before touching the component.

This is deliberate: the *rule* is tested without the component, so any failure in step 3's manual check is unambiguously a wiring mistake.

- [ ] **Step 3: Wire the three points**

In `src/components/AssessmentSelector.tsx`, add the import:

```ts
import { canOpenAssessment } from '@/lib/trialScope';
```

Confirm `isProSource` is imported from `@/services/subscriptionService` (Task 6 of the foundation plan added it). Then, beside the existing `const { subscription, setShowPaywall, premiumSource } = useSubscription();` at line 366, add `trialActive` to that destructure and compute the access pair once:

```ts
  const access = {
    fullAccess: isProSource(premiumSource),
    trialActive,
  };
```

**Point 1 — `openAssessment`** (currently ~line 425):

```ts
  const openAssessment = (key: AssessmentKey) => {
    const entry = assessments.find((a) => a.key === key);
    if (entry && !canOpenAssessment(entry, access)) {
      setShowPaywall(true);
      return;
    }
    setLanguage('en');
    setSelectedAssessment(key);
    navigate(`/assessment/${key}`, { replace: false });
    window.scrollTo(0, 0);
  };
```

**Point 2 — the render branch.** Change the condition at line 493 from `if (selectedAssessment) {` to:

```ts
  const selectedEntry = selectedAssessment
    ? assessments.find((a) => a.key === selectedAssessment)
    : undefined;
  const selectedLocked = !!selectedEntry && !canOpenAssessment(selectedEntry, access);

  if (selectedLocked) {
    // A deep link sets `selectedAssessment` directly, so the click path never
    // runs. Without this, typing an assessment's URL opens it for anyone.
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
        <div className="max-w-sm text-center space-y-4">
          <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This assessment is part of Cognito Pro.
          </p>
          <Button className="min-h-[44px] w-full" onClick={() => setShowPaywall(true)}>
            See plans
          </Button>
          <Button variant="outline" className="min-h-[44px] w-full" onClick={handleBackToMenu}>
            {t('backToMenu')}
          </Button>
        </div>
      </div>
    );
  }

  if (selectedAssessment) {
```

Add `Lock` to the existing `lucide-react` import in that file.

**Point 3 — `renderTile`.** Inside the function, after `const reference = ...`, add:

```ts
                      const locked = !canOpenAssessment(a, access);
```

and render a lock on the icon when locked, plus a line in the tooltip. Replace the icon block's wrapper and add the badge after the subtitle `<p>`:

```jsx
                              {locked && (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                                  <Lock className="h-2.5 w-2.5" />
                                  Pro
                                </span>
                              )}
```

and add to the `TooltipContent`, after the description paragraph:

```jsx
                              {locked && (
                                <p className="text-xs font-medium text-foreground">
                                  Part of Cognito Pro.
                                </p>
                              )}
```

- [ ] **Step 4: Typecheck and run the suite**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0.

Run: `npx vitest run`
Expected: PASS, everything green.

- [ ] **Step 5: Verify by hand, in a browser**

Run: `npm run dev`

1. Sign in with an account that has no entitlement, start the trial from the paywall.
2. Expected: the home list shows a **Pro** badge on the 76 locked tiles and none on the 20 free ones.
3. Click `triage`. Expected: it opens.
4. Click `HAM-D`. Expected: the paywall, not the assessment.
5. Navigate directly to `/assessment/hamd`. Expected: the locked screen with "This assessment is part of Cognito Pro", **not** the assessment. This is Review Focus item 2 and the one most likely to have been missed.
6. Sign out. Expected: the paywall covers everything.

- [ ] **Step 6: Commit**

```bash
git add src/components/AssessmentSelector.tsx src/components/AssessmentSelector.lock.test.tsx
git commit -m "feat(trial): lock the assessments a trial does not cover

Enforced at all three points that can reach an assessment, including the
deep-link render branch, which bypasses the click handler entirely.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: The paywall's trial entry, and the close button that does nothing

**Files:**
- Modify: `src/components/PaywallModal.tsx`
- Modify: `src/components/AuthGuard.tsx`
- Test: `src/components/PaywallModal.trial.test.tsx`

**Interfaces:**
- Consumes: `startTrial` from Task 5; `verifyEmailCode` from `@/lib/entitlement`.
- Produces: `PaywallModalProps.onClose` becomes **optional**; a close button renders only when it is provided.

**The dead control:** `AuthGuard` renders the blocking paywall with `onClose={() => {}}`, and the modal renders an X wired to it (`PaywallModal.tsx:320`). It looks dismissable and is not. Making `onClose` optional removes the control rather than making it lie.

- [ ] **Step 1: Write the failing test**

Create `src/components/PaywallModal.trial.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

const ent = vi.hoisted(() => ({ verifyEmailCode: vi.fn() }));
vi.mock('@/lib/entitlement', () => ({ verifyEmailCode: ent.verifyEmailCode }));
vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  requestRestoreCode: vi.fn().mockResolvedValue(null),
  verifyRestoreCode: vi.fn(),
}));
vi.mock('@/lib/appbuild/wrapper', () => ({ waitForWrapper: () => Promise.resolve(null) }));

const sub = vi.hoisted(() => ({ startTrial: vi.fn(), refreshSubscription: vi.fn(), demoTrialActive: false, demoTrialMsLeft: 0 }));
vi.mock('@/contexts/SubscriptionContext', () => ({ useSubscription: () => ({ ...sub, setShowPaywall: vi.fn() }) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { PaywallModal } from './PaywallModal';

describe('PaywallModal trial entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders no close button when it cannot close', () => {
    render(<PaywallModal isOpen onSelectPlan={vi.fn()} />);
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('renders a close button when onClose is supplied', () => {
    const onClose = vi.fn();
    render(<PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('starts the trial with an emailed code', async () => {
    ent.verifyEmailCode.mockResolvedValue({ ok: true });
    sub.startTrial.mockResolvedValue(true);
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'Someone@Example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Start my trial'));

    await waitFor(() => expect(ent.verifyEmailCode).toHaveBeenCalledWith('Someone@Example.com', '123456'));
    await waitFor(() => expect(sub.startTrial).toHaveBeenCalled());
  });

  it('does not start a trial when the code is rejected', async () => {
    ent.verifyEmailCode.mockResolvedValue({ ok: false, message: 'That code was not accepted.' });
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '000000' } });
    fireEvent.click(screen.getByText('Start my trial'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/not accepted/i);
    expect(sub.startTrial).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/PaywallModal.trial.test.tsx`
Expected: FAIL — `onClose` is required by the props type, and there is no "Start 3-day trial" control.

- [ ] **Step 3: Make `onClose` optional and gate the button**

In `src/components/PaywallModal.tsx`, change the prop in `PaywallModalProps`:

```ts
  /** Supplied only when the modal may be dismissed. The blocking instance omits it. */
  onClose?: () => void;
```

and the destructure:

```ts
export const PaywallModal = ({ isOpen, onClose, onSelectPlan, isLoading = false }: PaywallModalProps) => {
```

Then wrap the close button at line 320:

```jsx
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full bg-background/70 p-2 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
```

In `src/components/AuthGuard.tsx`, drop the no-op from the blocking instance:

```jsx
        <PaywallModal isOpen={true} onSelectPlan={() => {}} />
```

- [ ] **Step 4: Add the trial entry flow**

Extend the existing restore flow rather than duplicating it. `PaywallModal.tsx` already has `type RestoreStep = 'closed' | 'email' | 'code'` and the `requestRestoreCode` / `verifyRestoreCode` pair; the trial uses the same two steps with a different second action.

Add state beside the existing restore state:

```ts
  const [trialStep, setTrialStep] = useState<RestoreStep>('closed');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialCode, setTrialCode] = useState('');
  const [trialError, setTrialError] = useState<string | null>(null);
  const [startingTrial, setStartingTrial] = useState(false);
```

Add the handlers, modelled on `handleRequestRestoreCode` and `handleSubmitRestoreCode`:

```ts
  const handleStartTrial = () => {
    setTrialError(null);
    setTrialStep('email');
  };

  const handleTrialEmail = async () => {
    setStartingTrial(true);
    setTrialError(null);
    try {
      const result = await requestEmailCode(trialEmail);
      if (!result.ok) throw new Error(result.message ?? 'Could not send a code.');
      setTrialStep('code');
    } catch (e: unknown) {
      setTrialError(e instanceof Error ? e.message : 'Could not send a code.');
    } finally {
      setStartingTrial(false);
    }
  };

  const handleTrialVerify = async () => {
    setStartingTrial(true);
    setTrialError(null);
    try {
      const verified = await verifyEmailCode(trialEmail, trialCode);
      if (!verified.ok) throw new Error(verified.message ?? 'That code was not accepted.');
      // The server decides whether a trial may start: it refuses for an account
      // that already holds any grant, including a spent trial.
      const started = await startTrial();
      if (!started) throw new Error('A trial has already been used on this account.');
      setTrialCode('');
      setTrialStep('closed');
      onClose?.();
    } catch (e: unknown) {
      setTrialError(e instanceof Error ? e.message : 'Could not start the trial.');
    } finally {
      setStartingTrial(false);
    }
  };
```

Add `requestEmailCode`, `verifyEmailCode` to the `@/lib/entitlement` import, and `startTrial` to the `useSubscription()` destructure.

Render the entry point near the demo link. When `trialStep === 'closed'`, the button;

```jsx
              {trialStep === 'closed' ? (
                <button
                  onClick={handleStartTrial}
                  className="mt-2 text-sm font-medium text-primary underline underline-offset-4"
                >
                  Start 3-day trial
                </button>
              ) : (
                <div className="mt-3 space-y-2 text-left">
                  <Label htmlFor="trial-email">Your email</Label>
                  <Input
                    id="trial-email"
                    type="email"
                    inputMode="email"
                    value={trialEmail}
                    onChange={(e) => setTrialEmail(e.target.value)}
                    disabled={startingTrial}
                  />
                  {trialStep === 'code' && (
                    <>
                      <Label htmlFor="trial-code">One-time code</Label>
                      <Input
                        id="trial-code"
                        inputMode="numeric"
                        value={trialCode}
                        onChange={(e) => setTrialCode(e.target.value)}
                        disabled={startingTrial}
                      />
                    </>
                  )}
                  {trialError && (
                    <p role="alert" className="text-sm text-destructive">{trialError}</p>
                  )}
                  <Button
                    className="min-h-[44px] w-full"
                    disabled={startingTrial}
                    onClick={() => void (trialStep === 'email' ? handleTrialEmail() : handleTrialVerify())}
                  >
                    {trialStep === 'email' ? 'Email me a code' : 'Start my trial'}
                  </Button>
                </div>
              )}
```

- [ ] **Step 5: Remove the demo-restart control**

At `PaywallModal.tsx:418` the demo link calls `restartDemoTrial()`. Delete that call and the control around it, along with `restartDemoTrial` from the destructure at line 93 and the `demoTrialActive ? ... : ...` label at line 424–425 that advertised the restart.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/PaywallModal.trial.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 7: Verify nothing regressed**

Run: `npx vitest run`
Expected: PASS, all green, with `PaywallModal.restore.test.tsx` untouched — it passes `onClose={vi.fn()}`, which is still valid now that the prop is optional.

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/components/PaywallModal.tsx src/components/AuthGuard.tsx src/components/PaywallModal.trial.test.tsx
git commit -m "feat(paywall): a trial entry flow, and no button that does nothing

onClose becomes optional, so the blocking instance renders no close
control rather than one wired to a no-op. Trial entry reuses the existing
email-code machinery and lets the server refuse a second trial.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## End-to-end acceptance

Run after all seven tasks, on the PWA in a browser.

1. **No account.** The paywall covers everything; there is no way to reach an assessment without signing in. Start the trial → email → code.
2. **During the trial.** The 20 flagged tiles open; the other 76 show **Pro** and open the paywall. `/assessment/hamd` typed directly shows the locked screen.
3. **Restart attempt.** Clear storage, reload, sign in again. The trial does **not** restart — the server returns `started: false`, and the paywall's trial button reports that a trial has already been used.
4. **After three days.** The `entitlements` row's `expires_at` passes, `current_entitlement()` returns no row, and the paywall covers everything including the 20.
5. **The owner.** Signing in with the developer email reaches all 96, and the header reads **Pro**.
6. **The App Store build.** Not testable from a browser. Covered by the foundation plan's Task 2 unit tests: an admin-sourced grant is suppressed when the wrapper is present.
