# Trial Scoping and Enforcement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three-day trial a real gate: it unlocks the 20 assessments of the registry's Triage & Core Flows section and nothing else, it is startable once per account because the server records it, and every other assessment meets the paywall.

**Architecture:** The server half is already built and committed (`83551f8`) — `entitlement_tier()` and `start_trial()` in `20261008130000_trial.sql`, `entitlementTier()` and `startTrial()` in `src/lib/entitlement.ts`. This plan does not rebuild it. It swaps the one thing that half gets wrong — the scope rule, which currently opens 38 assessments by category and excludes `triage` — then wires the tier into the app and enforces it at the three points that can reach an assessment.

**Tech Stack:** Vite + React 18 + TypeScript, Supabase (Postgres RLS, SQL functions), Tailwind + shadcn/ui, Vitest 4 + @testing-library/react (jsdom).

**Spec:** `Docs/superpowers/specs/2026-10-08-paywall-developer-access-design.md` — sections 8, 9 and 10. Global Constraints and Review Focus below are this plan's own; the spec's apply as well.

**Depends on:** `Docs/superpowers/plans/2026-10-08-paywall-developer-access.md` (the foundation) for the native-build work only. The trial no longer depends on it: the tier comes from `entitlement_tier()`, not from the foundation's `premiumSource`. See "Open interface" at the end.

## Global Constraints

- **No email address is ever an access key.** Identity is `auth.users.id`, reached only through a verified Supabase session.
- **No browser may write `entitlements`** — with one exception that already exists and is not changed here: `start_trial()`, `SECURITY DEFINER`, which can insert one trial row for the caller, only when the caller has no row at all. The client gains no new write path.
- **The developer's user id and email never enter the client bundle.**
- **The trial's length stays three days**, computed by the database clock.
- **Fail closed.** An unreachable backend, a signed-out user or a missing session means tier `'none'`, and the paywall shows.
- **`import.meta.env.DEV` is `false` in both the production PWA and the App Store build.** Never gate a production behaviour on it.
- **The existing suite must stay green.** `trialScope.test.ts` is deliberately *rewritten* by Task 1; nothing else may need editing to pass.

## Review Focus

Failure modes this plan's tests pin, most likely to bite first. Each has a test in the task that owns the code.

1. **The lock must survive a deep link.** `/assessment/hamd` typed into the address bar sets the selected assessment directly (`AssessmentSelector.tsx:407`), never passing through `openAssessment`. Enforcing only in the click handler leaves the whole product open by URL. Pinned in Task 3.
2. **An unlocked assessment must stay unlocked during a trial.** The trial's entire content is the flagged subset, so over-tightening is a user-visible bug: a trial visitor clicking the first tile must get an assessment, not a paywall. Pinned in Tasks 1 and 3.
3. **The scope list must not drift from the registry.** A renamed or removed key would silently shrink the trial, and a key added to the section would silently stay locked. Pinned in Task 1.
4. **A trial is startable once.** Clearing storage, reinstalling or switching device must not mint a second window. Pinned in Task 2 and the acceptance run.
5. **The paywall must not render a control that does nothing.** Its close button is wired to a no-op `onClose` in the blocking instance. Pinned in Task 4.

---

### Task 1: Swap the trial scope to the 20 keys

**Files:**
- Modify: `src/config/trialScope.ts` (28 lines, replaces the category rule)
- Modify: `src/__tests__/trialScope.test.ts` (rewrite: it currently asserts the opposite)

**Interfaces:**
- Consumes: `AssessmentKey` from `@/components/AssessmentSelector` (type-only, no runtime cycle); `EntitlementTier` from `@/lib/entitlement`.
- Produces: `TRIAL_KEYS: readonly AssessmentKey[]`; `isVisibleInTrial(key: AssessmentKey): boolean`; `canOpenAssessment(key: AssessmentKey, tier: EntitlementTier): boolean`; `EntitlementTier` re-exported for callers that only need the scope.

**What changes and why.** The committed rule is `TRIAL_CATEGORIES = ['cognitive','mood','sleep']`, which opens 38 of 96 assessments (40%) and deliberately excludes `triage` — `trialScope.test.ts:25` asserts that exclusion. The approved scope is the 20-entry Triage & Core Flows section at the top of the registry (21%), and `triage` is its first member. A key list replaces the category list; the module, its name and its "this is presentation scope, not access control" structure all stay.

