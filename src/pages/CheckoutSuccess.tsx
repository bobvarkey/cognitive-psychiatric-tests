import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';

import { getWebPremium, type WebPremium } from '@/lib/webBilling';

/** Plan names for a purchase the server billed without sending a label back. */
const PLAN_NAMES: Record<WebPremium['plan'], string> = {
  monthly: 'Premium — Monthly',
  yearly: 'Premium — Yearly',
};

/**
 * Razorpay charges in minor units (paise, cents) and that is what gets stored,
 * so the receipt divides before formatting. Zero fraction digits keep ₹249 from
 * reading as ₹249.00; a currency with real cents still shows them.
 */
const formatAmount = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  } catch {
    // An unknown or malformed currency code should not blank the receipt.
    return `${amount / 100} ${currency}`;
  }
};

const formatDate = (iso: string): string | null => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const Shell = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-background px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))]">
    <div className="mx-auto max-w-md">{children}</div>
  </main>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 px-4 py-3">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
  </div>
);

/**
 * Shown when the URL names an order this browser has no record of, or names
 * none at all. Deliberately neutral: inventing a receipt for a purchase we
 * cannot see would be worse than admitting we cannot.
 */
const MissingOrder = () => (
  <Shell>
    <h1 className="text-xl font-bold text-foreground">We could not find that order</h1>
    <p className="mt-3 text-sm text-muted-foreground">
      This page shows a payment made in this browser. If you have just paid, the link may be
      incomplete — open the app to continue, or restore your purchase using the email you paid
      with.
    </p>
    <Link
      to="/"
      className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
    >
      Back to the app
    </Link>
  </Shell>
);

/**
 * The receipt for a website purchase. The order id in the query string is the
 * page's identity: it has to match the purchase stored by this browser, or the
 * page falls back rather than echo somebody else's order.
 */
export const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const order = params.get('order');
  const record = getWebPremium();

  if (!record || !order || record.orderId !== order) return <MissingOrder />;

  const endsOn = formatDate(record.currentPeriodEnd);
  const paid =
    typeof record.amount === 'number' && record.currency
      ? formatAmount(record.amount, record.currency)
      : null;

  return (
    <Shell>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Payment successful</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything is unlocked on this account.
        </p>
      </div>

      <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        <Row label="Plan" value={record.label ?? PLAN_NAMES[record.plan] ?? 'Premium'} />
        {/* No amount means the purchase was restored, not made here — better to
            leave the line out than to guess what was charged. */}
        {paid && <Row label="Paid" value={paid} />}
        <Row label="Status" value="Active now" />
        {/* "Access until", never "Renews": these are one-time orders, and the
            period end is a date we stop trusting, not a date we rebill on. */}
        {endsOn && <Row label="Access until" value={endsOn} />}
      </dl>

      <Link
        to="/"
        className="mt-6 block rounded-full bg-primary py-4 text-center text-base font-bold text-primary-foreground"
      >
        Start using Pro
      </Link>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Signed in as {record.email}. You can restore this purchase on another device with the same
        email.
      </p>
    </Shell>
  );
};

export default CheckoutSuccess;
