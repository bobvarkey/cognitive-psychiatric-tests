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

/** The webhook may land after the redirect; re-read at this spacing. */
export const SUCCESS_POLL_INTERVAL_MS = 2000;
/** Stop waiting here and say so, per the spec's bound. */
export const SUCCESS_POLL_BOUND_MS = 30000;

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
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    let poll: ReturnType<typeof setInterval> | undefined;
    /** When this receipt mounted. The bound is measured from here, not a read. */
    const startedAt = Date.now();

    const stopPolling = () => {
      if (poll !== undefined) {
        clearInterval(poll);
        poll = undefined;
      }
    };

    /** Read the receipt's row and the caller's grant. True when a grant landed. */
    const read = async (): Promise<boolean> => {
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
      if (!active) return false;
      setRecord((data as SubscriptionRow | null) ?? null);
      setEntitlement(grant);
      setAsked(true);
      setLoading(false);
      return grant !== null;
    };

    // The webhook may land after the redirect, so the receipt re-reads on its
    // own — not only on `focus`. A buyer who never blurs this tab would
    // otherwise wait on "Activating" with no bound ever reached and no way on.
    const tick = async () => {
      if (!active) return;
      if (Date.now() - startedAt >= SUCCESS_POLL_BOUND_MS) {
        stopPolling();
        setTimedOut(true);
        return;
      }
      try {
        if (await read()) stopPolling();
      } catch {
        // A failed poll is "not yet known", not "no": keep waiting for the bound.
      }
    };

    poll = setInterval(() => {
      void tick();
    }, SUCCESS_POLL_INTERVAL_MS);

    void read()
      .then((granted) => {
        if (granted) stopPolling();
      })
      .catch(() => {
        // A rejected read — the query chain, or the dynamic import itself — must
        // still leave the checking state, and must not leave a poll running.
        // Otherwise a paying user is stranded on "Checking your payment…" forever.
        stopPolling();
        if (active) {
          setAsked(true);
          setLoading(false);
        }
      });

    // A bonus path, not the mechanism: a buyer who switches apps and comes back
    // sees the truth immediately instead of waiting for the next interval.
    const onFocus = () => void read().catch(() => {});
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      stopPolling();
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
            : timedOut
              // Never "your payment failed": a webhook that has not landed is not
              // a failed payment, and saying so to a buyer who paid is worse than
              // saying it is still on its way.
              ? 'Activation has not reached us yet. This can take longer than usual — check your account for the latest status.'
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
      {!hasAccess && (
        <Link
          to="/account"
          className="mt-4 block text-center text-sm text-primary underline underline-offset-4"
        >
          Check your account
        </Link>
      )}
    </Shell>
  );
};

export default CheckoutSuccess;
