import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { showPaywall, setShowPaywall } = useSubscription();

  // Browsing is independent of entitlement checks; opening this sheet grants nothing.
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
