import React, { createContext, useContext, useState, useEffect } from 'react';
import { isPremiumUser, getSubscription, createDemoSubscription, getPremiumFeatures } from '@/services/subscriptionService';
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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [features, setFeatures] = useState<PremiumFeatures>(getPremiumFeatures());
  const [showPaywall, setShowPaywall] = useState(false);

  // Check subscription status on mount
  useEffect(() => {
    refreshSubscription();
  }, []);

  const refreshSubscription = () => {
    const premium = isPremiumUser();
    const sub = getSubscription();
    setIsPremium(premium);
    setSubscription(sub);
    setFeatures(getPremiumFeatures());
  };

  const initiatePurchase = async (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro') => {
    try {
      // For demo purposes, we're activating demo subscription
      // In production, this would integrate with Stripe
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
