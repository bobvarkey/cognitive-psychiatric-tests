// Subscription Service - manages premium features and Stripe integration

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'trialing' | 'past_due';
  plan: 'monthly' | 'yearly';
  currentPeriodEnd: number;
  priceId: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  subscription?: Subscription;
  isPremium: boolean;
  lastUpdated: number;
}

const STORAGE_KEY = 'psycognito.subscription.v1';
const USER_KEY = 'psycognito.user.v1';

// Pricing configuration
export const PRICING = {
  lite: {
    yearly: {
      firstYear: 19.99,
      renewal: 16.99,
      currency: 'USD',
    },
    monthly: {
      firstYear: 2.99,
      currency: 'USD',
    },
  },
  pro: {
    yearly: {
      firstYear: 29.99,
      renewal: 19.99,
      currency: 'USD',
    },
    monthly: {
      firstYear: 3.99,
      currency: 'USD',
    },
  },
};

// Check if user has premium access
// Demo override: all tests unlocked for everyone
export const isPremiumUser = (): boolean => {
  return true;
};

// Get current user subscription
export const getSubscription = (): Subscription | null => {
  try {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    const userData: User = JSON.parse(user);
    return userData.subscription || null;
  } catch {
    return null;
  }
};

// Initialize subscription (typically after Stripe checkout)
export const initializeSubscription = (subscription: Subscription): void => {
  try {
    let user: User = {
      id: `user_${Date.now()}`,
      email: 'user@psycognito.local',
      subscription,
      isPremium: true,
      lastUpdated: Date.now(),
    };

    // Try to get existing user and update
    const existing = localStorage.getItem(USER_KEY);
    if (existing) {
      const existingUser: User = JSON.parse(existing);
      user.id = existingUser.id;
      user.email = existingUser.email;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('Failed to initialize subscription:', error);
  }
};

// Cancel subscription
export const cancelSubscription = (): void => {
  try {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      const userData: User = JSON.parse(user);
      if (userData.subscription) {
        userData.subscription.status = 'canceled';
        userData.isPremium = false;
        userData.lastUpdated = Date.now();
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
  }
};

// Get remaining days in subscription
export const getRemainingDays = (): number => {
  const subscription = getSubscription();
  if (!subscription) return 0;

  const now = Date.now() / 1000;
  const remainingSeconds = subscription.currentPeriodEnd - now;
  return Math.ceil(remainingSeconds / 86400); // Convert to days
};

// Stripe configuration
export const STRIPE_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  ENDPOINTS: {
    CREATE_CHECKOUT: '/api/create-checkout-session',
    RESTORE_PURCHASE: '/api/restore-purchase',
    CANCEL_SUBSCRIPTION: '/api/cancel-subscription',
  },
};

// Create Stripe checkout session
export const createCheckoutSession = async (
  plan: 'monthly' | 'yearly',
  email: string
): Promise<{ sessionId: string; url?: string }> => {
  try {
    const response = await fetch(STRIPE_CONFIG.ENDPOINTS.CREATE_CHECKOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// Demo subscription (for development/testing)
export const createDemoSubscription = (plan: 'monthly' | 'yearly', tier: 'lite' | 'pro' = 'lite'): void => {
  const now = Date.now() / 1000;
  const daysUntilExpire = plan === 'yearly' ? 365 : 30;

  const subscription: Subscription = {
    id: `sub_demo_${tier}_${Date.now()}`,
    status: 'active',
    plan,
    currentPeriodEnd: now + (daysUntilExpire * 86400),
    priceId: `price_${tier}_${plan}_demo`,
    createdAt: now,
  };

  initializeSubscription(subscription);
};

// Get premium features
export const getPremiumFeatures = () => {
  const isPremium = isPremiumUser();

  return {
    allAssessments: isPremium,
    exportToPDF: isPremium,
    exportToDOCX: isPremium,
    clinicalAnalytics: isPremium,
    patientTracking: isPremium,
    prioritySupport: isPremium,
    offlineSync: isPremium,
    bannerAdsDisabled: isPremium,
  };
};
