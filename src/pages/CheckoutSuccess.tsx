import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

import { currentEntitlement, type Entitlement } from '@/lib/entitlement';

/** The shape of the caller's newest `subscriptions` row, under RLS. */
interface SubscriptionRow {
  plan: 'monthly' | 'yearly';
  currency: string;
  amount: number;
  status: 'created' | 'active' | 'cancelled' | 'halted' | 'completed';
  current_period_end: string | null;
}

/** Plan names for a subscription the server billed without sending a label back. */
const PLAN_NAMES: Record<SubscriptionRow['plan'], string> = {
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
 * Shown when the signed-in account has no subscription row to show. Deliberately
 * neutral: inventing a receipt for a purchase we cannot see would be worse than
 * admitting we cannot.
 */
const MissingOrder = () => (
  <Shell>
    <h1 className="text-xl font-bold text-foreground">We could not find that order</h1>
    <p className="mt-3 text-sm text-muted-foreground">
      This page shows the subscription on the account you are signed in as. If you have just paid,
      the webhook may still be landing — open the app, or sign in with the email you paid with.
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
 * The receipt for a subscription.
 *
 * It reads the server, scoped by RLS to the signed-in caller, rather than a
 * record this browser wrote. The old version matched a query-string order id
 * against `localStorage`, so a buyer who paid on one device and opened the link
 * on another was told their order could not be found — a lie about a payment
 * that had gone through.
 */
export const CheckoutSuccess = () => {
  const [record, setRecord] = useState<SubscriptionRow | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    let active = true;
    const read = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase
        // @ts-expect-error — subscriptions is missing from the generated types until
        // supabase/migrations/20261009120100_subscriptions.sql is reflected in types.ts.
        .from('subscriptions')
        .select('plan, currency, amount, status, current_period_end')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const grant = await currentEntitlement().catch(() => null);
      if (!active) return;
      setRecord((data as SubscriptionRow | null) ?? null);
      setEntitlement(grant);
      setAsked(true);
      setLoading(false);
    };
    void read().catch(() => {
      // A rejected read — the query chain, or the dynamic import itself — must
      // still leave the checking state. Otherwise a paying user is stranded on
      // "Checking your payment…" forever.
      if (active) {
        setAsked(true);
        setLoading(false);
      }
    });
    // The webhook may land a moment after the redirect. Re-read on focus so a
    // buyer who switches apps and comes back sees the truth, not a stale
    // "activating".
    const onFocus = () => void read();
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (loading) {
    return (
      <Shell>
        <p className="text-center text-sm text-muted-foreground">Checking your payment…</p>
      </Shell>
    );
  }

  if (asked && !record) return <MissingOrder />;

  const hasAccess = entitlement !== null;
  const endsOn = record?.current_period_end ? formatDate(record.current_period_end) : null;
  const paid = record ? formatAmount(record.amount, record.currency) : null;

  return (
    <Shell>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {hasAccess ? 'Subscription active' : 'Payment received'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasAccess
            ? 'Everything is unlocked on this account.'
            : 'Activating — this usually takes a few seconds. You can close this page.'}
        </p>
      </div>

      <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
        <Row label="Plan" value={record ? PLAN_NAMES[record.plan] : 'Premium'} />
        {paid && <Row label="Paid" value={paid} />}
        <Row label="Status" value={hasAccess ? 'Active now' : 'Activating'} />
        {/* "Renews on", because this is a subscription: the period end is a date
            we do rebill on, unlike the one-time orders this replaced. */}
        {endsOn && <Row label={hasAccess ? 'Renews on' : 'Access until'} value={endsOn} />}
      </dl>

      <Link
        to="/"
        className="mt-6 block rounded-full bg-primary py-4 text-center text-base font-bold text-primary-foreground"
      >
        {hasAccess ? 'Start using Pro' : 'Continue to the app'}
      </Link>
    </Shell>
  );
};

export default CheckoutSuccess;