- [ ] **Step 1: Write the failing test**

Replace `src/__tests__/trialScope.test.ts` entirely:

```ts
import { describe, it, expect } from 'vitest';
import { TRIAL_KEYS, canOpenAssessment, isVisibleInTrial } from '../config/trialScope';
import { assessments } from '../components/AssessmentSelector';

/** The Triage & Core Flows section, which is the top of the registry. */
const SECTION_KEYS = assessments.slice(0, 20).map((a) => a.key);

describe('trial scope', () => {
  it('is the twenty-entry Triage & Core Flows section', () => {
    expect(TRIAL_KEYS).toHaveLength(20);
  });

  it('matches the top of the registry exactly, in order', () => {
    // The invariant that catches drift: renaming a key, deleting an assessment,
    // or inserting one into the section all fail here rather than silently
    // changing what a trial unlocks.
    expect([...TRIAL_KEYS]).toEqual(SECTION_KEYS);
  });

  it('lists no key twice', () => {
    expect(new Set(TRIAL_KEYS).size).toBe(TRIAL_KEYS.length);
  });

  it('names only keys that exist in the registry', () => {
    const known = new Set(assessments.map((a) => a.key));
    for (const key of TRIAL_KEYS) expect(known.has(key)).toBe(true);
  });

  it('includes triage, which the category rule had excluded', () => {
    expect(isVisibleInTrial('triage')).toBe(true);
    expect(canOpenAssessment('triage', 'trial')).toBe(true);
  });

  it('is a minority of the catalogue, near a quarter', () => {
    // 20 of 96. A band rather than a fixed ratio, so adding assessments does not
    // break it, while a change that made the trial most of the product still would.
    const share = TRIAL_KEYS.length / assessments.length;
    expect(share).toBeGreaterThan(0.15);
    expect(share).toBeLessThan(0.3);
  });

  it('hides the assessments immediately below the section', () => {
    expect(isVisibleInTrial('delusions')).toBe(false);
    expect(isVisibleInTrial('bprs')).toBe(false);
  });
});

describe('canOpenAssessment', () => {
  it('opens everything for a full tier', () => {
    expect(canOpenAssessment('hamd', 'full')).toBe(true);
    expect(canOpenAssessment('triage', 'full')).toBe(true);
  });

  it('opens only the section for a trial', () => {
    expect(canOpenAssessment('triage', 'trial')).toBe(true);
    expect(canOpenAssessment('hamd', 'trial')).toBe(false);
    expect(canOpenAssessment('delusions', 'trial')).toBe(false);
  });

  it('opens nothing for no tier', () => {
    expect(canOpenAssessment('triage', 'none')).toBe(false);
    expect(canOpenAssessment('hamd', 'none')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/trialScope.test.ts`
Expected: FAIL. `TRIAL_KEYS` is undefined, and `isVisibleInTrial('triage')` is currently `false`, since `triage` is `['all']` and `all` is not a trial category.

- [ ] **Step 3: Implement**

Replace `src/config/trialScope.ts` entirely:

```ts
import type { AssessmentKey } from '@/components/AssessmentSelector';
import type { EntitlementTier } from '@/lib/entitlement';

/**
 * What the 3-day trial unlocks.
 *
 * This is presentation scope, not entitlement: the server decides *whether* an
 * account is in a trial (`entitlement_tier()`), and this decides what a trial is
 * allowed to see. Keeping the list here means the trial's contents can change
 * without touching access control.
 *
 * Membership is an explicit list of keys, never a category test. A category rule
 * cannot express "the top of the registry": `cognitive` alone would reach 38 of
 * the 96 assessments, and `triage` — the first thing a new user should try —
 * belongs to no category but `all`.
 *
 * These are the twenty entries of the registry's Triage & Core Flows section.
 * `src/__tests__/trialScope.test.ts` pins the list against the top of the
 * registry, so a renamed key fails the build rather than silently shrinking the
 * trial.
 */
export const TRIAL_KEYS: readonly AssessmentKey[] = [
  'triage',
  'adhd-outpatient',
  'adhd',
  'adhdScreener',
  'opd-psych-eval',
  'cdr',
  'fast',
  'dementia',
  'daphne6',
  'moca',
  'miniace',
  'minicog',
  'fab',
  'mse',
  'cognitiveSyndromes',
  'iqcode',
  'adam',
  'tulia',
  'callosal',
  'consciousness',
];

/** May a trial see this assessment? */
export const isVisibleInTrial = (key: AssessmentKey): boolean => TRIAL_KEYS.includes(key);

/**
 * May this tier open this assessment?
 *
 * `full` is everything; `trial` is the section above; `none` is nothing. Used at
 * every point that can reach an assessment, so the rule has one home.
 */
export const canOpenAssessment = (key: AssessmentKey, tier: EntitlementTier): boolean =>
  tier === 'full' || (tier === 'trial' && isVisibleInTrial(key));

export type { EntitlementTier };
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/trialScope.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0. A key outside `AssessmentKey` is a compile error here, which is the point of typing the list rather than using `string[]`.

- [ ] **Step 6: Commit**

```bash
git add src/config/trialScope.ts src/__tests__/trialScope.test.ts
git commit -m "feat(trial): scope the trial to the Triage & Core Flows section

