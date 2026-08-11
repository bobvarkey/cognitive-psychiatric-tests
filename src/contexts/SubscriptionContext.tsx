import React, { createContext, useContext, useState } from 'react';
import { createDemoSubscription, setDemoUnlockAll } from '@/services/subscriptionService';
import type { Subscription } from '@/services/subscriptionService';

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

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [isPremium, setIsPremium] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [features, setFeatures] = useState<PremiumFeatures>(FULL_PREMIUM_FEATURES);
  const [showPaywall, setShowPaywall] = useState(false);
  const [demoUnlockAll, setDemoUnlockAllState] = useState<boolean>(true);
  // Force-unlock: ensure Pro and all plans are always available.

  const refreshSubscription = () => {
    setIsPremium(true);
    setFeatures(FULL_PREMIUM_FEATURES);
    setDemoUnlockAllState(true);
    setDemoUnlockAll(true);
  };

  const toggleDemoUnlockAll = (enabled: boolean) => {
    setDemoUnlockAll(enabled);
    refreshSubscription();
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
    refreshSubscription();
    setShowPaywall(false);
  };

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
