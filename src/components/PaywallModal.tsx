import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Lock, Bell, Star, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/paywall-hero.jpg';
import { waitForWrapper, isWrapperPresent, getPurchasesPlugin } from '@/lib/appbuild/wrapper';
import {
  configure,
  getOfferings,
  purchasePackage,
  restorePurchases,
  getEntitlement,
  isNativePurchasesAvailable,
  type RcPackage,
} from '@/lib/appbuild/revenuecat';
import {
  requestRestoreCode,
  verifyRestoreCode,
  getWebCurrency,
  isDeveloperEmail,
  yearlySavingPercent,
  WEB_PRICES,
  type WebPremium,
} from '@/lib/webBilling';
import { fallbackBillingPlans, fetchBillingPlans, type BillingPlan } from '@/lib/billing';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { requestEmailCode, verifyEmailCode } from '@/lib/entitlement';

interface PaywallModalProps {
  isOpen: boolean;
  /** Supplied only when the modal may be dismissed. The blocking instance omits it. */
  onClose?: () => void;
  onSelectPlan: (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => void;
  isLoading?: boolean;
}

const BENEFITS = [
  {
    icon: Lock,
    title: 'All tests',
    description: 'Unlock unlimited access to 90+ tests.',
    tone: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-400/40',
  },
  {
    icon: Bell,
    title: 'Early releases',
    description: 'Get notified when updates are available.',
    tone: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
  },
  {
    icon: Star,
    title: 'Premium support',
    description: 'For your questions and feedback.',
    tone: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const EMAIL_KEY = 'psycognito.billingEmail.v1';
const RESEND_SECONDS = 60;

type RestoreStep = 'closed' | 'email' | 'code';

/** The amount the server will charge, in minor units, formatted for display. */
const formatPlanAmount = (plan: BillingPlan | undefined): string => {
  if (!plan) return '—';
  try {
    return new Intl.NumberFormat(plan.currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: plan.currency,
      minimumFractionDigits: 0,
    }).format(plan.amount / 100);
  } catch {
    return `${plan.amount / 100} ${plan.currency}`;
  }
};

export const PaywallModal = ({ isOpen, onClose, onSelectPlan, isLoading = false }: PaywallModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [packages, setPackages] = useState<RcPackage[]>([]);
  const [busy, setBusy] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  // Website restore: email -> one-time code -> verified lookup.
  const [restoreStep, setRestoreStep] = useState<RestoreStep>('closed');
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [restoreError, setRestoreError] = useState<string | null>(null);
  // Trial entry: the same two steps as a restore, with a different second action.
  const [trialStep, setTrialStep] = useState<RestoreStep>('closed');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialCode, setTrialCode] = useState('');
  const [trialError, setTrialError] = useState<string | null>(null);
  const [startingTrial, setStartingTrial] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(EMAIL_KEY) ?? '';
    } catch {
      return '';
    }
  });
  // True while a web checkout this modal started is still in flight, so the
  // post-checkout message can tell "we just checked out" from "we opened".
  const submittedRef = useRef(false);
  const { refreshSubscription, startTrial, startSubscriptionCheckout, pendingActivation, isPremium } =
    useSubscription();

  // Fail closed: if the native wrapper is present at all, start in native mode so
  // Razorpay/web checkout can never flash inside the App Store / Play Store app.
  // Only fall back to web once the wrapper proves to be absent (plain browser).
  const [native, setNative] = useState<boolean>(() => isWrapperPresent());
  useEffect(() => {
    let active = true;
    waitForWrapper().then((r) => {
      if (!active) return;
      const isNative = !!r || isNativePurchasesAvailable() || !!getPurchasesPlugin();
      setNative(isNative);
    });
    return () => {
      active = false;
    };
  }, []);
  const webCurrency = useMemo(() => getWebCurrency(), []);

  // The catalogue starts from the fallback so an amount is on screen before the
  // server read lands (spec §9), then upgrades to the server's own numbers.
  const [plans, setPlans] = useState<BillingPlan[]>(() => fallbackBillingPlans());
  useEffect(() => {
    let active = true;
    fetchBillingPlans().then((next) => {
      if (active && next.length) setPlans(next);
    });
    return () => {
      active = false;
    };
  }, []);
  const catalogue = plans.find((p) => p.code === selectedPlan && p.currency === webCurrency);

  // Drives the post-checkout message from the context's live flag rather than
  // from a stale closure inside the click handler. The flag returns to false on
  // both outcomes, so the message is gated on the buyer not already holding
  // access — a granted buyer must never be told it is still activating.
  useEffect(() => {
    if (!isOpen || pendingActivation) return;
    if (!submittedRef.current) return;
    submittedRef.current = false;
    if (!isPremium) {
      toast.info('Still activating — this can take a moment. Check your account shortly.');
    }
  }, [pendingActivation, isOpen, isPremium]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (!isOpen) {
      setRestoreStep('closed');
      setRestoreCode('');
      setRestoreError(null);
    }
  }, [isOpen]);
  const webPrices = WEB_PRICES[webCurrency];
  // Only the web catalogue carries numeric amounts. Native prices arrive from
  // the store as formatted strings, so no percentage is shown there rather than
  // deriving one from a price this code cannot read.
  const savingPercent = native
    ? null
    : yearlySavingPercent(webPrices.monthly.amount, webPrices.yearly.amount);

  useEffect(() => {
    if (!isOpen || !native) return;
    let active = true;
    (async () => {
      try {
        setStoreError(null);
        const ok = await configure();
        if (!ok) {
          if (active) setStoreError('The store could not be reached. Please try again later.');
          return;
        }
        const pkgs = await getOfferings();
        if (active) {
          setPackages(pkgs);
          if (pkgs.length === 0) setStoreError('No plans are available right now. Please try again later.');
        }
      } catch (e: any) {
        if (active) setStoreError(e?.message ?? 'The store could not be reached. Please try again later.');
      }
    })();
    return () => {
      active = false;
    };
  }, [isOpen, native]);

  const pkgFor = useMemo(
    () => (plan: 'monthly' | 'yearly') =>
      packages.find((p) => `${p.identifier} ${p.period}`.toLowerCase().includes(plan === 'yearly' ? 'annual' : 'month')) ??
      packages.find((p) => `${p.identifier} ${p.period}`.toLowerCase().includes(plan.slice(0, 4))) ??
      null,
    [packages]
  );

  if (!isOpen) return null;

  const monthlyPkg = pkgFor('monthly');
  const yearlyPkg = pkgFor('yearly');
  const monthlyPrice = monthlyPkg?.priceString || webPrices.monthly.display;
  const yearlyPrice = yearlyPkg?.priceString || webPrices.yearly.display;

  // In the native app only plans the store actually offers are shown.
  const planOptions: Array<'monthly' | 'yearly'> = native
    ? ([monthlyPkg && 'monthly', yearlyPkg && 'yearly'].filter(Boolean) as Array<'monthly' | 'yearly'>)
    : ['monthly', 'yearly'];
  const activePlan = planOptions.includes(selectedPlan) ? selectedPlan : (planOptions[0] ?? 'yearly');

  // Native prices are the store's own localized strings — the only amount a
  // buyer authorizing through Apple/Google should see. The server catalogue is
  // keyed by web currency and is used only on the web path.
  const priceText = native
    ? (activePlan === 'monthly' ? monthlyPrice : yearlyPrice)
    : formatPlanAmount(catalogue);

  const rememberEmail = (value: string) => {
    setEmail(value);
    try {
      localStorage.setItem(EMAIL_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const handleContinue = async () => {
    if (native) {
      const pkg = activePlan === 'yearly' ? yearlyPkg : monthlyPkg;
      if (!pkg) {
        toast.error('No store package is available. Try restoring purchases or check AppBuild configuration.');
        return;
      }
      setBusy(true);
      try {
        await purchasePackage(pkg);
        const ent = await getEntitlement('premium');
        await refreshSubscription();
        if (!ent) {
          setStoreError('Your purchase went through but access is still pending. Tap Restore Purchases in a moment.');
          toast.error('Purchase recorded, but access is not active yet. Try Restore Purchases.');
          return;
        }
        toast.success('Purchase complete. Thank you!');
        onSelectPlan(activePlan, 'pro');
      } catch (e: any) {
        if (!e?.userCancelled) toast.error(e?.message ?? 'Purchase failed.');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Enter a valid email address so we can save your purchase.');
      return;
    }
    setBusy(true);
    // Mark the checkout in flight before the await so the effect above can tell
    // it apart from the modal simply being open.
    submittedRef.current = true;
    try {
      await startSubscriptionCheckout(activePlan, email.trim().toLowerCase());
      // The context has already polled. Whatever it found, the modal does not
      // claim more than the server granted.
    } catch (e: any) {
      // A cancelled or failed checkout is not "still activating".
      submittedRef.current = false;
      if (!e?.userCancelled) toast.error(e?.message ?? 'Payment failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    if (native) {
      setRestoring(true);
      try {
        await restorePurchases();
        const ent = await getEntitlement('premium');
        await refreshSubscription();
        if (ent) {
          setStoreError(null);
          toast.success('Purchases restored.');
          onSelectPlan(activePlan, 'pro');
        } else {
          toast.info('No active purchase found on this account.');
        }
      } catch (e: any) {
        toast.error(e?.message ?? 'Nothing to restore.');
      } finally {
        setRestoring(false);
      }
      return;
    }

    // Website: open the one-time-code restore panel.
    setRestoreEmail((prev) => prev || email.trim());
    setRestoreCode('');
    setRestoreError(null);
    setRestoreStep('email');
  };

  const finishRestore = (found: WebPremium | null, devEmail?: string) => {
    if (found) {
      toast.success(
        // Dev builds only; this branch and its text are stripped from production.
        import.meta.env.DEV && devEmail && isDeveloperEmail(devEmail)
          ? 'Developer access activated (dev build) — everything is unlocked on this device.'
          : 'Access restored.'
      );
      setRestoreStep('closed');
      setRestoreCode('');
      void refreshSubscription();
      onSelectPlan(found.plan, 'pro');
    } else {
      setRestoreError(null);
      setRestoreStep('email');
      setRestoreCode('');
      toast.info('No active website purchase was found for this email.');
    }
  };

  const sendRestoreCode = async () => {
    const target = restoreEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(target)) {
      setRestoreError('Enter the email you paid with.');
      return;
    }
    setRestoreError(null);
    setRestoring(true);
    try {
      const devAccess = await requestRestoreCode(target);
      if (devAccess) {
        finishRestore(devAccess, target);
        return;
      }
      setRestoreStep('code');
      setRestoreCode('');
      setResendIn(RESEND_SECONDS);
      toast.success(`We emailed a code to ${target}.`);
    } catch (e: unknown) {
      setRestoreError(e instanceof Error ? e.message : 'Could not send the code. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const submitRestoreCode = async () => {
    setRestoreError(null);
    setRestoring(true);
    try {
      const found = await verifyRestoreCode(restoreEmail, restoreCode);
      finishRestore(found);
    } catch (e: unknown) {
      setRestoreError(e instanceof Error ? e.message : 'Could not verify the code.');
    } finally {
      setRestoring(false);
    }
  };

  const handleStartTrial = () => {
    setTrialError(null);
    setTrialStep('email');
  };

  const handleTrialEmail = async () => {
    setStartingTrial(true);
    setTrialError(null);
    try {
      const result = await requestEmailCode(trialEmail);
      if (!result.ok) throw new Error(result.message ?? 'Could not send a code.');
      setTrialStep('code');
    } catch (e: unknown) {
      setTrialError(e instanceof Error ? e.message : 'Could not send a code.');
    } finally {
      setStartingTrial(false);
    }
  };

  const handleTrialVerify = async () => {
    setStartingTrial(true);
    setTrialError(null);
    try {
      const verified = await verifyEmailCode(trialEmail, trialCode);
      if (!verified.ok) throw new Error(verified.message ?? 'That code was not accepted.');

      // The server decides whether a trial may start. `none` means this account
      // already holds an entitlement row — a spent trial included — so it is a
      // refusal to report, not a failure to retry.
      const next = await startTrial();
      if (next === 'none') {
        throw new Error('A trial has already been used on this account.');
      }

      setTrialCode('');
      setTrialStep('closed');
      onClose?.();
    } catch (e: unknown) {
      setTrialError(e instanceof Error ? e.message : 'Could not start the trial.');
    } finally {
      setStartingTrial(false);
    }
  };

  const working = busy || isLoading;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full bg-background/70 p-2 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <img
          src={heroImage}
          alt="Illustration of a phone unlocking premium features"
          width={1024}
          height={640}
          loading="lazy"
          className="w-full aspect-[16/10] object-cover rounded-t-3xl"
        />

        <div className="px-6 pt-6 pb-6 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">Unlock full access</h2>

          <ul className="space-y-4">
            {BENEFITS.map(({ icon: Icon, title, description, tone }) => (
              <li key={title} className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-11 h-11 rounded-full border flex items-center justify-center ${tone}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground leading-tight">{title}</span>
                  <span className="block text-sm text-muted-foreground leading-snug">{description}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <div
              className={`grid p-1 rounded-full bg-muted ${planOptions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {planOptions.map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    activePlan === plan
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {plan === 'monthly' ? 'Monthly' : `Yearly${savingPercent ? ` · Save ${savingPercent}%` : ''}`}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground tabular-nums">
              {activePlan === 'monthly'
                ? `Monthly plan · ${priceText} per month`
                : `Yearly plan · ${priceText} per year`}
            </p>
            {!native && (
              <p className="text-center text-xs text-muted-foreground">
                Renews automatically unless you cancel. Your card is charged today.
              </p>
            )}
          </div>

          {!native && (
            <div className="space-y-1.5">
              <label htmlFor="billing-email" className="block text-sm font-medium text-foreground">
                Email for your receipt
              </label>
              <input
                id="billing-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => rememberEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {storeError && (
            <p role="alert" className="text-sm text-destructive text-center">{storeError}</p>
          )}
          {native && !storeError && !(activePlan === 'yearly' ? yearlyPkg : monthlyPkg) && (
            <p role="alert" className="text-sm text-muted-foreground text-center">
              This plan is unavailable right now. Try Restore Purchases or check back shortly.
            </p>
          )}

          {pendingActivation && (
            <p role="status" className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Payment received — activating…
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={working || (native && !(activePlan === 'yearly' ? yearlyPkg : monthlyPkg))}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {working && <Loader2 className="w-5 h-5 animate-spin" />}
            {working ? 'Processing…' : 'Continue'}
          </button>

          <div className="text-center">
            {trialStep === 'closed' ? (
              <button
                onClick={handleStartTrial}
                className="mt-2 text-sm font-medium text-primary underline underline-offset-4"
              >
                Start 3-day trial
              </button>
            ) : (
              <form
                className="mt-3 space-y-3 rounded-2xl border border-border bg-muted/40 p-4 text-left"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (startingTrial) return;
                  if (trialStep === 'email') void handleTrialEmail();
                  else void handleTrialVerify();
                }}
              >
                <div className="space-y-1.5">
                  <label htmlFor="trial-email" className="block text-xs font-medium text-foreground">
                    Your email
                  </label>
                  <input
                    id="trial-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    value={trialEmail}
                    onChange={(e) => setTrialEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={startingTrial}
                    className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>
                {trialStep === 'code' && (
                  <div className="space-y-1.5">
                    <label htmlFor="trial-code" className="block text-xs font-medium text-foreground">
                      One-time code
                    </label>
                    <input
                      id="trial-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={10}
                      autoFocus
                      value={trialCode}
                      onChange={(e) => setTrialCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      disabled={startingTrial}
                      className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-center text-lg font-semibold tracking-[0.4em] tabular-nums text-foreground placeholder:tracking-normal placeholder:font-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>
                )}
                {trialError && (
                  <p role="alert" className="text-xs text-destructive">{trialError}</p>
                )}
                <button
                  type="submit"
                  disabled={startingTrial}
                  className="w-full min-h-[44px] rounded-full bg-primary text-primary-foreground text-sm font-semibold transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {startingTrial && <Loader2 className="h-4 w-4 animate-spin" />}
                  {trialStep === 'email' ? 'Email me a code' : 'Start my trial'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrialStep('closed');
                    setTrialCode('');
                    setTrialError(null);
                  }}
                  disabled={startingTrial}
                  className="mx-auto block text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {native || restoreStep === 'closed' ? (
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="w-full min-h-[44px] rounded-full border border-border text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.99] disabled:opacity-60"
            >
              {restoring ? 'Restoring…' : native ? 'Restore Purchases' : 'Restore access'}
            </button>
          ) : (
            <form
              className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (restoring) return;
                if (restoreStep === 'email') void sendRestoreCode();
                else void submitRestoreCode();
              }}
            >
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Restore website purchase</p>
                  <p className="text-xs leading-snug text-muted-foreground">
                    {restoreStep === 'email'
                      ? "We'll email you a one-time code to confirm it's your address."
                      : <>Enter the code we sent to <span className="font-medium text-foreground break-words">{restoreEmail.trim().toLowerCase()}</span>. You can also tap the sign-in link in that email on this device.</>}
                  </p>
                </div>
              </div>

              {restoreStep === 'email' ? (
                <div className="space-y-1.5">
                  <label htmlFor="restore-email" className="block text-xs font-medium text-foreground">
                    Email you paid with
                  </label>
                  <input
                    id="restore-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={restoring}
                    className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="restore-code" className="block text-xs font-medium text-foreground">
                    One-time code
                  </label>
                  <input
                    id="restore-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={10}
                    autoFocus
                    value={restoreCode}
                    onChange={(e) => setRestoreCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    disabled={restoring}
                    className="w-full min-h-[44px] rounded-2xl border border-border bg-background px-4 text-center text-lg font-semibold tracking-[0.4em] tabular-nums text-foreground placeholder:tracking-normal placeholder:font-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>
              )}

              {restoreError && (
                <p role="alert" className="text-xs text-destructive">{restoreError}</p>
              )}

              <button
                type="submit"
                disabled={restoring || (restoreStep === 'code' && restoreCode.length < 6)}
                className="w-full min-h-[44px] rounded-full bg-primary text-primary-foreground text-sm font-semibold transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {restoring && <Loader2 className="h-4 w-4 animate-spin" />}
                {restoreStep === 'email'
                  ? restoring ? 'Sending…' : 'Email me a code'
                  : restoring ? 'Verifying…' : 'Verify & restore'}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (restoreStep === 'code') {
                      setRestoreStep('email');
                      setRestoreCode('');
                    } else {
                      setRestoreStep('closed');
                    }
                    setRestoreError(null);
                  }}
                  disabled={restoring}
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  {restoreStep === 'code' ? 'Use a different email' : 'Cancel'}
                </button>
                {restoreStep === 'code' && (
                  <button
                    type="button"
                    onClick={() => void sendRestoreCode()}
                    disabled={restoring || resendIn > 0}
                    className="font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline tabular-nums"
                  >
                    {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
                  </button>
                )}
              </div>
            </form>
          )}

          {native && (
            <ul className="space-y-1.5 text-[11px] leading-snug text-muted-foreground list-disc pl-4">
              <li>Payment will be charged to your Apple ID account at confirmation of purchase.</li>
              <li>Subscription automatically renews unless auto-renew is canceled at least 24 hours before the end of the current period.</li>
              <li>Your account will be charged for renewal within 24 hours prior to the end of the current billing period.</li>
              <li>You can manage and cancel your subscriptions in your App Store Account Settings after purchase.</li>
            </ul>
          )}

          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="/terms" target="_blank" rel="noopener" className="underline hover:text-foreground transition">Terms of Use (EULA)</a>
            <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-foreground transition">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
