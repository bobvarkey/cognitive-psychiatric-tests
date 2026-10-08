import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createDemoSubscription,
  setDemoUnlockAll,
  getDemoUnlockAll,
  getDemoTrialMsLeft,
  DEMO_TRIAL_DAYS,
  isPremiumUser,
  isDemoTrialActive,
  getPremiumFeatures,
  getSubscription,
} from '@/services/subscriptionService';
import type { Subscription } from '@/services/subscriptionService';
import { toast } from 'sonner';
import { completeRestoreFromEmailLink, getWebPremium, restoreWebPurchase, restoreWebPurchaseForSession, type WebPremium } from '@/lib/webBilling';
import { currentAuthUser, onAuthChange, serverEntitlement, startTrial as requestTrial, tierOf, type Entitlement, type EntitlementTier } from '@/lib/entitlement';

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
  /** Ask the server to start the 3-day trial. Returns the tier afterwards. */
  startTrial: () => Promise<EntitlementTier>;
  /** Website (Razorpay) subscription active on this device, if any. */
  webPremium: WebPremium | null;
  restoreWebAccess: (email: string) => Promise<boolean>;
  /** Where the current premium access comes from. */
  premiumSource: 'store' | 'web' | 'demo' | 'developer' | 'none';
  /** The caller's grant as this device may honour it, or null. Keeps `source`. */
  entitlement: Entitlement | null;
  /** The tier that grant represents, or 'none'. Derived from `entitlement`. */
  tier: EntitlementTier;
  /** The server's decision for this device, composed with the native rule. */
  serverPremium: boolean;
  /** True from mount until the first server answer, right or wrong. */
  checkingServerAccess: boolean;
  /** Re-ask the server. For callers that have just changed the account's state. */
  refreshEntitlement: () => Promise<void>;
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

/**
 * How long the whole access check may take before the gate opens the safe way.
 *
 * Deliberately longer than the RPC's own bound, so the ordinary failure is the
 * RPC's `null` and this stays a backstop. What it catches is the await that
 * precedes the RPC — the session read — which has no bound of its own.
 */
const GATE_TIMEOUT_MS = 10000;

/** Settles when `work` does, or when `ms` elapses. The gate must always clear. */
async function withDeadline(work: Promise<unknown>, ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      work,
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [demoUnlockAll, setDemoUnlockAllState] = useState<boolean>(() => getDemoUnlockAll());
  const [demoTrialMsLeft, setDemoTrialMsLeft] = useState<number>(() => getDemoTrialMsLeft());
  const [webPremium, setWebPremium] = useState<WebPremium | null>(() => getWebPremium());
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [checkingServerAccess, setCheckingServerAccess] = useState(true);
  // Guards against a slow earlier check overwriting a newer one: a sign-out
  // followed by a sign-in can leave two in flight, and the older must not win.
  const seqRef = useRef(0);
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

  // If a website restore is pending and the user came back via the email's
  // sign-in link (instead of typing the code), finish the restore here.
  useEffect(() => {
    let active = true;
    completeRestoreFromEmailLink()
      .then((found) => {
        if (!active || !found) return;
        setWebPremium(getWebPremium());
        toast.success('Access restored.');
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      active = false;
    };
  }, []);

  // Signed-in users (incl. whitelisted developer accounts, which hold a
  // permanent server-side record) get their access checked automatically.
  useEffect(() => {
    let cancelled = false;
    let sub: { unsubscribe: () => void } | undefined;
    const check = () =>
      restoreWebPurchaseForSession().then(() => {
        if (!cancelled) setWebPremium(getWebPremium());
      });
    import('@/integrations/supabase/client').then(({ supabase }) => {
      if (cancelled) return;
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          setTimeout(() => void check(), 0);
        }
      });
      sub = data.subscription;
    });
    return () => {
      cancelled = true;
      sub?.unsubscribe();
    };
  }, []);

  const refreshEntitlement = useCallback(async () => {
    const mine = ++seqRef.current;
    let grant: Entitlement | null = null;
    const check = (async () => {
      const who = await currentAuthUser();
      // No session, no question: an anonymous caller can hold no grant.
      if (who) grant = await serverEntitlement();
    })();
    try {
      // The whole check is bounded, not just the RPC. The session read is a
      // network call too, and on a stalled connection it never settles — the
      // RPC's own bound would never be reached, and the gate would hold a
      // full-screen spinner for the life of the page.
      await withDeadline(check, GATE_TIMEOUT_MS);
    } catch {
      grant = null;
    } finally {
      // A newer check has started; this answer is stale and must be discarded.
      if (mine === seqRef.current) {
        setEntitlement(grant);
        setCheckingServerAccess(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshEntitlement();
    return onAuthChange(() => {
      void refreshEntitlement();
    });
  }, [refreshEntitlement]);

  // Restore gating logic
  const isPremium = useMemo(
    () => isPremiumUser() || !!webPremium || entitlement !== null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [webPremium, entitlement, subscription, demoUnlockAll, demoTrialMsLeft],
  );

  // The demo only counts once the user has explicitly started it.
  const demoTrialActive = useMemo(
    () => demoUnlockAll && isDemoTrialActive(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [demoTrialMsLeft, demoUnlockAll],
  );

  const premiumSource: 'store' | 'web' | 'demo' | 'developer' | 'none' = webPremium
    ? 'web'
    : entitlement?.source === 'admin'
      ? 'developer'
      : entitlement?.source === 'razorpay'
        ? 'web'
        : entitlement?.source === 'trial' || entitlement?.source === 'demo'
          ? 'demo'
          : (demoTrialActive && demoUnlockAll)
            ? 'demo'
            : isPremium
              ? 'store'
              : 'none';

  const features = getPremiumFeatures() as PremiumFeatures;

  const refreshSubscription = () => {
    setWebPremium(getWebPremium());
    setSubscription(getSubscription());
    setDemoTrialMsLeft(getDemoTrialMsLeft());
  };

  const toggleDemoUnlockAll = (enabled: boolean) => {
    setDemoUnlockAll(enabled);
    setDemoUnlockAllState(enabled);
    setDemoTrialMsLeft(getDemoTrialMsLeft());
  };

  // The server owns this decision. If the account already holds any entitlement
  // row — a spent trial, a paid plan, an admin grant — nothing is written and the
  // grant it already has comes back. Re-reading rather than assuming a trial
  // started keeps one source of truth, and covers the native build, where the
  // server's answer and the device's may differ.
  const startTrial = async (): Promise<EntitlementTier> => {
    const next = await requestTrial();
    await refreshEntitlement();
    if (next !== 'none') setShowPaywall(false);
    return next;
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
    startTrial,
    webPremium,
    restoreWebAccess,
    premiumSource,
    entitlement,
    tier: tierOf(entitlement),
    serverPremium: entitlement !== null,
    checkingServerAccess,
    refreshEntitlement,
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
