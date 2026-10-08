import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sub = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/contexts/SubscriptionContext', () => ({ useSubscription: () => sub.value }));

const auth = vi.hoisted(() => ({ currentAuthUser: vi.fn() }));
vi.mock('@/lib/entitlement', () => ({ currentAuthUser: auth.currentAuthUser }));

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
    auth.currentAuthUser.mockReset();
    auth.currentAuthUser.mockResolvedValue(null);
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

  it('shows the auth user id when the gate closes on a signed-in account', async () => {
    // Without this the owner cannot get in at all: access is an admin grant keyed
    // to this id, and the screen that normally reports it (Settings -> Account)
    // is behind this very gate, so the id has nowhere else to come from.
    setSub({ checkingServerAccess: false });
    auth.currentAuthUser.mockResolvedValue({
      id: '5ba70276-e265-4afb-84fb-fea80d335e8b',
      email: 'owner@example.com',
    });
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );

    expect(await screen.findByTestId('auth-user-id')).toHaveTextContent(
      '5ba70276-e265-4afb-84fb-fea80d335e8b',
    );
    // And says how to grant it, which is the other half of the requirement.
    expect(screen.getByText(/INSERT INTO public\.entitlements/)).toBeTruthy();
  });

  it('does not put an id on screen for a signed-out visitor', async () => {
    // Nobody is signed in, so there is no id to show and none may be invented —
    // a placeholder here could be copied into a grant by mistake.
    setSub({ checkingServerAccess: false });
    auth.currentAuthUser.mockResolvedValue(null);
    render(
      <AuthGuard>
        <div data-testid="app">app</div>
      </AuthGuard>,
    );

    expect(screen.getByTestId('paywall')).toBeTruthy();
    expect(screen.queryByTestId('auth-user-id')).toBeNull();
  });
});
