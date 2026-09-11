import { PaywallModal } from '@/components/PaywallModal';
import { useSubscription } from '@/contexts/SubscriptionContext';

/** Renders the paywall from anywhere in the app (Settings, assessments, etc). */
export const GlobalPaywall = () => {
  const { showPaywall, setShowPaywall, initiatePurchase } = useSubscription();

  return (
    <PaywallModal
      isOpen={showPaywall}
      onClose={() => setShowPaywall(false)}
      onSelectPlan={initiatePurchase}
    />
  );
};

export default GlobalPaywall;