The category rule opened 38 of 96 assessments and excluded triage, which
belongs to no category but all. An explicit key list is what the approved
scope describes, and a category test cannot express the top of the
registry.

The test pins the list against assessments.slice(0, 20), so a renamed or
added key fails the build instead of quietly changing what is free.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Put the tier in the subscription context

**Files:**
- Modify: `src/contexts/SubscriptionContext.tsx`
- Modify: `src/components/SettingsView.tsx:36` (the only other consumer of the removed `restartDemoTrial`)
- Modify: `src/services/subscriptionService.ts` (delete `resetDemoTrial` at line 100)
- Test: `src/contexts/SubscriptionContext.test.tsx` (extend)

**Interfaces:**
- Consumes: `entitlementTier()`, `startTrial()`, `onAuthChange()` from `@/lib/entitlement` (all already committed).
- Produces: the context gains `tier: EntitlementTier`, `hasFullAccess: boolean`, `checkingServerAccess: boolean`, and `startTrial: () => Promise<EntitlementTier>`; it loses `restartDemoTrial`.

**The client could mint itself a fresh three days,** and a button in the paywall did exactly that. `startTrial()` now asks the server, which refuses a second trial for any account that already holds a row.

- [ ] **Step 1: Find every consumer of the restart path**

Run: `grep -rn "restartDemoTrial\|resetDemoTrial" --include=*.ts --include=*.tsx src`
Expected: the definition in `subscriptionService.ts:100`, the context wiring at `SubscriptionContext.tsx:162` and `:205`, `PaywallModal.tsx:93` and `:418`, and `SettingsView.tsx:36`. Write the list down; every one must be handled before step 6, or TypeScript will fail at step 7.

- [ ] **Step 2: Write the failing test**

Append to `src/contexts/SubscriptionContext.test.tsx`. Add an `ent` mock for the entitlement module if the file does not already have one:

```ts
const ent = vi.hoisted(() => ({
  entitlementTier: vi.fn(),
  startTrial: vi.fn(),
  onAuthChange: vi.fn(),
}));
vi.mock('@/lib/entitlement', () => ent);
```

Add a module-level capture and a `Probe` that exposes the new fields:

```tsx
let current: ReturnType<typeof useSubscription> | null = null;

const Probe = () => {
  const value = useSubscription();
  current = value;
  return (
    <div>
      <span data-testid="tier">{value.tier}</span>
      <span data-testid="full">{String(value.hasFullAccess)}</span>
      <span data-testid="checking">{String(value.checkingServerAccess)}</span>
    </div>
  );
};
```

