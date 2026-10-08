import { useSubscription } from '@/contexts/SubscriptionContext';
import { Zap, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getWebCurrency, yearlySavingPercent, WEB_PRICES } from '@/lib/webBilling';

export const AdBanner = () => {
  const { features, setShowPaywall, isPremium, demoTrialActive } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  const currency = getWebCurrency();
  const prices = WEB_PRICES[currency];
  // The banner used to claim a flat "save 20%", which was wrong in both
  // currencies: INR yearly currently costs slightly more than twelve monthly
  // payments, and the USD saving is 30%. Derive it, and say nothing when there
  // is nothing to claim.
  const savingPercent = yearlySavingPercent(prices.monthly.amount, prices.yearly.amount);

  if (isPremium || demoTrialActive || isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl px-6 py-4 mb-4 bg-black border border-magenta-500/60">
      {/* Subtle neon accent border glow - lighter on right */}
      <div className="absolute inset-0 bg-gradient-to-l from-magenta-600/20 via-transparent to-cyan-600/20" />
      <div className="absolute inset-0 shadow-lg shadow-magenta-600/40" />

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowPaywall(true)}
          className="flex items-center gap-3 flex-1 text-left hover:opacity-90 transition-opacity group"
          aria-label="Upgrade to Cognito Pro"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.5)]">
            <Zap className="w-5 h-5 text-foreground drop-shadow-[0_0_4px_rgba(255,0,255,0.8)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-foreground" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>
              Upgrade to Cognito Pro
            </p>
            <p className="text-xs font-bold text-foreground" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>
              {prices.yearly.display} /year{savingPercent ? ` · save ${savingPercent}%` : ''}, or {prices.monthly.display} /month
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => setShowPaywall(true)}
            size="sm"
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-xs font-bold transition-transform active:scale-95"
          >
            Start 3-day free trial
          </Button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
            className="flex-shrink-0 text-foreground hover:bg-white/20 p-2 rounded-lg transition backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
