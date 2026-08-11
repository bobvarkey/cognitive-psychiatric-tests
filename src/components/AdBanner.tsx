import { useSubscription } from '@/contexts/SubscriptionContext';
import { Zap, X } from 'lucide-react';
import { useState } from 'react';

export const AdBanner = () => {
  const { features, setShowPaywall } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  // All plans (including Pro) are unlocked — never show the upgrade ad.
  return null;
   
  if (features.bannerAdsDisabled || isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl px-6 py-4 mb-4 bg-black/100 border border-magenta-500/60">
      {/* Subtle neon accent border glow - lighter on right */}
      <div className="absolute inset-0 bg-gradient-to-l from-magenta-600/20 via-transparent to-cyan-600/20" />
      <div className="absolute inset-0 shadow-lg shadow-magenta-600/40" />

      {/* Content */}
      <div className="relative flex items-center justify-between gap-4">
        <button
          onClick={() => setShowPaywall(true)}
          className="flex items-center gap-3 flex-1 text-left hover:opacity-90 transition-opacity"
          aria-label="Upgrade to Cognito Pro"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.5)]">
            <Zap className="w-5 h-5 text-white drop-shadow-[0_0_4px_rgba(255,0,255,0.8)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>Upgrade to Cognito Pro</p>
            <p className="text-xs font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>Unlock double the features, get priority support</p>
          </div>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
          className="flex-shrink-0 text-white hover:bg-white/20 p-2 rounded-lg transition backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
