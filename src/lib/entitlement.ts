/**
 * Server-decided entitlement.
 *
 * Access is never decided in the browser: `hasPremium()` asks the backend, and
 * the backend answers from the `entitlements` table, where `expires_at IS NULL`
 * means permanent. Nothing in this module reads or writes localStorage, and
 * nothing in it can grant access — the only writer of `entitlements` is the
 * service role.
 *
 * Identity is a Supabase email one-time code. Verifying the code produces a real
 * `auth.users` row with a real UUID, which is what the developer grant has to
 * key to. An email string on its own proves nothing and is never used as a key.
 */
import { supabase } from '@/integrations/supabase/client';
import { isNativeApp } from '@/lib/appbuild/revenuecat';

export interface AuthResult {
  ok: boolean;
  message?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Email a one-time code. Creates the auth user on first use. */
export async function requestEmailCode(email: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }

  // Bounded like the grant reads: these two gate a form whose submit button is
  // disabled while they are outstanding, so an unanswered request would leave
  // the trial unreachable without a reload.
  const { error } = await withTimeout<{ error: { message: string } | null }>(
    supabase.auth.signInWithOtp({
      email: normalized,
      options: { shouldCreateUser: true },
    }),
    { error: { message: 'The code request timed out. Please try again.' } },
  );

  return error ? { ok: false, message: error.message } : { ok: true };
}

/**
 * Exchange the emailed code for a session. This is the proof of ownership: it is
 * the only step that can turn an email address into an authenticated identity.
 */
export async function verifyEmailCode(email: string, code: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  const token = code.trim();
  if (!token) {
    return { ok: false, message: 'Enter the code from your email.' };
  }

  const { error } = await withTimeout<{ error: { message: string } | null }>(
    supabase.auth.verifyOtp({
      email: normalized,
      token,
      type: 'email',
    }),
    { error: { message: 'The code check timed out. Please try again.' } },
  );

  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export interface AuthUser {
  /** The auth.users id. This — not the email — is what an entitlement keys to. */
  id: string;
  email: string | null;
}

export type EntitlementPlan = 'developer' | 'monthly' | 'yearly' | 'demo';
export type EntitlementSource = 'admin' | 'razorpay' | 'trial' | 'demo';

export interface Entitlement {
  plan: EntitlementPlan;
  source: EntitlementSource;
  expiresAt: string | null;
  /** true when expires_at IS NULL, i.e. the grant never lapses. */
  permanent: boolean;
}

/**
 * The signed-in identity, or null.
 *
 * The id is returned deliberately: when access has not been granted, the id is
 * the one thing an administrator needs in order to grant it, and it can only be
 * read from a real session.
 */
export async function currentAuthUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  return user ? { id: user.id, email: user.email ?? null } : null;
}

/**
 * None of these functions are in the generated `Database` types until the
 * migrations are applied and the types are regenerated with
 * `supabase gen types typescript`. The cast is confined to this one call so the
 * rest of the module stays typed; delete it once the types catch up.
 */
const callRpc = supabase.rpc as unknown as (
  fn: string,
) => Promise<{ data: unknown; error: { message: string } | null }>;

/** A row as PostgREST returns it: snake_case, and strings for the TEXT columns. */
interface EntitlementRow {
  plan: string;
  source: string;
  expires_at: string | null;
  permanent: boolean;
}

/**
 * `current_entitlement` returns a set, so the payload is an array of rows —
 * PostgREST does not unwrap it. Anything that is not an array means no rows.
 */
const asEntitlementRows = (data: unknown): EntitlementRow[] =>
  Array.isArray(data) ? (data as EntitlementRow[]) : [];

/** How long a grant read may take before it counts as failed. */
const RPC_TIMEOUT_MS = 5000;

/**
 * A hung request is a failed request. Bound it so the gate can always clear.
 *
 * A rejection is caught here rather than only at the call site: `Promise.race`
 * settles with whichever comes first, including a rejection, so without this a
 * backend that answers with an error would reject the caller instead of closing
 * the gate.
 */
