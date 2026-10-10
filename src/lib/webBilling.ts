// Web billing helpers: the price display plus "Restore access".
// Restore requires proof of email ownership: the user receives a one-time
// code (Supabase email OTP), verifies it, and only then does the server look
// the purchase up for the *verified* email (billing-restore checks the JWT).
// In local development only (`vite` dev server, import.meta.env.DEV === true)
// restore can also unlock a device for whitelisted developer emails without a
// code — see DEVELOPER_EMAILS below.

export const WEB_PRICES = {
  INR: {
    monthly: { amount: 29900, display: '₹299' },
    yearly: { amount: 299900, display: '₹2,999' },
  },
  USD: {
    monthly: { amount: 299, display: '$2.99' },
    yearly: { amount: 2499, display: '$24.99' },
  },
} as const;

export type WebCurrency = keyof typeof WEB_PRICES;

/**
 * Percentage saved by paying yearly, or null when that is not a saving.
 *
 * Derived from the amounts actually charged rather than hardcoded. In both
 * catalogues the yearly plan is cheaper than twelve monthly payments — about
 * 30% in USD and about 16% in INR. Anything under 1% is rounding noise, not a
 * discount to advertise.
 */
export const yearlySavingPercent = (monthlyAmount: number, yearlyAmount: number): number | null => {
  if (!(monthlyAmount > 0) || !(yearlyAmount > 0)) return null;
  const percent = Math.round((1 - yearlyAmount / (monthlyAmount * 12)) * 100);
  return percent >= 1 ? percent : null;
};

/** Use INR for visitors in India and USD everywhere else. */
export const getWebCurrency = (): WebCurrency => {
  try {
    const locale = new Intl.Locale(navigator.language);
    if (locale.region === 'IN') return 'INR';
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Calcutta') return 'INR';
  } catch {
    /* Fall back to USD if locale detection is unavailable. */
  }
  return 'USD';
};

/** Parse a comma-separated email list, normalised to lowercase. */
export function parseDeveloperEmails(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

// DEV-ONLY developer unlock. Configure locally (never commit):
//   VITE_DEVELOPER_EMAILS=you@example.com,teammate@example.com
// IMPORTANT: VITE_* variables are inlined into the client bundle, so this list
// is only read behind `import.meta.env.DEV`. In production builds that is the
// literal `false`, so the minifier drops the env read, the email strings and
// the unlock branch entirely: production never contains the list and typing a
// developer email there does nothing. There is no server-side ownership check,
// which is exactly why this must never ship.
export const DEVELOPER_EMAILS: readonly string[] = import.meta.env.DEV
  ? parseDeveloperEmails(import.meta.env.VITE_DEVELOPER_EMAILS as string | undefined)
  : [];

/** True only in dev builds, for an email in VITE_DEVELOPER_EMAILS. */
export const isDeveloperEmail = (email: string): boolean => {
  if (!import.meta.env.DEV) return false;
  if (!email) return false;
  return DEVELOPER_EMAILS.includes(email.trim().toLowerCase());
};

const STORE_KEY = 'psycognito.webPremium.v1';

export interface WebPremium {
  email: string;
  plan: 'monthly' | 'yearly';
  currentPeriodEnd: string;
  /** Set on entitlements created by the dev-only developer unlock. */
  source?: 'dev';
  /**
   * Receipt fields, written only by a checkout completed in this browser.
   * A restored purchase carries none of them: nothing was charged here, and the
   * order id belongs to whichever device actually paid.
   */
  orderId?: string;
  /** Charged in minor units (paise/cents), the way Razorpay reports it. */
  amount?: number;
  currency?: string;
  /** The plan name the server billed under, e.g. "PsyCognito Premium — Yearly". */
  label?: string;
}

export const getWebPremium = (): WebPremium | null => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WebPremium;
    if (!parsed?.currentPeriodEnd) return null;
    // Production ignores (but does not delete) dev-only entitlements.
    if (!import.meta.env.DEV && parsed.source === 'dev') return null;
    if (new Date(parsed.currentPeriodEnd).getTime() < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveWebPremium = (value: WebPremium) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event('psycognito:web-premium'));
  } catch {
    /* ignore */
  }
};

/**
 * Resolve the DEV-only developer unlock for `email`, or return null.
 *
 * This used to fall through to a session lookup that read the paid
 * `web_subscriptions` table. That is `billing-restore`'s job now, and the
 * context reads the result through `current_entitlement()`, so there is nothing
 * left for this to restore. Narrowing it here is what keeps the six pinned
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
 * read and the email strings together, which is what six tests in
 * `webBilling.test.ts` exist to prove.
 */
export const isDevUnlocked = (): boolean => {
  if (!import.meta.env.DEV) return false;
  const record = getWebPremium();
  return record?.source === 'dev';
};

const RESTORE_PENDING_KEY = 'psycognito.restorePending.v1';
const RESTORE_PENDING_TTL_MS = 60 * 60 * 1000;

const markRestorePending = (email: string) => {
  try {
    localStorage.setItem(RESTORE_PENDING_KEY, JSON.stringify({ email, at: Date.now() }));
  } catch {
    /* ignore */
  }
};

const clearRestorePending = () => {
  try {
    localStorage.removeItem(RESTORE_PENDING_KEY);
  } catch {
    /* ignore */
  }
};

const isRestorePending = (): boolean => {
  try {
    const raw = localStorage.getItem(RESTORE_PENDING_KEY);
    if (!raw) return false;
    const { at } = JSON.parse(raw) as { at?: number };
    return typeof at === 'number' && Date.now() - at < RESTORE_PENDING_TTL_MS;
  } catch {
    return false;
  }
};

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

/**
 * Restore step 1: email a one-time code. Returns a WebPremium only for the
 * DEV-only developer unlock (no code needed); otherwise resolves to null once
 * the code is sent and throws a user-facing Error if sending fails.
 */
export async function requestRestoreCode(email: string): Promise<WebPremium | null> {
  const normalized = email.trim().toLowerCase();
  if (import.meta.env.DEV && isDeveloperEmail(normalized)) {
    return restoreWebPurchase(normalized);
  }
  const { supabase } = await import('@/integrations/supabase/client');
  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      // Website buyers paid without an account, so allow first-time sign-in.
      shouldCreateUser: true,
      // If the email template only has a magic link, it lands back here and
      // completeRestoreFromEmailLink() finishes the restore.
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : undefined,
    },
  });
  if (error) {
    throw new Error(error.message || 'Could not send the code. Please try again.');
  }
  markRestorePending(normalized);
  return null;
}

/** Restore step 2: verify the emailed code, then look up the purchase. */
export async function verifyRestoreCode(email: string, code: string): Promise<WebPremium | null> {
  const normalized = email.trim().toLowerCase();
  const token = code.replace(/\s+/g, '');
  if (!/^\d{6,10}$/.test(token)) {
    throw new Error('Enter the code from the email (digits only).');
  }
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.auth.verifyOtp({ email: normalized, token, type: 'email' });
  if (error || !data?.session) {
    throw new Error('That code is invalid or has expired. Request a new one.');
  }
  clearRestorePending();
  return restoreViaServer();
}

/**
 * Finish a restore started on this device when the user tapped the email's
 * sign-in link instead of typing the code. No-op unless a restore is pending.
 */
export async function completeRestoreFromEmailLink(): Promise<WebPremium | null> {
  if (!isRestorePending()) return null;
  const result = await restoreViaServer();
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.auth.getSession();
    if (data?.session) clearRestorePending();
  } catch {
    /* ignore */
  }
  return result;
}
