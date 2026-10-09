import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

const billing = vi.hoisted(() => ({ startWebCheckout: vi.fn() }));
vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  startWebCheckout: billing.startWebCheckout,
}));
// Resolving to null means "not the native wrapper", so the web path is taken.
vi.mock('@/lib/appbuild/wrapper', () => ({ waitForWrapper: () => Promise.resolve(null) }));

const sub = vi.hoisted(() => ({ startTrial: vi.fn(), refreshSubscription: vi.fn() }));
vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({ ...sub, setShowPaywall: vi.fn() }),
}));

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

import { PaywallModal } from './PaywallModal';

// `window.location.assign` is not implemented in jsdom, and the modal navigates
// with it because it renders outside the router (AuthGuard wraps BrowserRouter,
// not the other way round). Capture the destination instead of navigating.
const assign = vi.fn();

const premium = (over: Record<string, unknown> = {}) => ({
  email: 'buyer@example.com',
  plan: 'yearly',
  currentPeriodEnd: new Date(Date.now() + 365 * 86400 * 1000).toISOString(),
  ...over,
});

const buy = async () => {
  render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);
  fireEvent.change(screen.getByLabelText('Email for your receipt'), {
    target: { value: 'buyer@example.com' },
  });
  fireEvent.click(screen.getByText('Continue'));
};

describe('PaywallModal web checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { assign, href: '/', pathname: '/', search: '' },
    });
  });

  it('hands the buyer to the receipt page for the order they just paid', async () => {
    billing.startWebCheckout.mockResolvedValue(premium({ orderId: 'order_abc' }));
    await buy();

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('/checkout/success?order=order_abc'),
    );
  });

  it('escapes an order id that would otherwise break out of the query string', async () => {
    billing.startWebCheckout.mockResolvedValue(premium({ orderId: 'order_a&b=c' }));
    await buy();

    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('/checkout/success?order=order_a%26b%3Dc'),
    );
  });

  it('keeps the toast when there is no order to point at', async () => {
    // A restored purchase has no order id, so there is no receipt to open.
    billing.startWebCheckout.mockResolvedValue(premium());
    await buy();

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/payment successful/i)));
    expect(assign).not.toHaveBeenCalled();
  });

  it('still reports the chosen plan to its parent', async () => {
    billing.startWebCheckout.mockResolvedValue(premium({ orderId: 'order_abc' }));
    const onSelectPlan = vi.fn();
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={onSelectPlan} />);
    fireEvent.change(screen.getByLabelText('Email for your receipt'), {
      target: { value: 'buyer@example.com' },
    });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => expect(onSelectPlan).toHaveBeenCalledWith('yearly', 'pro'));
  });
});
