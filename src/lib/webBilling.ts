import { supabase } from '@/integrations/supabase/client';

export const WEB_PRICES = {
  monthly: { amount: 24900, display: '₹249' },
  yearly: { amount: 199900, display: '₹1,999' },
} as const;

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

  const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
    body: { plan, email },
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
