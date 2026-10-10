import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cancelSubscription, fallbackBillingPlans, fetchBillingPlans, type BillingPlan } from '@/lib/billing';
import { getWebCurrency } from '@/lib/webBilling';
import {
  currentAuthUser,
  onAuthChange,
  requestEmailCode,
  serverEntitlement,
  verifyEmailCode,
  type AuthUser,
  type Entitlement,
} from '@/lib/entitlement';

const formatAmount = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  } catch {
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
    <div className="mx-auto max-w-md space-y-6">{children}</div>
  </main>
);

const Card = ({ children }: { children: ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card p-5 space-y-3">{children}</section>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
  </div>
);

export const Account = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>(() => fallbackBillingPlans());
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const who = await currentAuthUser();
      setUser(who);
      setEntitlement(who ? await serverEntitlement() : null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    let active = true;
    fetchBillingPlans().then((next) => {
      if (!active || !next.length) return;
      setPlans((prev) => {
        const merged = new Map(prev.map((p) => [`${p.code}:${p.currency}`, p]));
        for (const p of next) merged.set(`${p.code}:${p.currency}`, p);
        return Array.from(merged.values());
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const catalogue = useMemo(
    () => plans.find((p) => p.code === entitlement?.plan && p.currency === getWebCurrency()),
    [plans, entitlement],
  );

  const sendCode = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await requestEmailCode(email);
      if (!result.ok) throw new Error(result.message ?? 'Could not send a code.');
      setStep('code');
      toast.success(`We emailed a code to ${email.trim().toLowerCase()}.`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not send a code.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setError(null);
    setBusy(true);
    try {
      const result = await verifyEmailCode(email, code);
      if (!result.ok) throw new Error(result.message ?? 'That code was not accepted.');
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not verify the code.');
    } finally {
      setBusy(false);
    }
  };

  const onCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      toast.success('Cancellation requested. Access runs to the end of the period you paid for.');
      await refresh();
    } catch (e: unknown) {
      // Never "your subscription failed" — the request did not go through.
      setError(e instanceof Error ? e.message : 'Could not cancel the subscription.');
    } finally {
      setCancelling(false);
    }
  };

  if (checking) {
    return (
      <Shell>
        <div className="flex justify-center py-16">
          <Loader2 role="status" aria-label="Loading your account" className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-foreground">Your account</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your email. There is no password — we send you a code. Signing in for the
          first time creates the account.
        </p>
        <Card>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (busy) return;
              if (step === 'email') void sendCode();
              else void verify();
            }}
          >
            {step === 'email' ? (
              <div className="space-y-1.5">
                <label htmlFor="account-email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="account-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="account-code" className="block text-sm font-medium text-foreground">
                  Code from your email
                </label>
                <input
                  id="account-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground"
                />
              </div>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full min-h-[44px]">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 'email' ? 'Email me a code' : 'Verify'}
            </Button>
          </form>
        </Card>
        <Link to="/" className="text-sm text-primary underline underline-offset-4">
          Back to the app
        </Link>
      </Shell>
    );
  }

  const renewal = entitlement?.expiresAt ? formatDate(entitlement.expiresAt) : null;
  const amount = catalogue ? formatAmount(catalogue.amount, catalogue.currency) : null;
  const paid = entitlement?.source === 'razorpay';

  return (
    <Shell>
      <h1 className="text-2xl font-bold text-foreground">Your account</h1>

      <Card>
        <h2 className="text-sm font-semibold text-foreground">Plan</h2>
        <dl className="space-y-2">
          <Row label="Plan" value={entitlement?.plan ?? 'Free'} />
          <Row label="Source" value={entitlement?.source ?? 'none'} />
          {renewal && <Row label="Renews on" value={renewal} />}
          {paid && amount && <Row label="Amount" value={amount} />}
        </dl>
        {paid && (
          <Button
            variant="outline"
            className="min-h-[44px]"
            disabled={cancelling}
            onClick={() => void onCancel()}
          >
            {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel subscription
          </Button>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-foreground">Your account id</h2>
        <dl className="space-y-2">
          <Row label="Auth user id" value={user.id} />
        </dl>
        <p className="text-xs text-muted-foreground">
          Developer access is granted to this id by an administrator.
        </p>
      </Card>

      <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4">
        <Check className="h-4 w-4" />
        Back to the app
      </Link>
    </Shell>
  );
};

export default Account;
