import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const maybeSingle = vi.hoisted(() => vi.fn());
const currentEntitlement = vi.hoisted(() => vi.fn());

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({ select: () => ({ order: () => ({ limit: () => ({ maybeSingle }) }) }) }),
  },
}));
vi.mock('@/lib/entitlement', () => ({ currentEntitlement }));

import CheckoutSuccess, {
  SUCCESS_POLL_BOUND_MS,
  SUCCESS_POLL_INTERVAL_MS,
} from './CheckoutSuccess';

const renderReceipt = () =>
  render(
    <MemoryRouter>
      <CheckoutSuccess />
    </MemoryRouter>,
  );

/** Let the mount read's promise chain settle while the fake clock stays put. */
const flush = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
};

/** Move the fake clock forward, flushing whatever the timers schedule. */
const advance = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

describe('CheckoutSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentEntitlement.mockResolvedValue(null);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('says activating while the webhook has not landed', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    // The Status row's value, not the prose: `findByText` throws when a query
    // matches more than one node.
    expect(await screen.findByText(/activating/i, { selector: 'dd' })).toBeTruthy();
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('says active once the server grants access', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });
    currentEntitlement.mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });
    renderReceipt();
    expect(await screen.findByText(/active/i, { selector: 'h1' })).toBeTruthy();
    expect(await screen.findByText(/₹2,999/)).toBeTruthy();
    // The receipt's plan label and renewal date: both helpers are module-local,
    // so this is their only coverage.
    expect(await screen.findByText('Premium — Yearly')).toBeTruthy();
    expect(await screen.findByText(/2030/)).toBeTruthy();
  });

  it('does not treat an active row as access when the server grants no entitlement', async () => {
    // The row records what Razorpay said; only the entitlement grants access.
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'active', current_period_end: '2030-01-01T00:00:00.000Z' },
      error: null,
    });
    currentEntitlement.mockResolvedValue(null);
    renderReceipt();
    expect((await screen.findAllByText(/activating/i)).length).toBeGreaterThan(0);
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('formats a USD amount from cents', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'monthly', currency: 'USD', amount: 299, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    expect(await screen.findByText('$2.99')).toBeTruthy();
  });

  it('says nothing when there is no subscription to show', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    renderReceipt();
    expect(await screen.findByText(/could not find/i)).toBeTruthy();
    // A witness for the read itself: the old receipt never consulted the server.
    expect(maybeSingle).toHaveBeenCalled();
  });

  it('leaves the checking state when the server read rejects', async () => {
    maybeSingle.mockRejectedValue(new Error('network'));
    currentEntitlement.mockResolvedValue(null);
    renderReceipt();
    expect(await screen.findByText(/could not find/i)).toBeTruthy();
  });

  it('never claims a failed payment for a subscription that is merely pending', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'monthly', currency: 'INR', amount: 29900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    await screen.findByText(/activating/i, { selector: 'dd' });
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });

  it('re-reads on its own and says active once the webhook lands', async () => {
    vi.useFakeTimers();
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'created', current_period_end: null },
      error: null,
    });
    // The mount read finds nothing; the next one, after one interval, finds the
    // grant the webhook wrote.
    currentEntitlement.mockResolvedValueOnce(null).mockResolvedValue({
      plan: 'yearly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false,
    });

    renderReceipt();
    await flush();
    expect(screen.getByRole('heading', { name: /payment received/i })).toBeTruthy();

    await advance(SUCCESS_POLL_INTERVAL_MS);

    expect(screen.getByRole('heading', { name: /subscription active/i })).toBeTruthy();
    expect(screen.queryByText(/this usually takes a few seconds/i)).toBeNull();
    // Granted: rendered exactly as before, with no account pointer.
    expect(screen.queryByRole('link', { name: /check your account/i })).toBeNull();
  });

  it('stops at the bound and points at the account page, without claiming failure', async () => {
    vi.useFakeTimers();
    maybeSingle.mockResolvedValue({
      data: { plan: 'monthly', currency: 'INR', amount: 29900, status: 'created', current_period_end: null },
      error: null,
    });
    currentEntitlement.mockResolvedValue(null);

    renderReceipt();
    await flush();
    expect(screen.getByRole('heading', { name: /payment received/i })).toBeTruthy();

    await advance(SUCCESS_POLL_BOUND_MS);

    expect(screen.getByText(/has not reached us yet/i)).toBeTruthy();
    const pointer = screen.getByRole('link', { name: /check your account/i });
    expect(pointer.getAttribute('href')).toBe('/account');
    // The buyer may well have paid; the bound is not a failure claim.
    expect(screen.queryByText(/fail/i)).toBeNull();
  });
});
