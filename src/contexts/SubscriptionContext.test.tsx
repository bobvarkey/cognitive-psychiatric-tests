import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ent = vi.hoisted(() => ({
  currentAuthUser: vi.fn(),
  serverEntitlement: vi.fn(),
  onAuthChange: vi.fn(),
}));
vi.mock('@/lib/entitlement', async (orig) => ({
  // `tierOf` is pure, so the real one is used rather than a stub — stubbing it
  // would let the context and the module it derives from disagree.
  ...(await orig<typeof import('@/lib/entitlement')>()),
  currentAuthUser: ent.currentAuthUser,
  serverEntitlement: ent.serverEntitlement,
  onAuthChange: ent.onAuthChange,
}));

const GRANT = { plan: 'developer', source: 'admin', expiresAt: null, permanent: true } as const;

vi.mock('@/services/subscriptionService', () => ({
  createDemoSubscription: vi.fn(),
  setDemoUnlockAll: vi.fn(),
  getDemoUnlockAll: () => false,
  getDemoTrialMsLeft: () => 0,
  DEMO_TRIAL_DAYS: 3,
  isPremiumUser: () => false,
  isDemoTrialActive: () => false,
  getPremiumFeatures: () => ({}),
  getSubscription: () => null,
}));

vi.mock('@/lib/webBilling', () => ({
  completeRestoreFromEmailLink: () => Promise.resolve(null),
  getWebPremium: () => null,
  restoreWebPurchase: vi.fn(),
  restoreWebPurchaseForSession: () => Promise.resolve(null),
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }));

import { SubscriptionProvider, useSubscription } from './SubscriptionContext';

const Probe = () => {
  const { isPremium, premiumSource, serverPremium, checkingServerAccess } = useSubscription();
  return (
    <div>
      <span data-testid="premium">{String(isPremium)}</span>
      <span data-testid="source">{premiumSource}</span>
      <span data-testid="server">{String(serverPremium)}</span>
      <span data-testid="checking">{String(checkingServerAccess)}</span>
    </div>
  );
};

let listeners: Array<() => void> = [];

describe('SubscriptionContext server access', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listeners = [];
    ent.onAuthChange.mockImplementation((cb: () => void) => {
      listeners.push(cb);
      return () => {};
    });
    ent.currentAuthUser.mockResolvedValue({ id: 'u1', email: 'owner@example.com' });
    ent.serverEntitlement.mockResolvedValue(GRANT);
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('grants premium from the server alone and reports the source', async () => {
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('true'));
    expect(screen.getByTestId('source').textContent).toBe('developer');
  });

  it('reports a trial grant as the demo source, never as developer', async () => {
    // The whole point: a trial is a grant, but it must not read as a paid plan —
    // the trial unlocks a subset of the assessments, a paid plan all of them.
    ent.serverEntitlement.mockResolvedValue({
      plan: 'demo',
      source: 'trial',
      expiresAt: '2026-10-11T00:00:00Z',
      permanent: false,
    });
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(screen.getByTestId('source').textContent).toBe('demo');
  });

  it('reports checking on first render and stops once the answer lands', async () => {
    ent.serverEntitlement.mockResolvedValue(null);
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    expect(screen.getByTestId('checking').textContent).toBe('true');
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
  });

  it('clears server access on sign-out', async () => {
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('true'));

    ent.currentAuthUser.mockResolvedValue(null);
    ent.serverEntitlement.mockResolvedValue(null);
    await act(async () => {
      listeners.forEach((cb) => cb());
    });

    await waitFor(() => expect(screen.getByTestId('premium').textContent).toBe('false'));
    expect(screen.getByTestId('source').textContent).toBe('none');
  });

  it('does not ask the server when nobody is signed in', async () => {
    ent.currentAuthUser.mockResolvedValue(null);
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(ent.serverEntitlement).not.toHaveBeenCalled();
  });

  it('clears the gate when the session read never settles', async () => {
    // The session read is a network call too — auth-js refreshes an expiring
    // token with an unbounded retrying fetch. Bounding only the RPC would leave
    // this await unbounded, and the app on a full-screen spinner forever.
    vi.useFakeTimers();
    ent.currentAuthUser.mockReturnValue(new Promise(() => {}));
    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );
    expect(screen.getByTestId('checking').textContent).toBe('true');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(screen.getByTestId('checking').textContent).toBe('false');
    expect(screen.getByTestId('premium').textContent).toBe('false');
  });

  it('keeps the newest answer when two checks overlap', async () => {
    let releaseSlow: (v: unknown) => void = () => {};
    ent.serverEntitlement
      .mockImplementationOnce(() => new Promise((r) => { releaseSlow = r; }))
      .mockResolvedValueOnce(null);

    render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>,
    );

    // Second check (signed out) resolves first; the first must not overwrite it.
    ent.currentAuthUser.mockResolvedValue(null);
    await act(async () => {
      listeners.forEach((cb) => cb());
    });
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    await act(async () => {
      releaseSlow(GRANT);
    });

    expect(screen.getByTestId('server').textContent).toBe('false');
  });
});
