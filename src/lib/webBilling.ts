import { supabase } from '@/integrations/supabase/client';

export type Region = 'IN' | 'GLOBAL';

export interface PriceInfo {
  amount: number; // smallest currency unit (paise / cents)
  display: string;
  currency: 'INR' | 'USD';
  symbol: string;
}

const INR_PRICES: Record<'monthly' | 'yearly', PriceInfo> = {
  monthly: { amount: 24900, display: '₹249', currency: 'INR', symbol: '₹' },
  yearly: { amount: 199900, display: '₹1,999', currency: 'INR', symbol: '₹' },
};

const USD_PRICES: Record<'monthly' | 'yearly', PriceInfo> = {
  monthly: { amount: 299, display: '$2.99', currency: 'USD', symbol: '$' },
  yearly: { amount: 2499, display: '$24.99', currency: 'USD', symbol: '$' },
};

/** Detect India region from browser timezone and/or locale. */
export function getUserRegion(): Region {
  if (typeof window === 'undefined') return 'GLOBAL';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language || '';
    if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') return 'IN';
    if (/^(en|hi|ml|ta|te|kn|bn|gu|mr|pa|ur)-IN$/i.test(lang)) return 'IN';
  } catch {
    /* ignore */
  }
  return 'GLOBAL';
}

/** Return regional prices: INR for India, USD for the rest of the world. */
export function getRegionalPrices(region: Region = getUserRegion()): Record<'monthly' | 'yearly', PriceInfo> {
  return region === 'IN' ? INR_PRICES : USD_PRICES;
}

/** Legacy constant kept for compatibility — defaults to INR. Prefer getRegionalPrices(). */
export const WEB_PRICES = INR_PRICES;

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

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/** Open Razorpay checkout for a plan and verify the payment server-side. */
export async function startWebCheckout(plan: 'monthly' | 'yearly', email: string): Promise<WebPremium> {
  const ok = await loadRazorpayScript();
  if (!ok) throw new Error('Could not load the payment window. Check your connection.');

  const region = getUserRegion();
  const prices = getRegionalPrices(region);
  const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
    body: { plan, email, region, currency: prices[plan].currency },
  });
  if (error || data?.error) throw new Error(data?.error ?? 'Could not start checkout.');

  const result = await new Promise<any>((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'PsyCognito',
      description: data.label,
      order_id: data.orderId,
      prefill: { email },
      theme: { color: '#6366f1' },
      modal: { ondismiss: () => reject(Object.assign(new Error('Payment cancelled.'), { userCancelled: true })) },
      handler: (res: any) => resolve(res),
    });
    rzp.on('payment.failed', (res: any) =>
      reject(new Error(res?.error?.description ?? 'Payment failed.')),
    );
    rzp.open();
  });

  const verify = await supabase.functions.invoke('razorpay-verify', {
    body: {
      orderId: result.razorpay_order_id,
      paymentId: result.razorpay_payment_id,
      signature: result.razorpay_signature,
    },
  });
  if (verify.error || verify.data?.error) {
    throw new Error(verify.data?.error ?? 'Payment could not be verified.');
  }

  const premium: WebPremium = {
    email,
    plan: verify.data.plan,
    currentPeriodEnd: verify.data.currentPeriodEnd,
  };
  saveWebPremium(premium);
  return premium;
}

/** Look up an existing website purchase by email and restore access on this device. */
export async function restoreWebPurchase(email: string): Promise<WebPremium | null> {
  const { data, error } = await supabase.functions.invoke('razorpay-status', { body: { email } });
  if (error || data?.error) throw new Error(data?.error ?? 'Could not check your purchase.');
  if (!data.active) return null;
  const premium: WebPremium = { email, plan: data.plan, currentPeriodEnd: data.currentPeriodEnd };
  saveWebPremium(premium);
  return premium;
}
