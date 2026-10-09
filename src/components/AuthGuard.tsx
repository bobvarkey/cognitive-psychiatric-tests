import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';
import { AccessDiagnostic } from '@/components/AccessDiagnostic';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Reachable without access: the legal pages, and the receipt that a just-paid
// buyer is redirected to before their entitlement has been read back.
const PUBLIC_PATHS = ['/terms', '/privacy', '/checkout/success'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isPremium, demoTrialActive, showPaywall, setShowPaywall, checkingServerAccess } =
    useSubscription();

  const isPublic =
    typeof window !== 'undefined' && PUBLIC_PATHS.includes(window.location.pathname);

  // Anything already granted short-circuits the wait, so an existing buyer never
  // sees a spinner they do not need.
  const hasAccess = isPremium || demoTrialActive;
  const waiting = checkingServerAccess && !hasAccess;

  if (!hasAccess && !isPublic) {
    if (waiting) {
      // Neutral, and never the paywall: for the duration of the RPC we do not
      // yet know, and showing the paywall to someone who holds a grant is the
      // exact flash this exists to prevent.
      return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
          <Loader2 role="status" aria-label="Checking access" className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <PaywallModal isOpen={true} onSelectPlan={() => {}} />
        {/* The id an administrator has to grant is only readable here: the screen
            that normally reports it is behind this gate. */}
        <AccessDiagnostic />
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
