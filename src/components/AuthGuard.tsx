import React, { useMemo } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isPremium, demoTrialActive, showPaywall, setShowPaywall } = useSubscription();

  // Note: In a real production environment, we would also check
  // a 'user' state from an AuthProvider (e.g., Supabase Auth).
  // For this implementation, we are focusing on the entitlement gate.

  const hasAccess = isPremium || demoTrialActive;

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <PaywallModal
          isOpen={true}
          onClose={() => {}} // Cannot close if gating the app
          onSelectPlan={() => {}} // Handled inside PaywallModal
        />
        {/* Overlay to prevent interaction with background */}
        <div className="absolute inset-0 -z-10 bg-background" />
      </div>
    );
  }

  return <>{children}</>;
};
