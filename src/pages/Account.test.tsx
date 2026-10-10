import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import type { BillingPlan } from '@/lib/billing';

const requestEmailCode = vi.hoisted(() => vi.fn());
const verifyEmailCode = vi.hoisted(() => vi.fn());
const currentAuthUser = vi.hoisted(() => vi.fn());
const serverEntitlement = vi.hoisted(() => vi.fn());
const onAuthChange = vi.hoisted(() => vi.fn(() => () => {}));
const cancelSubscription = vi.hoisted(() => vi.fn());
const fetchBillingPlans = vi.hoisted(() => vi.fn());
// The currency is pinned directly. `getWebCurrency()` reads the locale *and* the
// timezone, and this runner's zone is Asia/Calcutta, so the timezone branch wins
// and mocking `navigator.language` cannot force USD.
const getWebCurrency = vi.hoisted(() => vi.fn(() => 'INR'));

// The newest `subscriptions` row, read under RLS. Defaults to none — most tests
// have no subscription behind them — and each case that needs one sets it.
const maybeSingle = vi.hoisted(() => vi.fn());

// The catalogue the server is seeded with (Task 1's migration), in both
// currencies — the checked-in fallback the page starts from.
const FALLBACK_PLANS = vi.hoisted(
  (): BillingPlan[] => [
    { code: 'monthly', currency: 'INR', amount: 29900, intervalUnit: 'month', label: 'PsyCognito Premium — Monthly' },
    { code: 'yearly', currency: 'INR', amount: 299900, intervalUnit: 'year', label: 'PsyCognito Premium — Yearly' },
    { code: 'monthly', currency: 'USD', amount: 299, intervalUnit: 'month', label: 'PsyCognito Premium — Monthly' },
    { code: 'yearly', currency: 'USD', amount: 2499, intervalUnit: 'year', label: 'PsyCognito Premium — Yearly' },
  ],
);

const INR_PLANS = vi.hoisted(
  (): BillingPlan[] => [
    { code: 'monthly', currency: 'INR', amount: 29900, intervalUnit: 'month', label: 'PsyCognito Premium — Monthly' },
    { code: 'yearly', currency: 'INR', amount: 299900, intervalUnit: 'year', label: 'PsyCognito Premium — Yearly' },
  ],
);

vi.mock('@/lib/entitlement', () => ({
  requestEmailCode,
  verifyEmailCode,
  currentAuthUser,
  serverEntitlement,
  onAuthChange,
}));
vi.mock('@/lib/billing', () => ({
  cancelSubscription,
  fetchBillingPlans,
  fallbackBillingPlans: () => FALLBACK_PLANS,
}));
vi.mock('@/lib/webBilling', () => ({ getWebCurrency }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({ select: () => ({ order: () => ({ limit: () => ({ maybeSingle }) }) }) }),
  },
}));

import Account from './Account';

const renderPage = () =>
  render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>,
  );

describe('Account', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentAuthUser.mockResolvedValue(null);
    serverEntitlement.mockResolvedValue(null);
    fetchBillingPlans.mockResolvedValue(INR_PLANS);
    getWebCurrency.mockReturnValue('INR');
    cancelSubscription.mockResolvedValue(undefined);
    maybeSingle.mockResolvedValue({ data: null, error: null });
  });

  it('offers email sign-in when signed out', async () => {
    renderPage();
    expect(await screen.findByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /email me a code/i })).toBeTruthy();
  });

  it('signs in with a one-time code and then shows the account id', async () => {
    requestEmailCode.mockResolvedValue({ ok: true });
    verifyEmailCode.mockResolvedValue({ ok: true });
    // Signed out on mount, signed in only after the code is verified: the first
    // session read has to come back null or the page renders the signed-in view
    // at mount and there is no email field to type into.
    currentAuthUser
      .mockResolvedValueOnce(null)
      .mockResolvedValue({ id: '5ba70276-0000-0000-0000-000000000000', email: 'owner@example.com' });

    renderPage();
    await userEvent.type(await screen.findByLabelText(/email/i), 'owner@example.com');
    await userEvent.click(screen.getByRole('button', { name: /email me a code/i }));
    await userEvent.type(await screen.findByLabelText(/code/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    expect(await screen.findByText('5ba70276-0000-0000-0000-000000000000')).toBeTruthy();
  });

  it('shows no manage-billing controls for a developer grant', async () => {
    // A cancel button on an admin grant would be a lie: there is no
    // subscription behind it to cancel.
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'owner@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'developer', source: 'admin', expiresAt: null, permanent: true,
    });

    renderPage();
    // Exact match, not /developer/i: the account-id card's copy ("Developer access
    // is granted to this id by an administrator") also contains the word.
    await waitFor(() => expect(screen.getByText('developer')).toBeTruthy());
    expect(screen.queryByRole('button', { name: /cancel subscription/i })).toBeNull();
  });

  it('shows the renewal date and amount for a paid plan', async () => {
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay',
      expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    // Widened for the gate move: the Cancel control now keys on the
    // `subscriptions` row being *active*, not merely on the source being
    // razorpay, so this test has to say what the row holds.
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });

    renderPage();
    expect(await screen.findByText(/2030/)).toBeTruthy();
    expect(await screen.findByText(/2,999/)).toBeTruthy();
    expect(await screen.findByRole('button', { name: /cancel subscription/i })).toBeTruthy();
  });

  it('shows the amount for a buyer whose currency is not INR', async () => {
    // The checkout charges in the buyer's currency; an account page that only
    // looks up rupees shows this buyer no amount at all.
    getWebCurrency.mockReturnValue('USD');
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    fetchBillingPlans.mockResolvedValue([
      { code: 'yearly', currency: 'USD', amount: 249900, intervalUnit: 'year', label: 'Yearly' },
    ]);

    renderPage();

    expect(await screen.findByText(/2,499/)).toBeTruthy();
  });

  it('does not claim a payment failed when the cancel call fails', async () => {
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    cancelSubscription.mockRejectedValue(new Error('Could not cancel the subscription.'));
    // Widened for the same reason as the renewal test: the button this test
    // clicks is gated on an active subscription row.
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });

    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: /cancel subscription/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not cancel/i);
  });

  it('tells a halted buyer their last payment did not go through, with no cancel control', async () => {
    // The webhook leaves the entitlement row in place when a charge fails, so
    // access still runs to the period end. Offering "Cancel subscription" to
    // someone whose mandate is halted calls `billing-cancel`, which finds no
    // active row and 400s — and hides the recovery the spec requires.
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', status: 'halted', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/did not go through/i);
    expect(screen.queryByRole('button', { name: /cancel subscription/i })).toBeNull();
  });

  it('says a cancelled subscription runs to the period end, with no cancel control', async () => {
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', status: 'cancelled', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });

    renderPage();

    expect(await screen.findByText(/subscription is cancelled/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /cancel subscription/i })).toBeNull();
  });

  it('keeps the cancel control for an active subscription', async () => {
    // A pin, not a witness: it passes before this change too, because the old
    // gate was the razorpay source alone. It guards the gate that just moved.
    currentAuthUser.mockResolvedValue({ id: 'u1', email: 'payer@example.com' });
    serverEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });

    renderPage();

    expect(await screen.findByRole('button', { name: /cancel subscription/i })).toBeTruthy();
  });
});
