import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

// The server catalogue, mocked so no unit test constructs a real Supabase
// client. The fixture carries every plan in both currencies: the modal looks
// its amount up by `getWebCurrency()`, so a catalogue missing that currency
// would leave the price as an em dash.
const plans = vi.hoisted(() => [
  { code: 'monthly' as const, currency: 'INR' as const, amount: 29900, intervalUnit: 'month' as const, label: 'PsyCognito Premium — Monthly' },
  { code: 'yearly' as const, currency: 'INR' as const, amount: 299900, intervalUnit: 'year' as const, label: 'PsyCognito Premium — Yearly' },
  { code: 'monthly' as const, currency: 'USD' as const, amount: 299, intervalUnit: 'month' as const, label: 'PsyCognito Premium — Monthly' },
  { code: 'yearly' as const, currency: 'USD' as const, amount: 2499, intervalUnit: 'year' as const, label: 'PsyCognito Premium — Yearly' },
]);

const catalogue = vi.hoisted(() => ({ fetchBillingPlans: vi.fn() }));

vi.mock('@/lib/billing', () => ({
  fallbackBillingPlans: () => plans,
  fetchBillingPlans: catalogue.fetchBillingPlans,
}));

// Resolving to null and reporting no wrapper means "not the native build", so
// the web checkout path is the one under test.
vi.mock('@/lib/appbuild/wrapper', () => ({
  waitForWrapper: () => Promise.resolve(null),
  isWrapperPresent: () => false,
  getPurchasesPlugin: () => null,
}));

const checkout = vi.hoisted(() => ({ startSubscriptionCheckout: vi.fn() }));
const subscription = vi.hoisted(() => ({
  pendingActivation: false,
  isPremium: false,
  entitlement: null as null | {
    plan: string;
    source: string;
    expiresAt: string | null;
    permanent: boolean;
  },
}));

vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    startSubscriptionCheckout: checkout.startSubscriptionCheckout,
    pendingActivation: subscription.pendingActivation,
    isPremium: subscription.isPremium,
    entitlement: subscription.entitlement,
    startTrial: vi.fn(),
    refreshSubscription: vi.fn(),
  }),
}));

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

import { PaywallModal } from './PaywallModal';

const renderPaywall = (onClose: () => void = vi.fn()) =>
  render(<PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />);

const typeEmail = async (value: string) => {
  fireEvent.change(screen.getByLabelText('Email for your receipt'), { target: { value } });
};

const clickContinue = async () => {
  fireEvent.click(screen.getByText('Continue'));
  // The handler is async; wait for it to settle and the button to come back.
  await waitFor(() => expect(screen.getByText('Continue')).toBeTruthy());
};

