import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, waitFor, screen } from '@testing-library/react';

const ent = vi.hoisted(() => ({
  currentAuthUser: vi.fn(),
  serverEntitlement: vi.fn(),
  onAuthChange: vi.fn(),
  startTrial: vi.fn(),
}));
vi.mock('@/lib/entitlement', async (orig) => ({
  // `tierOf` stays real: stubbing it would let the context and the module it
  // derives its tier from disagree, which is the bug this test exists to catch.
  ...(await orig<typeof import('@/lib/entitlement')>()),
  currentAuthUser: ent.currentAuthUser,
  serverEntitlement: ent.serverEntitlement,
  onAuthChange: ent.onAuthChange,
  startTrial: ent.startTrial,
}));

import { useSubscription, SubscriptionProvider } from './SubscriptionContext';

let current: ReturnType<typeof useSubscription> | null = null;

const Probe = () => {
  current = useSubscription();
  return (
    <div>
      <span data-testid="tier">{current.tier}</span>
      <span data-testid="checking">{String(current.checkingServerAccess)}</span>
      <span data-testid="restart">{String('restartDemoTrial' in current)}</span>
    </div>
  );
};

const renderProbe = () =>
  render(
    <SubscriptionProvider>
      <Probe />
    </SubscriptionProvider>,
  );

describe('SubscriptionContext trial start', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ent.onAuthChange.mockReturnValue(() => {});
    ent.currentAuthUser.mockResolvedValue({ id: 'u1', email: 'someone@example.com' });
    ent.serverEntitlement.mockResolvedValue(null);
  });

  it('starts a trial through the server and adopts the tier it reports', async () => {
    // The grant appears only once the RPC has run. A tier of 'trial' at the end
    // can then only have come from the re-read after startTrial — not from the
    // mount read, which would make this test pass with startTrial doing nothing.
    let grant: unknown = null;
    ent.startTrial.mockImplementation(async () => {
      grant = {
        plan: 'demo',
        source: 'trial',
        expiresAt: '2026-10-11T00:00:00Z',
        permanent: false,
      };
      return 'trial';
    });
    ent.serverEntitlement.mockImplementation(async () => grant);

    renderProbe();
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    // Pins that the mount read really did see nothing, so the assertion below is
    // about the transition rather than a grant that was there all along.
    expect(screen.getByTestId('tier').textContent).toBe('none');

    let result: string | undefined;
    await act(async () => {
      result = await current!.startTrial();
    });

    expect(ent.startTrial).toHaveBeenCalled();
    expect(result).toBe('trial');
    await waitFor(() => expect(screen.getByTestId('tier').textContent).toBe('trial'));
  });

  it('stays at none when the server refuses a second trial', async () => {
    ent.startTrial.mockResolvedValue('none');
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));

    await act(async () => {
      await current!.startTrial();
    });

    expect(screen.getByTestId('tier').textContent).toBe('none');
  });

  it('no longer exposes the client-side restart', async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('checking').textContent).toBe('false'));
    expect(screen.getByTestId('restart').textContent).toBe('false');
  });
});
