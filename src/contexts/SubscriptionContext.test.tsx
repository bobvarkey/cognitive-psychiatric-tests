import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Entitlement } from '@/lib/entitlement';
import { getWebCurrency } from '@/lib/webBilling';

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

const billing = vi.hoisted(() => ({
  startSubscription: vi.fn(),
  openCheckout: vi.fn(),
  verifyCheckout: vi.fn(),
  waitForEntitlement: vi.fn(),
  cancelSubscription: vi.fn(),
}));
// Mocked so `startSubscriptionCheckout` does not reach the network through the
// real module — and so the one thing the browser is allowed to send can be
// asserted on.
vi.mock('@/lib/billing', () => ({
  startSubscription: billing.startSubscription,
  openCheckout: billing.openCheckout,
  verifyCheckout: billing.verifyCheckout,
  waitForEntitlement: billing.waitForEntitlement,
  cancelSubscription: billing.cancelSubscription,
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

const wb = vi.hoisted(() => ({
  isDevUnlocked: vi.fn(() => false),
}));

// `importOriginal` rather than a hand-written factory: the real `getWebPremium`
// reads `localStorage`, and a stub would make the record test prove nothing
// about its own name. Only the dev unlock and the restore call are stubbed.
vi.mock('@/lib/webBilling', async (orig) => ({
  ...(await orig<typeof import('@/lib/webBilling')>()),
  completeRestoreFromEmailLink: () => Promise.resolve(null),
  restoreWebPurchase: vi.fn(),
  isDevUnlocked: wb.isDevUnlocked,
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

/**
 * Mount the provider through `renderHook` so a test can read the context value
 * and call its actions — the `<Probe/>` above cannot expose `result.current`.
 */
const renderContext = (opts: { entitlement?: Entitlement | null; pending?: boolean } = {}) => {
  if ('entitlement' in opts) ent.serverEntitlement.mockResolvedValue(opts.entitlement ?? null);
  if (opts.pending) {
    // A never-settling session read, not a stubbed RPC: `refreshEntitlement`
    // awaits `currentAuthUser()` first, so stubbing the RPC would close the gate
    // for the wrong reason.
    ent.currentAuthUser.mockReturnValue(new Promise(() => {}));
  }
  return renderHook(() => useSubscription(), { wrapper: SubscriptionProvider });
};

/** Point the mocked server grant at `v`, as a later answer would. */
const setEntitlement = (v: Entitlement | null) => ent.serverEntitlement.mockResolvedValue(v);

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
    // `clearAllMocks` clears calls, not implementations, so the dev unlock is
    // re-armed here: no test may start dev-unlocked by accident.
    wb.isDevUnlocked.mockReturnValue(false);
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    // Without this, the record a test writes into `localStorage` leaks into the
    // later tests in this file that assert the gate stays closed.
    localStorage.clear();
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

  it('does not treat a stored WebPremium record as access', async () => {
    // The record is now the dev unlock's own store, nothing more. A paid
    // account lives in `entitlements`, and only the server may write one.
    localStorage.setItem(
      'psycognito.webPremium.v1',
      JSON.stringify({
        email: 'payer@example.com',
        plan: 'yearly',
        currentPeriodEnd: new Date(Date.now() + 86400000).toISOString(),
        orderId: 'order_paid',
      }),
    );

    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));

    expect(result.current.isPremium).toBe(false);
    expect(result.current.premiumSource).not.toBe('web');
  });

  it('treats a server grant as access', async () => {
    const { result } = renderContext({
      entitlement: { plan: 'monthly', source: 'razorpay', expiresAt: null, permanent: false },
    });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(result.current.premiumSource).toBe('web');
  });

  it('treats an admin grant as the developer source', async () => {
    const { result } = renderContext({
      entitlement: { plan: 'developer', source: 'admin', expiresAt: null, permanent: true },
    });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
    expect(result.current.premiumSource).toBe('developer');
  });

  it('stays locked while the server is still being asked', async () => {
    const { result } = renderContext({ entitlement: null, pending: true });
    expect(result.current.checkingServerAccess).toBe(true);
    expect(result.current.isPremium).toBe(false);
  });

  it('goes from locked to unlocked without a manual refresh', async () => {
    // This is the whole point of polling after checkout. A buyer who has paid
    // must not have to reload the page to get in.
    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));
    expect(result.current.isPremium).toBe(false);

    setEntitlement({ plan: 'yearly', source: 'razorpay', expiresAt: null, permanent: false });
    await result.current.refreshEntitlement();

    await waitFor(() => expect(result.current.isPremium).toBe(true));
  });

  it('asks the server for a subscription with only the plan and the currency', async () => {
    // The Global Constraint: the browser may name a plan and a currency, and
    // nothing else. The email goes to the checkout modal; the amount, the plan
    // id and who is paying all come from the server.
    billing.startSubscription.mockResolvedValue({
      subscriptionId: 'sub_1',
      keyId: 'rzp_test_key',
      amount: 299900,
      currency: 'INR',
      label: 'PsyCognito Premium — Yearly',
    });
    billing.openCheckout.mockResolvedValue({
      paymentId: 'pay_1',
      subscriptionId: 'sub_1',
      signature: 'sig',
    });
    billing.verifyCheckout.mockResolvedValue(undefined);
    billing.waitForEntitlement.mockResolvedValue(null);

    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));

    await act(async () => {
      await result.current.startSubscriptionCheckout('yearly', 'buyer@example.com');
    });

    expect(billing.startSubscription).toHaveBeenCalledWith('yearly', getWebCurrency());
  });

  it('picks up a dev unlock written after mount, without a reload', async () => {
    // The dev-only developer unlock is written on the device by the restore flow
    // (and announced by a browser event the context no longer listens for). If
    // the context only reads it at mount, a developer who restores in this
    // session is toasted "unlocked" while the app stays locked until a reload —
    // a false success. `refreshSubscription` is the seam that keeps it live.
    const { result } = renderContext({ entitlement: null });
    await waitFor(() => expect(result.current.checkingServerAccess).toBe(false));
    expect(result.current.devUnlocked).toBe(false);
    expect(result.current.isPremium).toBe(false);

    // The write lands after the provider has already mounted.
    wb.isDevUnlocked.mockReturnValue(true);
    await act(async () => {
      result.current.refreshSubscription();
    });

    expect(result.current.devUnlocked).toBe(true);
    expect(result.current.isPremium).toBe(true);
    expect(result.current.premiumSource).toBe('developer');
  });
});