```ts
describe('SubscriptionContext tier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ent.onAuthChange.mockReturnValue(() => {});
  });

  it('starts at none, then reports the server tier', async () => {
    ent.entitlementTier.mockResolvedValue('trial');
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(screen.getByTestId('tier').textContent).toBe('trial');
    expect(screen.getByTestId('full').textContent).toBe('false');
  });

  it('reports full access for a full tier', async () => {
    ent.entitlementTier.mockResolvedValue('full');
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('full').textContent).toBe('true'));
  });

  it('fails closed when the tier cannot be read', async () => {
    ent.entitlementTier.mockRejectedValue(new Error('offline'));
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(screen.getByTestId('tier').textContent).toBe('none');
  });

  it('re-reads the tier when the session changes', async () => {
    ent.entitlementTier.mockResolvedValue('none');
    let fire: (() => void) | null = null;
    ent.onAuthChange.mockImplementation((cb: () => void) => {
      fire = cb;
      return () => {};
    });
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    ent.entitlementTier.mockResolvedValue('full');
    await act(async () => {
      fire!();
    });
    await waitFor(() => expect(screen.getByTestId('tier').textContent).toBe('full'));
  });

  it('adopts the tier the server returns when a trial starts', async () => {
    ent.entitlementTier.mockResolvedValue('none');
    ent.startTrial.mockResolvedValue('trial');
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    let result: string | undefined;
    await act(async () => {
      result = await current!.startTrial();
    });

    expect(result).toBe('trial');
    expect(screen.getByTestId('tier').textContent).toBe('trial');
  });

  it('stays at none when the server refuses to start a trial', async () => {
    ent.entitlementTier.mockResolvedValue('none');
    ent.startTrial.mockResolvedValue('none');
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    await act(async () => {
      await current!.startTrial();
    });

    expect(screen.getByTestId('tier').textContent).toBe('none');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: FAIL — `value.tier` and `value.startTrial` are undefined.

- [ ] **Step 4: Implement**

In `src/contexts/SubscriptionContext.tsx`, add the import:

```ts
import { entitlementTier, onAuthChange, startTrial as requestTrial, type EntitlementTier } from '@/lib/entitlement';
```

Add to `SubscriptionContextType`, replacing the `restartDemoTrial` member:

```ts
  /** The access tier the server reports: everything, the trial section, or nothing. */
  tier: EntitlementTier;
  /** True only for a paid or developer entitlement — everything is open. */
  hasFullAccess: boolean;
  /** True until the first tier read settles, so the UI can avoid a flash of paywall. */
  checkingServerAccess: boolean;
  /** Ask the server to start the 3-day trial. Returns the tier afterwards. */
  startTrial: () => Promise<EntitlementTier>;
```

Add the state beside the existing `webPremium` state:

```ts
  const [tier, setTier] = useState<EntitlementTier>('none');
  const [checkingServerAccess, setCheckingServerAccess] = useState(true);
