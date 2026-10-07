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

/**
 * Web checkout has been removed. Kept as a typed no-op so callers compile;
 * it always reports that the purchase flow is unavailable.
 */
export async function startWebCheckout(
  _plan: 'monthly' | 'yearly',
  _email: string,
  _currency: WebCurrency = getWebCurrency(),
): Promise<WebPremium> {
  throw new Error('Web checkout is no longer available.');
}

/**
 * Web purchase restore. Web checkout no longer exists, so this reports
 * "no purchase found" (null). Dev builds only: a whitelisted developer email
 * unlocks this device with a long-lived entitlement marked `source: 'dev'`.
 */
export async function restoreWebPurchase(email: string): Promise<WebPremium | null> {
  if (import.meta.env.DEV) {
    const normalized = email.trim().toLowerCase();
    if (isDeveloperEmail(normalized)) {
      const devAccess: WebPremium = {
        email: normalized,
        plan: 'yearly',
        // 100 years — lifetime for any practical purpose.
        currentPeriodEnd: new Date(Date.now() + 100 * 365 * 86400 * 1000).toISOString(),
        source: 'dev',
      };
      saveWebPremium(devAccess);
      return devAccess;
    }
  }
  return null;
}
