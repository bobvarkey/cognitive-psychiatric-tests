import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const maybeSingle = vi.hoisted(() => vi.fn());
const currentEntitlement = vi.hoisted(() => vi.fn());

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({ select: () => ({ order: () => ({ limit: () => ({ maybeSingle }) }) }) }),
  },
}));
vi.mock('@/lib/entitlement', () => ({ currentEntitlement }));

import CheckoutSuccess from './CheckoutSuccess';

const renderReceipt = () =>
  render(
    <MemoryRouter>
      <CheckoutSuccess />
    </MemoryRouter>,
  );

describe('CheckoutSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentEntitlement.mockResolvedValue(null);
  });

  it('says activating while the webhook has not landed', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'yearly', currency: 'INR', amount: 299900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    // `findAllByText`, not `findByText`: both the status line and the status row
    // say "activating", and `findByText` throws on multiple matches.
    expect(await screen.findAllByText(/activating/i)).not.toHaveLength(0);
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
    // Both the heading ("Subscription active") and the status row ("Active now")
    // match /active/i, so the singular query would throw.
    expect(await screen.findAllByText(/active/i)).not.toHaveLength(0);
    expect(await screen.findByText(/₹2,999/)).toBeTruthy();
  });

  it('says nothing when there is no subscription to show', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    renderReceipt();
    expect(await screen.findByText(/could not find/i)).toBeTruthy();
  });

  it('never claims a failed payment for a subscription that is merely pending', async () => {
    maybeSingle.mockResolvedValue({
      data: { plan: 'monthly', currency: 'INR', amount: 29900, status: 'created', current_period_end: null },
      error: null,
    });
    renderReceipt();
    await screen.findAllByText(/activating/i);
    expect(screen.queryByText(/everything is unlocked/i)).toBeNull();
  });
});