```

Add the effect after the existing auth-state effect:

```ts
  // The server decides access. Read the tier once on mount and again whenever the
  // session changes, which is what makes a sign-in, a sign-out or a new
  // subscription take effect without a reload. A failure is not a retry loop: it
  // settles at 'none', which shows the paywall rather than guessing.
  useEffect(() => {
    let cancelled = false;
    const read = () => {
      entitlementTier()
        .then((next) => {
          if (!cancelled) setTier(next);
        })
        .catch(() => {
          if (!cancelled) setTier('none');
        })
        .finally(() => {
          if (!cancelled) setCheckingServerAccess(false);
        });
    };
    read();
    const unsubscribe = onAuthChange(read);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
```

Add the handler, replacing `restartDemoTrial`:

```ts
  // The server owns this decision. If the account already holds any entitlement
  // row — a spent trial, a paid plan, an admin grant — nothing is written and the
  // tier it already has comes back. Adopting the returned tier rather than
  // assuming a trial started keeps one source of truth.
  const startTrial = async (): Promise<EntitlementTier> => {
    const next = await requestTrial();
    setTier(next);
    setCheckingServerAccess(false);
    if (next !== 'none') setShowPaywall(false);
    return next;
  };
```

Derive `hasFullAccess` beside `premiumSource`:

```ts
  const hasFullAccess = tier === 'full';
```

Add `tier`, `hasFullAccess`, `checkingServerAccess` and `startTrial` to the `value` object literal, and delete `restartDemoTrial` from it. Leave `isPremium`, `premiumSource`, `demoTrialActive` and `demoTrialMsLeft` as they are: they describe the store and device-local demo paths, which this task does not change, and `PaywallModal.restore.test.tsx` mocks them.

- [ ] **Step 5: Handle the consumers found in step 1**

In `src/components/SettingsView.tsx:36`, remove `restartDemoTrial` from the destructure and replace the control that called it with one that calls `startTrial`. Keep the surrounding copy's meaning — a trial is started, not restarted.

In `src/components/PaywallModal.tsx:93`, remove `restartDemoTrial` from the destructure. Its call site at `:418` is handled in Task 4.

In `src/services/subscriptionService.ts`, delete `resetDemoTrial`. Leave `DEMO_TRIAL_DAYS`, `getDemoTrialStart`, `getDemoTrialMsLeft` and `isDemoTrialActive` alone: the length is unchanged, and anyone mid-demo at deploy time still runs out on their own.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/contexts/SubscriptionContext.test.tsx`
Expected: PASS.

- [ ] **Step 7: Check nothing still references the removed path**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0. Any "Property 'restartDemoTrial' does not exist" error names a consumer step 1 missed.

Run: `grep -rn "restartDemoTrial\|resetDemoTrial" --include=*.ts --include=*.tsx src`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/contexts/SubscriptionContext.tsx src/components/SettingsView.tsx src/services/subscriptionService.ts src/contexts/SubscriptionContext.test.tsx
git commit -m "feat(trial): read the access tier from the server in the context

The client could mint itself a fresh three days, and a button in the
paywall did exactly that. Both go: startTrial asks the server, which
refuses an account that already holds any entitlement row.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Lock enforcement at all three points

**Files:**
- Modify: `src/components/AuthGuard.tsx`
- Modify: `src/components/AssessmentSelector.tsx`
- Test: `src/components/AssessmentSelector.lock.test.tsx`

**Interfaces:**
- Consumes: `canOpenAssessment` and `isVisibleInTrial` from Task 1; `tier` from Task 2.
- Produces: nothing new.

`AuthGuard` gains the trial: it currently admits `isPremium || demoTrialActive`, which would shut a trial user out of the 20 they are entitled to.

The three points in the selector, all in one component:

| # | Location | Why it is needed |
|---|---|---|
| 1 | `openAssessment` (~line 425) | Every tile click and the psychosis Previous/Next chain go through it |
| 2 | the `if (selectedAssessment)` branch (line 493) | A deep link sets the state at line 407 without passing through `openAssessment` |
| 3 | `renderTile` (line 965) | So the free set is legible before anyone clicks |

- [ ] **Step 1: Admit a trial in AuthGuard**

In `src/components/AuthGuard.tsx`, add `tier` and `checkingServerAccess` to the `useSubscription()` destructure, and settle before deciding:

```ts
  // A trial is access, just not to everything: without this a trial user is shut
  // out of the very assessments their trial is for. What each tier may open is
  // decided per assessment, in the selector.
  const hasAccess = isPremium || demoTrialActive || tier !== 'none';

  // Do not decide, or flash the paywall, before the first tier read settles.
  if (checkingServerAccess && !isPremium && !demoTrialActive) {
    return <div className="fixed inset-0 z-[100] bg-background" aria-busy="true" />;
  }
```

Place the settle check above the existing `hasAccess` render and leave `PUBLIC_PATHS` and the rest of the component as they are.

- [ ] **Step 2: Write the failing test**

Create `src/components/AssessmentSelector.lock.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { canOpenAssessment } from '@/config/trialScope';
import { assessments } from './AssessmentSelector';

const byKey = (key: string) => assessments.find((a) => a.key === key)!;

describe('assessment lock', () => {
  it('gives a full tier everything', () => {
    expect(canOpenAssessment(byKey('hamd').key, 'full')).toBe(true);
    expect(canOpenAssessment(byKey('triage').key, 'full')).toBe(true);
  });

  it('gives a trial only the section', () => {
    expect(canOpenAssessment(byKey('triage').key, 'trial')).toBe(true);
    expect(canOpenAssessment(byKey('moca').key, 'trial')).toBe(true);
    expect(canOpenAssessment(byKey('hamd').key, 'trial')).toBe(false);
    expect(canOpenAssessment(byKey('delusions').key, 'trial')).toBe(false);
  });

  it('covers every registry key without throwing', () => {
    for (const a of assessments) {
      expect(typeof canOpenAssessment(a.key, 'trial')).toBe('boolean');
    }
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/AssessmentSelector.lock.test.tsx`
Expected: PASS once Task 1 is done. This file pins the rule without rendering the component, so a failure in step 6's browser check is unambiguously a wiring mistake rather than a rule mistake.

- [ ] **Step 4: Wire the three points**

In `src/components/AssessmentSelector.tsx`, add the import and take `tier` from the context:

```ts
import { canOpenAssessment } from '@/config/trialScope';
```

In the existing `const { subscription, setShowPaywall, premiumSource } = useSubscription();` at line 366, add `tier` to the destructure.

**Point 1 — `openAssessment`** (currently ~line 425):

```ts
  const openAssessment = (key: AssessmentKey) => {
    if (!canOpenAssessment(key, tier)) {
      setShowPaywall(true);
      return;
    }
    setLanguage('en');
    setSelectedAssessment(key);
    navigate(`/assessment/${key}`, { replace: false });
    window.scrollTo(0, 0);
  };
```

**Point 2 — the render branch.** Replace the condition at line 493. Currently `if (selectedAssessment) {`:

```ts
  const selectedLocked = !!selectedAssessment && !canOpenAssessment(selectedAssessment, tier);

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
                      const locked = !canOpenAssessment(a.key, tier);
```

Then render a badge after the subtitle `<p>` in the tile:

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

- [ ] **Step 5: Typecheck and run the suite**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exit 0.

Run: `npx vitest run`
Expected: PASS, everything green.

- [ ] **Step 6: Verify by hand, in a browser**

Run: `npm run dev`

1. Sign in with an account that has no entitlement, start the trial from the paywall.
2. Expected: the home list shows a **Pro** badge on the 76 locked tiles and none on the 20 free ones.
3. Click `triage`. Expected: it opens.
4. Click `HAM-D`. Expected: the paywall, not the assessment.
5. Navigate directly to `/assessment/hamd`. Expected: the locked screen reading "This assessment is part of Cognito Pro", **not** the assessment. This is Review Focus item 1 and the one most likely to have been missed.
6. Sign out. Expected: the paywall covers everything.

- [ ] **Step 7: Commit**

```bash
git add src/components/AuthGuard.tsx src/components/AssessmentSelector.tsx src/components/AssessmentSelector.lock.test.tsx
git commit -m "feat(trial): lock the assessments a trial does not cover

Enforced at all three points that can reach an assessment, including the
deep-link render branch, which bypasses the click handler entirely. The
guard admits a trial, since a trial is access to the section.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: The paywall's trial entry, and the close button that does nothing

**Files:**
- Modify: `src/components/PaywallModal.tsx`
- Modify: `src/components/AuthGuard.tsx`
- Test: `src/components/PaywallModal.trial.test.tsx`

**Interfaces:**
- Consumes: `startTrial` from Task 2; `requestEmailCode`, `verifyEmailCode` from `@/lib/entitlement`.
- Produces: `PaywallModalProps.onClose` becomes **optional**; a close button renders only when it is provided.

**The dead control:** `AuthGuard` renders the blocking paywall with `onClose={() => {}}`, and the modal renders an X wired to it (`PaywallModal.tsx:320`). It looks dismissable and is not. Making `onClose` optional removes the control rather than leaving it to lie.

- [ ] **Step 1: Write the failing test**

Create `src/components/PaywallModal.trial.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

const ent = vi.hoisted(() => ({
  requestEmailCode: vi.fn(),
  verifyEmailCode: vi.fn(),
}));
vi.mock('@/lib/entitlement', () => ent);
vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  requestRestoreCode: vi.fn().mockResolvedValue(null),
  verifyRestoreCode: vi.fn(),
}));
vi.mock('@/lib/appbuild/wrapper', () => ({ waitForWrapper: () => Promise.resolve(null) }));

