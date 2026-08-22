import React, { createContext, useContext, useEffect, useState } from 'react';
import { createDemoSubscription, setDemoUnlockAll, getDemoUnlockAll } from '@/services/subscriptionService';
import type { Subscription } from '@/services/subscriptionService';
import { usePremiumEntitlement } from '@/hooks/usePremiumEntitlement';

interface PremiumFeatures {
  allAssessments: boolean;
  exportToPDF: boolean;
  exportToDOCX: boolean;
  clinicalAnalytics: boolean;
  patientTracking: boolean;
  prioritySupport: boolean;
  offlineSync: boolean;
  bannerAdsDisabled: boolean;
}

interface SubscriptionContextType {
  isPremium: boolean;
  subscription: Subscription | null;
  features: PremiumFeatures;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  initiatePurchase: (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => Promise<void>;
  activateDemoSubscription: (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => void;
  refreshSubscription: () => void;
  demoUnlockAll: boolean;
  toggleDemoUnlockAll: (enabled: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const FULL_PREMIUM_FEATURES: PremiumFeatures = {
  allAssessments: true,
  exportToPDF: true,
  exportToDOCX: true,
  clinicalAnalytics: true,
  patientTracking: true,
  prioritySupport: true,
  offlineSync: true,
  bannerAdsDisabled: true,
};

const FREE_FEATURES: PremiumFeatures = {
  allAssessments: false,
  exportToPDF: false,
  exportToDOCX: false,
  clinicalAnalytics: false,
  patientTracking: false,
  prioritySupport: false,
  offlineSync: false,
  bannerAdsDisabled: false,
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [demoUnlockAll, setDemoUnlockAllState] = useState<boolean>(() => getDemoUnlockAll());

  // Real entitlement from the AppBuild wrapper's RevenueCat (Purchases) plugin.
  // isPremium is true only when the 'premium' entitlement is active in the native app.
  const { isPremium: entitlementActive, loading: entitlementLoading, refresh: refreshEntitlement } =
    usePremiumEntitlement('premium');

  // Demo unlock is a dev/test escape hatch. When ON it forces premium regardless of entitlement.
  const isPremium = demoUnlockAll || entitlementActive;

  const features: PremiumFeatures = isPremium ? FULL_PREMIUM_FEATURES : FREE_FEATURES;

  const refreshSubscription = () => {
    // Re-check the native entitlement (e.g. after a purchase or restore).
    refreshEntitlement();
  };

  const toggleDemoUnlockAll = (enabled: boolean) => {
    setDemoUnlockAll(enabled);
    setDemoUnlockAllState(enabled);
  };

  const initiatePurchase = async (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => {
    try {
      activateDemoSubscription(plan, tier);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const activateDemoSubscription = (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => {
    createDemoSubscription(plan, tier);
    setShowPaywall(false);
    refreshSubscription();
  };

  // Keep the local subscription record in sync with the entitlement state.
  useEffect(() => {
    if (isPremium && !subscription) {
      // No-op: entitlement is the source of truth; we don't fabricate a local record.
    }
  }, [isPremium, subscription]);

  const value: SubscriptionContextType = {
    isPremium,
    subscription,
    features,
    showPaywall,
    setShowPaywall,
    initiatePurchase,
    activateDemoSubscription,
    refreshSubscription,
    demoUnlockAll,
    toggleDemoUnlockAll,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