describe('PaywallModal web checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    subscription.pendingActivation = false;
    subscription.isPremium = false;
    subscription.entitlement = null;
    // Pin the buyer's locale rather than inheriting whatever the runner has, so
    // the currency under test is the one this file reasons about.
    Object.defineProperty(window.navigator, 'language', { value: 'en-US', configurable: true });
    catalogue.fetchBillingPlans.mockResolvedValue(plans);
  });

  it('asks the context to start the subscription once the email is valid', async () => {
    checkout.startSubscriptionCheckout.mockResolvedValue(undefined);
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(checkout.startSubscriptionCheckout).toHaveBeenCalledWith('yearly', 'payer@example.com');
  });

  it('refuses to start without a valid email', async () => {
    renderPaywall();
    await typeEmail('not-an-email');
    await clickContinue();
    expect(checkout.startSubscriptionCheckout).not.toHaveBeenCalled();
  });

  it('shows activating only after a verified checkout, never unlocked', async () => {
    // The callback proves the payment is real. It does not prove the webhook
    // has landed, and this modal must not say that it has.
    checkout.startSubscriptionCheckout.mockImplementation(async () => {
      subscription.pendingActivation = true;
    });
    const onClose = vi.fn();
    const { rerender } = render(<PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />);
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.getByText(/activating/i)).toBeTruthy();

    // The poll ends without a grant, so the context clears its flag. The claim
    // "access was granted" would travel on a toast, not through this DOM (sonner
    // is mocked), so that is where the pin has to sit.
    subscription.pendingActivation = false;
    rerender(<PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />);
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith(expect.stringMatching(/activating/i)),
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('stays quiet when the buyer dismisses the modal', async () => {
    checkout.startSubscriptionCheckout.mockRejectedValue({ userCancelled: true });
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(toast.info).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('keeps the fallback amount when the server catalogue omits the buyer currency', async () => {
    // A partially seeded billing_plans table: the read succeeds but answers with
    // only USD, while this buyer is charged in INR. Replacing the catalogue
    // would blank the price to an em dash beside a live Continue button, which
    // is a charge the buyer authorized without ever being shown it (spec §9).
    Object.defineProperty(window.navigator, 'language', { value: 'en-IN', configurable: true });
    catalogue.fetchBillingPlans.mockResolvedValue(plans.filter((p) => p.currency === 'USD'));
    renderPaywall();
    await waitFor(() => expect(screen.getByText(/₹2,999 per year/)).toBeTruthy());
    expect(screen.queryByText(/Yearly plan · — per year/)).toBeNull();
  });

  it('confirms and closes when the checkout lands with access granted', async () => {
    checkout.startSubscriptionCheckout.mockImplementation(async () => {
      // The context polls, is granted, then clears its flag: the outcome is
      // granted, not pending. The grant is a server row, not a bare access bit.
      subscription.pendingActivation = true;
      subscription.entitlement = {
        plan: 'yearly',
        source: 'razorpay',
        expiresAt: '2030-01-01T00:00:00.000Z',
        permanent: false,
      };
      subscription.isPremium = true;
      subscription.pendingActivation = false;
    });
    const onClose = vi.fn();
    renderPaywall(onClose);
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(onClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Your subscription is active.');
    expect(toast.info).not.toHaveBeenCalled();
  });

  it('does not claim an active subscription for a trial buyer whose grant has not landed', async () => {
    // A demo-trial buyer is isPremium from the trial alone. Claiming "your
    // subscription is active" here would state something the server has not said.
    subscription.isPremium = true;
    subscription.entitlement = null;
    checkout.startSubscriptionCheckout.mockImplementation(async () => {
      subscription.pendingActivation = true;
    });
    const onClose = vi.fn();
    const view = () => <PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />;
    const { rerender } = render(view());
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.getByText(/activating/i)).toBeTruthy();

    // The poll ends without a grant, so the context clears its flag. A trial
    // buyer is premium either way; only the server's own answer may be claimed.
    subscription.pendingActivation = false;
    rerender(view());
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith(expect.stringMatching(/activating/i)),
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not dismiss itself for a buyer who has not checked out', () => {
    // A paid user opening the paywall from Settings is premium from the first
    // render; only a checkout this modal started may close it. A trial buyer
    // with no server grant is exactly that case: premium, but not subscribed.
    subscription.isPremium = true;
    subscription.entitlement = null;
    const onClose = vi.fn();
    renderPaywall(onClose);
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('does not report activating for a checkout dismissed before it resolved', async () => {
    let land: () => void = () => {};
    checkout.startSubscriptionCheckout.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          land = resolve;
        }),
    );
    const onClose = vi.fn();
    const view = (open: boolean) => (
      <PaywallModal isOpen={open} onClose={onClose} onSelectPlan={vi.fn()} />
    );
    const { rerender } = render(view(true));
    await typeEmail('payer@example.com');
    fireEvent.click(screen.getByText('Continue'));

    // Dismiss while the checkout is still in flight, then let it land with no
    // grant; the modal stays mounted with isOpen false.
    rerender(view(false));
    land();
    await waitFor(() => expect(checkout.startSubscriptionCheckout).toHaveBeenCalled());

    // Reopening must not announce a checkout that is no longer happening.
    rerender(view(true));
    await waitFor(() => expect(screen.getByText('Continue')).toBeTruthy());
    expect(toast.info).not.toHaveBeenCalled();
  });
});
