import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

const ent = vi.hoisted(() => ({
  requestEmailCode: vi.fn(),
  verifyEmailCode: vi.fn(),
}));
vi.mock('@/lib/entitlement', () => ent);
vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  requestRestoreCode: vi.fn().mockResolvedValue(null),
  verifyRestoreCode: vi.fn(),
}));
// The server catalogue, mocked so no unit test constructs a real Supabase
// client; the fixture carries every plan in both currencies.
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

vi.mock('@/lib/appbuild/wrapper', () => ({
  waitForWrapper: () => Promise.resolve(null),
  isWrapperPresent: () => false,
  getPurchasesPlugin: () => null,
}));

const sub = vi.hoisted(() => ({
  startTrial: vi.fn(),
  refreshSubscription: vi.fn(),
  startSubscriptionCheckout: vi.fn(),
  pendingActivation: false,
  isPremium: false,
}));
vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({ ...sub, setShowPaywall: vi.fn() }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { PaywallModal } from './PaywallModal';

describe('PaywallModal trial entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders no close button when it cannot close', () => {
    render(<PaywallModal isOpen onSelectPlan={vi.fn()} />);
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('renders a close button when onClose is supplied', () => {
    const onClose = vi.fn();
    render(<PaywallModal isOpen onClose={onClose} onSelectPlan={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('starts the trial with an emailed code', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: true });
    sub.startTrial.mockResolvedValue('trial');
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'Someone@Example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Start my trial'));

    await waitFor(() => expect(ent.verifyEmailCode).toHaveBeenCalledWith('Someone@Example.com', '123456'));
    await waitFor(() => expect(sub.startTrial).toHaveBeenCalled());
  });

  it('does not start a trial when the code is rejected', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: false, message: 'That code was not accepted.' });
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '000000' } });
    fireEvent.click(screen.getByText('Start my trial'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/not accepted/i);
    expect(sub.startTrial).not.toHaveBeenCalled();
  });

  it('keeps the form usable when the code cannot be sent', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: false, message: 'That address was rejected.' });
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/rejected/i);
    // Still on the first step with the submit button live, so the address can be
    // corrected and retried; a failure that advanced or wedged the form would
    // strand the user with no way to get a code.
    expect(screen.queryByLabelText('One-time code')).toBeNull();
    expect(screen.getByText('Email me a code')).not.toBeDisabled();
  });

  it('leaves the code step retryable after a rejected code', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: false, message: 'That code was not accepted.' });
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '000000' } });
    fireEvent.click(screen.getByText('Start my trial'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/not accepted/i);
    // The field stays and the button comes back, so a mistyped code costs one
    // retry rather than a restart.
    expect(screen.getByLabelText('One-time code')).toBeTruthy();
    expect(screen.getByText('Start my trial')).not.toBeDisabled();
  });

  it('reports an already-used trial rather than appearing to succeed', async () => {
    ent.requestEmailCode.mockResolvedValue({ ok: true });
    ent.verifyEmailCode.mockResolvedValue({ ok: true });
    // The server refuses a second trial for an account that holds any row.
    sub.startTrial.mockResolvedValue('none');
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={vi.fn()} />);

    fireEvent.click(screen.getByText('Start 3-day trial'));
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Start my trial'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/already/i);
  });
});
