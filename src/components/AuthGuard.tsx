import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/terms', '/privacy'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isPremium, demoTrialActive, showPaywall, setShowPaywall } = useSubscription();

  const isPublic =
    typeof window !== 'undefined' && PUBLIC_PATHS.includes(window.location.pathname);
  const hasAccess = isPremium || demoTrialActive;

  if (!hasAccess && !isPublic) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <PaywallModal isOpen={true} onClose={() => {}} onSelectPlan={() => {}} />
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Paywall opened on demand (Settings, header "Pro" button, banners). */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={() => setShowPaywall(false)}
      />
    </>
  );
};
