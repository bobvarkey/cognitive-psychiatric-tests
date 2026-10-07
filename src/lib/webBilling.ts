// Web billing helpers. Web checkout has been removed, so web restore never
// finds a purchase in production builds. In local development only
// (`vite` dev server, import.meta.env.DEV === true) restore can also unlock a
// device for whitelisted developer emails — see DEVELOPER_EMAILS below.

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
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.functions.invoke('razorpay-status', { body: { email: normalized } });
    if (data?.active && data.currentPeriodEnd) {
      const value: WebPremium = { email: normalized, plan: data.plan, currentPeriodEnd: data.currentPeriodEnd };
      saveWebPremium(value);
      return value;
    }
  } catch {
    /* treat as not found */
  }
  return null;
}
