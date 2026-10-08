import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

const billing = vi.hoisted(() => ({
  requestRestoreCode: vi.fn(),
  verifyRestoreCode: vi.fn(),
}));

vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  requestRestoreCode: billing.requestRestoreCode,
  verifyRestoreCode: billing.verifyRestoreCode,
}));
vi.mock('@/lib/appbuild/wrapper', () => ({ waitForWrapper: () => Promise.resolve(null) }));
vi.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => ({
    refreshSubscription: vi.fn(),
    demoTrialActive: false,
    demoTrialMsLeft: 0,
  }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { PaywallModal } from './PaywallModal';

describe('PaywallModal website restore (one-time code)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('email -> code -> verified restore', async () => {
    billing.requestRestoreCode.mockResolvedValue(null);
    billing.verifyRestoreCode.mockResolvedValue({
      email: 'payer@example.com',
      plan: 'yearly',
      currentPeriodEnd: new Date(Date.now() + 86400_000).toISOString(),
    });
    const onSelectPlan = vi.fn();
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={onSelectPlan} />);

    fireEvent.click(screen.getByText('Restore access'));
    fireEvent.change(screen.getByLabelText('Email you paid with'), { target: { value: 'Payer@Example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    await waitFor(() => expect(billing.requestRestoreCode).toHaveBeenCalledWith('payer@example.com'));

    const codeInput = await screen.findByLabelText('One-time code');
    expect(screen.getByText(/Resend code in \d+s/)).toBeTruthy();
    fireEvent.change(codeInput, { target: { value: '12 34-56' } });
    expect((codeInput as HTMLInputElement).value).toBe('123456');
    fireEvent.click(screen.getByText('Verify & restore'));

    await waitFor(() => expect(billing.verifyRestoreCode).toHaveBeenCalledWith('Payer@Example.com', '123456'));
    await waitFor(() => expect(onSelectPlan).toHaveBeenCalledWith('yearly', 'pro'));
  });

  it('wrong code shows an error and does not unlock', async () => {
    billing.requestRestoreCode.mockResolvedValue(null);
    billing.verifyRestoreCode.mockRejectedValue(new Error('That code is invalid or has expired. Request a new one.'));
    const onSelectPlan = vi.fn();
    render(<PaywallModal isOpen onClose={vi.fn()} onSelectPlan={onSelectPlan} />);

    fireEvent.click(screen.getByText('Restore access'));
    fireEvent.change(screen.getByLabelText('Email you paid with'), { target: { value: 'payer@example.com' } });
    fireEvent.click(screen.getByText('Email me a code'));
    fireEvent.change(await screen.findByLabelText('One-time code'), { target: { value: '000000' } });
    fireEvent.click(screen.getByText('Verify & restore'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid or has expired/);
    expect(onSelectPlan).not.toHaveBeenCalled();
  });
});
