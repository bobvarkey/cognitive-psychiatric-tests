import { useEffect, useMemo, useState } from 'react';
import { X, Lock, Bell, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/paywall-hero.jpg';
import {
  configure,
  getOfferings,
  purchasePackage,
  restorePurchases,
  isNativePurchasesAvailable,
  type RcPackage,
} from '@/lib/appbuild/revenuecat';
import { startWebCheckout, restoreWebPurchase, WEB_PRICES } from '@/lib/webBilling';

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

const FALLBACK = {
  monthly: { price: '$2.99', caption: '$2.99/month' },
  yearly: { price: '$24.99', caption: 'Only $24.99/year' },
};

export const PaywallModal = ({ isOpen, onClose, onSelectPlan, isLoading = false }: PaywallModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [packages, setPackages] = useState<RcPackage[]>([]);
  const [busy, setBusy] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    (async () => {
      try {
        const ok = await configure();
        if (!ok) return;
        const pkgs = await getOfferings();
        if (active) setPackages(pkgs);
      } catch {
        /* store options unavailable outside the mobile app */
      }
    })();
    return () => {
      active = false;
    };
  }, [isOpen]);

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
  const monthlyPrice = monthlyPkg?.priceString || FALLBACK.monthly.price;
  const yearlyPrice = yearlyPkg?.priceString || FALLBACK.yearly.price;

  const handleContinue = async () => {
    const pkg = selectedPlan === 'yearly' ? yearlyPkg : monthlyPkg;
    if (pkg && isNativePurchasesAvailable()) {
      setBusy(true);
      try {
        await purchasePackage(pkg);
        toast.success('Purchase complete. Thank you!');
        onSelectPlan(selectedPlan, 'pro');
      } catch (e: any) {
        if (!e?.userCancelled) toast.error(e?.message ?? 'Purchase failed.');
      } finally {
        setBusy(false);
      }
      return;
    }
    onSelectPlan(selectedPlan, 'pro');
  };

  const handleRestore = async () => {
    if (!isNativePurchasesAvailable()) {
      toast.info('Purchases are restored inside the iOS and Android apps.');
      return;
    }
    setRestoring(true);
    try {
      await restorePurchases();
      toast.success('Purchases restored.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Nothing to restore.');
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
            <div className="grid grid-cols-2 p-1 rounded-full bg-muted">
              {(['monthly', 'yearly'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    selectedPlan === plan
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {plan === 'monthly' ? 'Monthly' : 'Yearly · Save 19%'}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground tabular-nums">
              {selectedPlan === 'monthly' ? `${monthlyPrice}/month` : `Only ${yearlyPrice}/year`}
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={working}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {working && <Loader2 className="w-5 h-5 animate-spin" />}
            {working ? 'Processing…' : 'Continue'}
          </button>

          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <button onClick={handleRestore} disabled={restoring} className="hover:text-foreground transition">
              {restoring ? 'Restoring…' : 'Restore Purchases'}
            </button>
            <a href="/terms" className="hover:text-foreground transition">Terms</a>
            <a href="/privacy" className="hover:text-foreground transition">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
