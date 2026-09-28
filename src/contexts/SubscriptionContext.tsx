import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createDemoSubscription,
  setDemoUnlockAll,
  getDemoUnlockAll,
  getDemoTrialMsLeft,
  resetDemoTrial,
  DEMO_TRIAL_DAYS,
} from '@/services/subscriptionService';
import type { Subscription } from '@/services/subscriptionService';
import { getWebPremium, restoreWebPurchase, type WebPremium } from '@/lib/webBilling';

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
  /** Whether the 2-day demo trial is still running. */
  demoTrialActive: boolean;
  /** Milliseconds remaining in the demo trial. */
  demoTrialMsLeft: number;
  demoTrialDays: number;
  restartDemoTrial: () => void;
  /** Website (Razorpay) subscription active on this device, if any. */
  webPremium: WebPremium | null;
  restoreWebAccess: (email: string) => Promise<boolean>;
  /** Where the current premium access comes from. */
  premiumSource: 'store' | 'web' | 'demo' | 'none';
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

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [demoUnlockAll, setDemoUnlockAllState] = useState<boolean>(() => getDemoUnlockAll());
  const [demoTrialMsLeft, setDemoTrialMsLeft] = useState<number>(() => getDemoTrialMsLeft());
  const [webPremium, setWebPremium] = useState<WebPremium | null>(() => getWebPremium());
  // Tick the trial countdown once a minute so access expires without a reload.
  useEffect(() => {
    const id = setInterval(() => setDemoTrialMsLeft(getDemoTrialMsLeft()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sync = () => setWebPremium(getWebPremium());
    window.addEventListener('psycognito:web-premium', sync);
    return () => window.removeEventListener('psycognito:web-premium', sync);
  }, []);

  // All features are unlocked for everyone — the paywall/entitlement gate has been removed.
  const isPremium = true;

  const demoTrialActive = false; // kept for API compatibility; gate removed
  const premiumSource: 'store' | 'web' | 'demo' | 'none' = 'store';

  const features: PremiumFeatures = FULL_PREMIUM_FEATURES;

  const refreshSubscription = () => {
    // No-op: the paywall/entitlement gate has been removed.
  };

  const toggleDemoUnlockAll = (enabled: boolean) => {
    setDemoUnlockAll(enabled);
    setDemoUnlockAllState(enabled);
    setDemoTrialMsLeft(getDemoTrialMsLeft());
  };

  const restartDemoTrial = () => {
    resetDemoTrial();
    setDemoUnlockAll(true);
    setDemoUnlockAllState(true);
    setDemoTrialMsLeft(getDemoTrialMsLeft());
    setShowPaywall(false);
  };

  const restoreWebAccess = async (email: string) => {
    const found = await restoreWebPurchase(email);
    setWebPremium(getWebPremium());
    return !!found;
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
    demoTrialActive,
    demoTrialMsLeft,
    demoTrialDays: DEMO_TRIAL_DAYS,
    restartDemoTrial,
    webPremium,
    restoreWebAccess,
    premiumSource,
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
