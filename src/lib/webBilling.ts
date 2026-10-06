// Web billing helpers. Web checkout has been removed; restore access now only
// recognises whitelisted developer emails (see DEVELOPER_EMAILS below).

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

// Developer / tester emails with permanent full access. Keep personal
// addresses out of this file — configure them in .env.local instead:
//   VITE_DEVELOPER_EMAILS=you@example.com,teammate@example.com
// (.env.local is gitignored, so the list never reaches the public repo.)
const DEVELOPER_EMAILS_ENV = (import.meta.env.VITE_DEVELOPER_EMAILS as string | undefined) ?? '';

/** All emails that unlock permanent developer access, normalised to lowercase. */
export const DEVELOPER_EMAILS: string[] = DEVELOPER_EMAILS_ENV.split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export const isDeveloperEmail = (email: string): boolean => {
  if (!email) return false;
  return DEVELOPER_EMAILS.includes(email.trim().toLowerCase());
};

const STORE_KEY = 'psycognito.webPremium.v1';

export interface WebPremium {
  email: string;
  plan: 'monthly' | 'yearly';
  currentPeriodEnd: string;
}

export const getWebPremium = (): WebPremium | null => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WebPremium;
    if (!parsed?.currentPeriodEnd) return null;
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
 * Web purchase restore. Recognises whitelisted developer emails and grants
 * them a long-lived (100-year) entitlement on this device. Everyone else gets
 * "no purchase found" — web checkout no longer exists.
 */
export async function restoreWebPurchase(email: string): Promise<WebPremium | null> {
  const normalized = email.trim().toLowerCase();
  if (!isDeveloperEmail(normalized)) return null;

  const devAccess: WebPremium = {
    email: normalized,
    plan: 'yearly',
    // 100 years — lifetime for any practical purpose.
    currentPeriodEnd: new Date(Date.now() + 100 * 365 * 86400 * 1000).toISOString(),
  };
  saveWebPremium(devAccess);
  return devAccess;
}
