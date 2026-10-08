import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sub = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/contexts/SubscriptionContext', () => ({ useSubscription: () => sub.value }));

vi.mock('@/components/PaywallModal', () => ({
  // Faithful to the real component, which returns null when it is closed
  // (`PaywallModal.tsx:150`). A mock that rendered unconditionally would paint a
  // paywall frame over every granted owner — the on-demand modal is mounted
  // alongside `children` — and the "straight through" case could never pass.
  PaywallModal: ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <div data-testid="paywall">paywall</div> : null,
}));

import { AuthGuard } from './AuthGuard';

const setSub = (over: Record<string, unknown>) => {
  sub.value = {
    isPremium: false,
    demoTrialActive: false,
    showPaywall: false,
    setShowPaywall: vi.fn(),
    checkingServerAccess: false,
    ...over,
  };
};

describe('AuthGuard', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('shows neither the app nor the paywall while the server is still deciding', () => {
    setSub({ checkingServerAccess: true });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.queryByTestId('paywall')).toBeNull();
    expect(screen.queryByTestId('app')).toBeNull();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('shows the paywall once the answer is no', () => {
    setSub({ checkingServerAccess: false });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('paywall')).toBeTruthy();
    expect(screen.queryByTestId('app')).toBeNull();
  });

  it('lets a server-granted owner straight through, without a paywall frame', () => {
    setSub({ isPremium: true, checkingServerAccess: true });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('app')).toBeTruthy();
    expect(screen.queryByTestId('paywall')).toBeNull();
  });

  it('does not gate a public path', () => {
    window.history.pushState({}, '', '/terms');
    setSub({ checkingServerAccess: false });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );
    expect(screen.getByTestId('app')).toBeTruthy();
  });
});
