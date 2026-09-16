import { useEffect, useMemo, useState } from 'react';
import { X, Lock, Bell, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/paywall-hero.jpg';
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
  startWebCheckout,
  restoreWebPurchase,
  getWebCurrency,
  WEB_PRICES,
} from '@/lib/webBilling';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const PaywallModal = ({ isOpen, onClose, onSelectPlan, isLoading = false }: PaywallModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [packages, setPackages] = useState<RcPackage[]>([]);
  const [busy, setBusy] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(EMAIL_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const { refreshSubscription } = useSubscription();

  const native = isNativePurchasesAvailable();
  const webCurrency = useMemo(() => getWebCurrency(), []);
  const webPrices = WEB_PRICES[webCurrency];

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
      const pkg = selectedPlan === 'yearly' ? yearlyPkg : monthlyPkg;
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
        onSelectPlan(selectedPlan, 'pro');
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
    try {
      await startWebCheckout(selectedPlan, email.trim().toLowerCase(), webCurrency);
      toast.success('Payment successful. Everything is unlocked.');
      onSelectPlan(selectedPlan, 'pro');
    } catch (e: any) {
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
          onSelectPlan(selectedPlan, 'pro');
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

    if (!EMAIL_RE.test(email.trim())) {
      toast.error('Enter the email you paid with to restore access.');
      return;
    }
    setRestoring(true);
    try {
      const found = await restoreWebPurchase(email.trim().toLowerCase());
      if (found) {
        toast.success('Access restored.');
        onSelectPlan(found.plan, 'pro');
      } else {
        toast.info('No active purchase found for that email.');
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not restore.');
    } finally {
      setRestoring(false);
    }
  };

  const working = busy || isLoading;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-full bg-background/70 p-2 text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

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
                    selectedPlan === plan
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {plan === 'monthly' ? 'Monthly' : 'Yearly · Save 33%'}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground tabular-nums">
              {selectedPlan === 'monthly' ? `${monthlyPrice}/month` : `Only ${yearlyPrice}/year`}
            </p>
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
          {native && !storeError && !(selectedPlan === 'yearly' ? yearlyPkg : monthlyPkg) && (
            <p role="alert" className="text-sm text-muted-foreground text-center">
              This plan is unavailable right now. Try Restore Purchases or check back shortly.
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={working || (native && !(selectedPlan === 'yearly' ? yearlyPkg : monthlyPkg))}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {working && <Loader2 className="w-5 h-5 animate-spin" />}
            {working ? 'Processing…' : 'Continue'}
          </button>

          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <button onClick={handleRestore} disabled={restoring} className="hover:text-foreground transition">
              {restoring ? 'Restoring…' : native ? 'Restore Purchases' : 'Restore access'}
            </button>
            <a href="/terms" className="hover:text-foreground transition">Terms</a>
            <a href="/privacy" className="hover:text-foreground transition">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
