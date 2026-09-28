// Web billing helpers. The sign-in / web-checkout flow has been removed, so
// the Supabase-backed checkout and restore functions are gone. What remains
// are the pure price/locale helpers used by the UI.

export const WEB_PRICES = {
  INR: {
    monthly: { amount: 24900, display: '₹249' },
    yearly: { amount: 199900, display: '₹1,999' },
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

/** Web purchase restore has been removed. Always reports no purchase. */
export async function restoreWebPurchase(_email: string): Promise<WebPremium | null> {
  return null;
}

// Referenced by saveWebPremium's callers once checkout existed; retained to
// avoid an unused-symbol lint error if the flow returns.
void saveWebPremium;