const sub = vi.hoisted(() => ({
  startTrial: vi.fn(),
  refreshSubscription: vi.fn(),
  demoTrialActive: false,
  demoTrialMsLeft: 0,
}));
vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({ ...sub, setShowPaywall: vi.fn() }),
}));
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
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: true });
    sub.startTrial.mockResolvedValue('trial');
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
    ent.requestEmailCode.mockResolvedValue({ ok: true });
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

  it('reports an already-used trial rather than appearing to succeed', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: true });
    // The server refuses a second trial for an account that holds any row.
    sub.startTrial.mockResolvedValue('none');
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Start my trial'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/already/i);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/PaywallModal.trial.test.tsx`
Expected: FAIL — there is no "Start 3-day trial" control.

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

Reuse the existing email-code machinery rather than duplicating it. `PaywallModal.tsx` already has `type RestoreStep = 'closed' | 'email' | 'code'` and the `requestRestoreCode` / `verifyRestoreCode` pair; the trial runs the same two steps with a different second action.

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

      // The server decides whether a trial may start. `none` means this account
      // already holds an entitlement row — a spent trial included — so it is a
      // refusal to report, not a failure to retry.
      const next = await startTrial();
      if (next === 'none') {
        throw new Error('A trial has already been used on this account.');
      }

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

