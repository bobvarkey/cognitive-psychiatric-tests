import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// The App Store build: the wrapper is present, so the modal starts in native mode
// and the Razorpay path is never the one under test.
vi.mock('@/lib/appbuild/wrapper', () => ({
  waitForWrapper: () => Promise.resolve({ appInfo: { platform: 'ios' }, capabilities: {} }),
  isWrapperPresent: () => true,
  isNativeShell: () => true,
  isIOSDevice: () => false,
  mustUseStoreBilling: () => true,
  describeHost: () => 'ios',
  getPurchasesPlugin: () => ({}),
}));

const rc = vi.hoisted(() => ({
  configure: vi.fn(),
  getOfferings: vi.fn(),
  isNativePurchasesAvailable: vi.fn(),
}));

vi.mock('@/lib/appbuild/revenuecat', () => ({
  configure: rc.configure,
  getOfferings: rc.getOfferings,
  isNativePurchasesAvailable: rc.isNativePurchasesAvailable,
  purchasePackage: vi.fn(),
  restorePurchases: vi.fn(),
  getEntitlement: vi.fn(),
}));

vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  requestRestoreCode: vi.fn(),
  verifyRestoreCode: vi.fn(),
}));

const plans = vi.hoisted(() => [
  { code: 'monthly' as const, currency: 'INR' as const, amount: 29900, intervalUnit: 'month' as const, label: 'PsyCognito Premium — Monthly' },
  { code: 'yearly' as const, currency: 'INR' as const, amount: 299900, intervalUnit: 'year' as const, label: 'PsyCognito Premium — Yearly' },
]);
vi.mock('@/lib/billing', () => ({
  fallbackBillingPlans: () => plans,
  fetchBillingPlans: vi.fn().mockResolvedValue(plans),
}));

vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    refreshSubscription: vi.fn(),
    startTrial: vi.fn(),
    startSubscriptionCheckout: vi.fn(),
    pendingActivation: false,
    isPremium: false,
    entitlement: null,
  }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { PaywallModal } from './PaywallModal';

const yearlyPkg = {
  identifier: '$rc_annual',
  title: 'Yearly',
  priceString: '₹1,499.00',
  period: 'annual',
  raw: {},
};

const renderPaywall = () => render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

// Every assertion below is about an amount the store never sent, so the buyer's
// locale is pinned to the one whose web price would be the leak: ₹2,999.
const inrBuyer = () =>
  Object.defineProperty(window.navigator, 'language', { value: 'en-IN', configurable: true });

describe('PaywallModal native store pricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    inrBuyer();
    rc.configure.mockResolvedValue(true);
    rc.isNativePurchasesAvailable.mockReturnValue(true);
  });

  it('shows the wait rather than a price while the offerings are still arriving', async () => {
    // configure() no longer blocks for 25s, so this window is short — but it is
    // still a window, and an amount in it is a quote the store never made.
    rc.getOfferings.mockReturnValue(new Promise(() => {}));
    renderPaywall();

    expect(await screen.findByText(/Connecting to store/)).toBeTruthy();
    expect(screen.queryByText(/2,999/)).toBeNull();
  });

  it('never quotes the web catalogue when the store returns no packages', async () => {
    // The reported bug: configure timed out, getOfferings never ran, and the
    // ₹2,999 web yearly price appeared on a phone that had loaded no packages.
    rc.getOfferings.mockResolvedValue([]);
    renderPaywall();

    expect(await screen.findByText(/No plans are available/)).toBeTruthy();
    expect(screen.queryByText(/2,999/)).toBeNull();
    expect(screen.queryByText(/per year/)).toBeNull();
  });

  it("shows the store's own localized price once a package loads", async () => {
    rc.getOfferings.mockResolvedValue([yearlyPkg]);
    renderPaywall();

    expect(await screen.findByText(/Yearly plan · ₹1,499\.00 per year/)).toBeTruthy();
    expect(screen.queryByText(/2,999/)).toBeNull();
  });

  it('does not fall back to the web price for a package with no price string', async () => {
    rc.getOfferings.mockResolvedValue([{ ...yearlyPkg, priceString: '' }]);
    renderPaywall();

    await waitFor(() => expect(rc.getOfferings).toHaveBeenCalled());
    expect(screen.queryByText(/2,999/)).toBeNull();
    expect(screen.queryByText(/per year/)).toBeNull();
  });

  it('reports a bridge timeout as a store problem, not as the bridge text', async () => {
    rc.getOfferings.mockRejectedValue(
      new Error("Bridge request 'plugin:Purchases.getOfferings' timed out client-side after 25000ms")
    );
    renderPaywall();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/store could not be reached/i);
    expect(alert.textContent).not.toMatch(/Bridge request|25000ms/i);
  });

  it('keeps the store message when the store itself explains the failure', async () => {
    rc.getOfferings.mockRejectedValue(new Error('Invalid API key.'));
    renderPaywall();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Invalid API key.');
  });
});
