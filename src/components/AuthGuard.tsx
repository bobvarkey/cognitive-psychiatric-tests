import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PaywallModal } from '@/components/PaywallModal';
import { mustUseStoreBilling } from '@/lib/appbuild/wrapper';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Reachable without access: the legal pages, and the account page, where the
// auth user id that an admin grant is keyed to is readable — the screen that
// otherwise reports it sits behind this same gate.
const PUBLIC_PATHS = ['/terms', '/privacy', '/account', '/checkout/success'];

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isPremium, demoTrialActive, showPaywall, setShowPaywall, checkingServerAccess } =
    useSubscription();

  const isPublic =
    typeof window !== 'undefined' && PUBLIC_PATHS.includes(window.location.pathname);

  // Anything already granted short-circuits the wait, so an existing buyer never
  // sees a spinner they do not need.
  const hasAccess = isPremium || demoTrialActive;
  const waiting = checkingServerAccess && !hasAccess;

  // Without access, deep links are sent back to the home page, where the paywall lives.
  if (!hasAccess && !isPublic && !waiting && !mustUseStoreBilling() && typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.history.replaceState(null, '', '/');
  }

  // App Store / iOS: never lock the screen; browse freely, paywall opens on demand.
  const storeContext = mustUseStoreBilling();

  if (!hasAccess && !isPublic && !storeContext) {
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