async function withTimeout<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), RPC_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return fallback;
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
  const { data, error } = await withTimeout(callRpc('current_entitlement'), {
    data: null,
    error: { message: 'timed out' },
  });
  if (error) return null;

  const row = asEntitlementRows(data)[0];
  if (!row) return null;

  return {
    plan: row.plan as EntitlementPlan,
    source: row.source as EntitlementSource,
    expiresAt: row.expires_at ?? null,
    permanent: row.permanent === true,
  };
}

/**
 * The caller's grant *as this device may honour it*, or null.
 *
 * Same rule as `serverPremium()`, but it keeps the grant's `source` visible.
 * That matters: the trial is a grant too, and downstream code has to be able to
 * tell a three-day trial apart from a paid plan.
 */
export async function serverEntitlement(): Promise<Entitlement | null> {
  const ent = await currentEntitlement();
  if (!ent) return null;
  if (ent.source === 'admin' && (await isNativeApp())) return null;
  return ent;
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
  return (await serverEntitlement()) !== null;
}

/**
 * The access decision, asked of the backend.
 *
 * Fails closed: an unreachable backend, an expired code or a signed-out user all
 * mean "no premium". Nothing about this device, its cache or its clock can turn
 * that into a yes.
 */
export async function hasPremium(): Promise<boolean> {
  const { data, error } = await callRpc('has_premium');
  if (error) return false;
  return data === true;
}

/**
 * The access tier the backend reports.
 *
 * `full` is a paid or developer entitlement — everything. `trial` is the one
 * 3-day trial, which unlocks only what `src/config/trialScope.ts` lists.
 * `none` is the paywall. Same fail-closed rule as above.
 */
export type EntitlementTier = 'none' | 'trial' | 'full';

/**
 * The tier a grant represents. Pure, and exported, so the context can derive a
 * tier from the grant it already holds instead of making a second round trip —
 * and so there is one derivation rather than two that could drift.
 */
export const tierOf = (ent: Entitlement | null): EntitlementTier =>
  !ent ? 'none' : ent.source === 'trial' || ent.source === 'demo' ? 'trial' : 'full';

/**
 * The access tier, derived from the same grant `serverPremium()` reads.
 *
 * Derived, not asked separately: `entitlement_tier()` collapses `source`, so it
 * cannot tell an admin comp from a paid plan, and the native suppression above
 * has to apply to the trial path as well as the paid one.
 */
export async function entitlementTier(): Promise<EntitlementTier> {
  return tierOf(await serverEntitlement());
}

/**
 * Start this account's one 3-day trial.
 *
 * The backend owns the decision: if the account already holds any entitlement
 * row, nothing is written and the tier it already has comes back. The expiry is
 * the database's `now() + 3 days`, so the device clock has no say in it.
 */
export async function startTrial(): Promise<EntitlementTier> {
  // Bounded like the reads above: an outstanding call must not outlive the
  // paywall's patience, or the spinner stays up with no way back.
  const { error } = await withTimeout(callRpc('start_trial'), {
    data: null,
    error: { message: 'The trial service could not be reached. Please try again.' },
  });
  // A failed call is not a refusal. Returning 'none' here would tell the user
  // their trial was already used when the function is missing, the session is
  // stale or the request never landed — which is the operator's state while the
  // migrations are unapplied. Only an answer that arrived may mean 'none'.
  if (error) throw new Error(error.message);
  // Re-derive rather than trusting the returned string: a developer account in
  // the native build would otherwise be told its trial started while the gate
  // still refuses it.
  return entitlementTier();
}

/** Run `onChange` whenever the session changes; returns an unsubscribe function. */
export function onAuthChange(onChange: () => void): () => void {
  const { data } = supabase.auth.onAuthStateChange(() => onChange());
  return () => data.subscription.unsubscribe();
}