Add `requestEmailCode` and `verifyEmailCode` to the `@/lib/entitlement` import, and `startTrial` to the `useSubscription()` destructure.

Render the entry point near the demo link. When `trialStep === 'closed'`, the button; otherwise the two-step form:

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
                    <p role="alert" className="text-sm text-destructive">
                      {trialError}
                    </p>
                  )}
                  <Button
                    className="min-h-[44px] w-full"
                    disabled={startingTrial}
                    onClick={() =>
                      void (trialStep === 'email' ? handleTrialEmail() : handleTrialVerify())
                    }
                  >
                    {trialStep === 'email' ? 'Email me a code' : 'Start my trial'}
                  </Button>
                </div>
              )}
```

- [ ] **Step 5: Remove the demo-restart control**

At `PaywallModal.tsx:418` the demo link calls `restartDemoTrial()`. Delete that call and the control around it, along with `restartDemoTrial` from the destructure at line 93 and the `demoTrialActive ? ... : ...` label at lines 424–425 that advertised the restart.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/PaywallModal.trial.test.tsx`
Expected: PASS, 5 tests.

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
email-code machinery and reports the server's refusal when a trial has
already been used.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Operator prerequisites

Both must hold before Task 3's browser check, and before this branch ships.

1. **Apply the trial migration.** `supabase/migrations/20261008130000_trial.sql` creates `entitlement_tier()` and `start_trial()`. Claude cannot reach the project; run it in the Supabase SQL editor.
2. **Enable email one-time codes.** The trial entry in Task 4 depends on it. Confirm under Authentication → Providers → Email that OTP is on and the code template is set.

Verify the functions exist and are reachable:

```sql
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name IN ('entitlement_tier', 'start_trial');
```

Expected: two rows, `entitlement_tier` as `INVOKER` and `start_trial` as `DEFINER`.

## End-to-end acceptance

Run after all four tasks, on the PWA in a browser.

1. **No account.** The paywall covers everything; there is no way to reach an assessment without signing in. Start the trial → email → code.
2. **During the trial.** The 20 flagged tiles open; the other 76 show **Pro** and open the paywall. `/assessment/hamd` typed directly shows the locked screen.
3. **Restart attempt.** Clear storage, reload, sign in again. The trial does **not** restart: `start_trial()` finds an existing row, writes nothing, and returns the tier the account already has. With the trial expired, that tier is `none` and the paywall's trial button reports that a trial has already been used.
4. **After three days.** The row's `expires_at` passes, `entitlement_tier()` returns `none`, and the paywall covers everything including the 20. Confirm without waiting:

   ```sql
   UPDATE public.entitlements SET expires_at = now() - interval '1 minute'
   WHERE user_id = '<the test user id>';
   ```
5. **The owner.** The developer grant is a row with `source = 'admin'`, so `entitlement_tier()` returns `full` and all 96 open.

## Open interface for the foundation plan

Raised at this revision, not resolved here.

The foundation plan suppresses an admin grant inside the native App Store build, so the owner exercises real IAP rather than seeing their own comp. `entitlement_tier()` collapses `source` into a tier — it returns `'full'` for an admin row and for a Razorpay row alike — so the client can no longer tell them apart, and that suppression cannot be expressed on top of it.

Two ways out, to be chosen when the foundation plan is revised:

- add a companion RPC exposing the source, or widen `entitlement_tier()` to return it alongside the tier; or
- fold the suppression server-side, so a request from the wrapper never sees an `admin` row.

Until one is chosen, the native build treats an admin comp as full access. That is the pre-existing behaviour, so this plan does not regress it — but the foundation plan's Task 2 cannot ship as written.
