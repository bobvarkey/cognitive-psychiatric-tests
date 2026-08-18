import { useState } from 'react';
import { X, Check, Brain, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => void;
  isLoading?: boolean;
}

export const PaywallModal = ({ isOpen, onClose, onSelectPlan, isLoading = false }: PaywallModalProps) => {
  const [selectedTier, setSelectedTier] = useState<'lite' | 'pro'>('lite');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const tierPlans = {
    lite: {
      name: 'Lite',
      description: 'Essential clinical tools',
      yearly: {
        price: 19.99,
        renewal: 16.99,
        period: '/year',
      },
      monthly: {
        price: 2.99,
        period: '/month',
      },
      features: [
        'Full access to 40+ assessments',
        'Export to PDF',
        'Basic analytics',
      ],
    },
    pro: {
      name: 'Pro',
      description: 'Advanced clinical platform',
      yearly: {
        price: 29.99,
        renewal: 19.99,
        period: '/year',
      },
      monthly: {
        price: 3.99,
        period: '/month',
      },
      features: [
        'Full access to 40+ assessments',
        'Export to PDF & DOCX',
        'Advanced clinical analytics',
        'Patient tracking & history',
        'Priority support',
        'Offline access',
      ],
    },
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl glass-dark">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Neon Gradient */}
        <div className="relative px-6 pt-8 pb-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-magenta-600/30 to-cyan-500/20 blur-xl" />

          {/* Rating Section */}
          <div className="relative mb-4">
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 star-pulse fill-yellow-400 text-yellow-700 dark:text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-foreground/90">49 stars • 1,000+ reviews</p>
          </div>

          {/* Icon */}
          <div className="mb-4 flex justify-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-600 to-cyan-500 rounded-3xl blur-xl opacity-60" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-magenta-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.5),0_0_60px_rgba(0,255,255,0.3)]">
                <Brain className="w-10 h-10 text-foreground drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-foreground mb-2 relative z-10">
            Upgrade to Cognito Pro
          </h2>
          <p className="text-foreground/90 text-sm relative z-10 mb-3">
            Unlock double the features, get priority support
          </p>
          <div className="relative z-10 space-y-2 text-xs text-muted-foreground bg-black/30 rounded-lg p-3">
            <div className="flex justify-between">
              <span>Lite: 20 core assessments</span>
              <span>Pro: All 54 assessments</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-8 space-y-6">
          {/* Tier Selection */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose your plan</p>
            <div className="grid grid-cols-2 gap-3">
              {(['lite', 'pro'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 rounded-2xl transition-all duration-300 text-center ${
                    selectedTier === tier
                      ? 'bg-gradient-to-r from-magenta-600/40 to-cyan-600/40 border border-magenta-400/60 shadow-[0_0_20px_rgba(255,0,255,0.3)]'
                      : 'bg-slate-800/40 border border-border/40 hover:border-magenta-400/40'
                  }`}
                >
                  <div className="font-bold text-foreground capitalize mb-1">{tierPlans[tier].name}</div>
                  <div className="text-xs text-muted-foreground">{tierPlans[tier].description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Comparison Table */}
          <div className="relative z-10 space-y-1 text-xs text-muted-foreground bg-black/30 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-2 text-center font-semibold text-foreground/90 mb-2">
              <span className="text-left">Feature</span><span>Lite</span><span>Pro</span>
            </div>
            {[
              ['Assessments', '20', '54'],
              ['PDF Export', '✓', '✓'],
              ['DOCX Export', '—', '✓'],
              ['Patient History', '—', '✓'],
            ].map(([feature, lite, pro]) => (
              <div key={feature} className="grid grid-cols-3 gap-2 text-center py-1 border-t border-white/5">
                <span className="text-left text-muted-foreground">{feature}</span>
                <span className={lite === '—' ? 'text-gray-600' : 'text-cyan-700 dark:text-cyan-400'}>{lite}</span>
                <span className={pro === '—' ? 'text-gray-600' : 'text-fuchsia-400'}>{pro}</span>
              </div>
            ))}
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-2">
            {tierPlans[selectedTier].features.map((f, i) => (
              <span key={i} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-foreground border ${
                selectedTier === 'pro' ? 'bg-fuchsia-600/20 border-fuchsia-500/30' : 'bg-cyan-600/20 border-cyan-500/30'
              }`}>
                <Check className={`w-3 h-3 ${selectedTier === 'pro' ? 'text-fuchsia-400' : 'text-cyan-700 dark:text-cyan-400'}`} />
                {f}
              </span>
            ))}
          </div>

          {/* Billing Period Selection */}
          <div className="space-y-3 pt-4 border-t border-magenta-500/20">
            {/* Yearly Plan */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`w-full relative p-4 rounded-2xl transition-all duration-300 ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-r from-magenta-600/40 to-cyan-600/40 border border-magenta-400/60 shadow-[0_0_20px_rgba(255,0,255,0.3)]'
                  : 'bg-slate-800/40 border border-border/40 hover:border-magenta-400/40'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">Yearly</span>
                    <span className="bg-gradient-to-r from-magenta-500 to-cyan-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                      First year
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Then ${tierPlans[selectedTier].yearly.renewal}/year
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">
                    ${tierPlans[selectedTier].yearly.price}
                  </div>
                  <div className="text-muted-foreground text-xs">per year</div>
                </div>
              </div>
              {selectedPlan === 'yearly' && (
                <div className="absolute right-4 top-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-magenta-500 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                    <Check className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              )}
            </button>

            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`w-full relative p-4 rounded-2xl transition-all duration-300 ${
                selectedPlan === 'monthly'
                  ? 'bg-gradient-to-r from-magenta-600/40 to-cyan-600/40 border border-magenta-400/60 shadow-[0_0_20px_rgba(255,0,255,0.3)]'
                  : 'bg-slate-800/40 border border-border/40 hover:border-magenta-400/40'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="text-left">
                  <div className="font-bold text-foreground mb-1">Monthly</div>
                  <div className="text-muted-foreground text-xs">
                    Billed monthly
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">
                    ${tierPlans[selectedTier].monthly.price}
                  </div>
                  <div className="text-muted-foreground text-xs">per month</div>
                </div>
              </div>
              {selectedPlan === 'monthly' && (
                <div className="absolute right-4 top-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-magenta-500 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                    <Check className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onSelectPlan(selectedPlan, selectedTier)}
            disabled={isLoading}
            className="w-full relative py-3.5 px-6 rounded-2xl font-bold text-lg text-foreground transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-magenta-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-magenta-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 shadow-lg shadow-magenta-500/50 group-hover:shadow-2xl group-hover:shadow-magenta-500/75 transition-shadow rounded-2xl" />
            <span className="relative flex items-center justify-center">
              {isLoading ? 'Processing...' : `Subscribe to ${tierPlans[selectedTier].name}`}
            </span>
          </button>

          {/* Footer Links */}
          <div className="flex justify-center gap-4 pt-4 border-t border-magenta-500/20 flex-wrap">
            <button className="text-magenta-400 hover:text-magenta-300 font-medium text-xs transition">
              Restore Purchase
            </button>
            <span className="text-gray-700">•</span>
            <button className="text-muted-foreground hover:text-muted-foreground text-xs transition">
              Terms
            </button>
            <span className="text-gray-700">•</span>
            <button className="text-muted-foreground hover:text-muted-foreground text-xs transition">
              Privacy
            </button>
            <span className="text-gray-700">•</span>
            <button
              onClick={() => {
                const searchParams = new URLSearchParams();
                searchParams.set('view', 'suggestions');
                window.location.hash = searchParams.toString();
                onClose();
              }}
              className="text-magenta-400 hover:text-magenta-300 font-medium text-xs transition flex items-center gap-1"
            >
              Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
