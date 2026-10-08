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

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { shouldCreateUser: true },
  });

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

  const { error } = await supabase.auth.verifyOtp({
    email: normalized,
    token,
    type: 'email',
  });

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
 * `has_premium` is not in the generated `Database` types until the entitlements
 * migration is applied and the types are regenerated with
 * `supabase gen types typescript`. The cast is confined to this one call so the
 * rest of the module stays typed; delete it once the types catch up.
 */
const callHasPremium = supabase.rpc as unknown as (
  fn: 'has_premium',
) => Promise<{ data: boolean | null; error: { message: string } | null }>;

/**
 * The access decision, asked of the backend.
 *
 * Fails closed: an unreachable backend, an expired code or a signed-out user all
 * mean "no premium". Nothing about this device, its cache or its clock can turn
 * that into a yes.
 */
export async function hasPremium(): Promise<boolean> {
  const { data, error } = await callHasPremium('has_premium');
  if (error) return false;
  return data === true;
}

/** Run `onChange` whenever the session changes; returns an unsubscribe function. */
export function onAuthChange(onChange: () => void): () => void {
  const { data } = supabase.auth.onAuthStateChange(() => onChange());
  return () => data.subscription.unsubscribe();
}
