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

vi.mock('@/lib/billing', () => ({
  fallbackBillingPlans: () => plans,
  fetchBillingPlans: vi.fn().mockResolvedValue(plans),
}));

// Resolving to null and reporting no wrapper means "not the native build", so
// the web checkout path is the one under test.
vi.mock('@/lib/appbuild/wrapper', () => ({
  waitForWrapper: () => Promise.resolve(null),
  isWrapperPresent: () => false,
  getPurchasesPlugin: () => null,
}));

const checkout = vi.hoisted(() => ({ startSubscriptionCheckout: vi.fn() }));
const subscription = vi.hoisted(() => ({ pendingActivation: false }));

vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    startSubscriptionCheckout: checkout.startSubscriptionCheckout,
    pendingActivation: subscription.pendingActivation,
    isPremium: false,
    startTrial: vi.fn(),
    refreshSubscription: vi.fn(),
  }),
}));

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

import { PaywallModal } from './PaywallModal';

const renderPaywall = () =>
  render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

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
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.getByText(/activating/i)).toBeTruthy();
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('stays quiet when the buyer dismisses the modal', async () => {
    checkout.startSubscriptionCheckout.mockRejectedValue({ userCancelled: true });
    renderPaywall();
    await typeEmail('payer@example.com');
    await clickContinue();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
