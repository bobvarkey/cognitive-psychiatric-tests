// Web billing helpers: Razorpay website checkout plus "Restore access".
// Restore requires proof of email ownership: the user receives a one-time
// code (Supabase email OTP), verifies it, and only then is the purchase looked
// up server-side for the *verified* email (razorpay-status checks the JWT).
// In local development only (`vite` dev server, import.meta.env.DEV === true)
// restore can also unlock a device for whitelisted developer emails without a
// code — see DEVELOPER_EMAILS below.

export const WEB_PRICES = {
  INR: {
    monthly: { amount: 24900, display: '₹249' },
    yearly: { amount: 299000, display: '₹2,999' },
  },
  USD: {
    monthly: { amount: 299, display: '$2.99' },
    yearly: { amount: 2499, display: '$24.99' },
  },
} as const;

export type WebCurrency = keyof typeof WEB_PRICES;

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

/** Website checkout via Razorpay (browser only; native app uses the store). */
export async function startWebCheckout(
  plan: 'monthly' | 'yearly',
  email: string,
  currency: WebCurrency = getWebCurrency(),
): Promise<WebPremium> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
    body: { plan, email, currency },
  });
  if (error || !data?.orderId) throw new Error(data?.error ?? 'Could not start checkout.');
  const Razorpay = await loadRazorpay();
  return new Promise<WebPremium>((resolve, reject) => {
    const rzp = new Razorpay({
      key: data.keyId,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: 'PsyCognito',
      description: data.label,
      prefill: { email },
      handler: async (resp: any) => {
        const { data: v, error: vErr } = await supabase.functions.invoke('razorpay-verify', {
          body: { orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature },
        });
        if (vErr || !v?.success) return reject(new Error(v?.error ?? 'Payment could not be verified.'));
        const value: WebPremium = { email, plan: v.plan, currentPeriodEnd: v.currentPeriodEnd };
        saveWebPremium(value);
        resolve(value);
      },
      modal: { ondismiss: () => reject({ userCancelled: true }) },
    });
    rzp.on?.('payment.failed', (r: any) => reject(new Error(r?.error?.description ?? 'Payment failed.')));
    rzp.open();
  });
}

/** Restore a website purchase by email (dev builds also honour developer emails). */
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
  // The typed email is never trusted: only a verified Supabase session counts.
  return restoreWebPurchaseForSession();
}

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
 * Look up a website purchase for the currently signed-in user. The edge
 * function derives the email from the verified JWT and ignores any body.
 * Without a session nothing is requested and nothing is stored.
 */
export async function restoreWebPurchaseForSession(): Promise<WebPremium | null> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session?.access_token) return null;

    const { data, error } = await supabase.functions.invoke('razorpay-status', {
      body: {},
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error || !data?.active || !data.currentPeriodEnd) return null;

    const value: WebPremium = {
      email: String(data.email ?? session.user?.email ?? '').toLowerCase(),
      plan: data.plan === 'monthly' ? 'monthly' : 'yearly',
      currentPeriodEnd: data.currentPeriodEnd,
    };
    saveWebPremium(value);
    return value;
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
  return restoreWebPurchaseForSession();
}

/**
 * Finish a restore started on this device when the user tapped the email's
 * sign-in link instead of typing the code. No-op unless a restore is pending.
 */
export async function completeRestoreFromEmailLink(): Promise<WebPremium | null> {
  if (!isRestorePending()) return null;
  const result = await restoreWebPurchaseForSession();
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.auth.getSession();
    if (data?.session) clearRestorePending();
  } catch {
    /* ignore */
  }
  return result;
}
