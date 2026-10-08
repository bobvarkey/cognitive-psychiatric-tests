import { beforeEach, describe, expect, it, vi } from 'vitest';

const sb = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: sb.rpc, auth: {} },
}));

const native = vi.hoisted(() => ({ isNativeApp: vi.fn() }));
vi.mock('@/lib/appbuild/revenuecat', () => ({ isNativeApp: native.isNativeApp }));

import { currentEntitlement, entitlementTier, serverEntitlement, serverPremium, startTrial } from './entitlement';

const row = (over: Partial<Record<string, unknown>> = {}) => ({
  plan: 'developer',
  source: 'admin',
  expires_at: null,
  permanent: true,
  ...over,
});

describe('currentEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    native.isNativeApp.mockResolvedValue(false);
  });

  it('maps a returned row to camelCase', async () => {
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await currentEntitlement()).toEqual({
      plan: 'developer',
      source: 'admin',
      expiresAt: null,
      permanent: true,
    });
    expect(sb.rpc).toHaveBeenCalledWith('current_entitlement');
  });

  it('is null when the RPC errors', async () => {
    sb.rpc.mockResolvedValue({ data: null, error: { message: 'permission denied' } });
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the function returns no rows', async () => {
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the RPC rejects outright', async () => {
    sb.rpc.mockRejectedValue(new Error('network down'));
    expect(await currentEntitlement()).toBeNull();
  });

  it('is null when the request hangs, rather than hanging the caller', async () => {
    vi.useFakeTimers();
    sb.rpc.mockReturnValue(new Promise(() => {}));
    const pending = currentEntitlement();
    await vi.advanceTimersByTimeAsync(5000);
    await expect(pending).resolves.toBeNull();
  });
});

describe('serverPremium', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('is false with no grant', async () => {
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await serverPremium()).toBe(false);
  });

  it('honours an admin grant in a browser', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await serverPremium()).toBe(true);
  });

  it('suppresses an admin grant inside the native app', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await serverPremium()).toBe(false);
  });

  it('does not suppress a paid grant inside the native app', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({
      data: [row({ plan: 'yearly', source: 'razorpay', permanent: false })],
      error: null,
    });
    expect(await serverPremium()).toBe(true);
  });

  it('does not consult native-ness when there is no grant', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await serverPremium()).toBe(false);
    expect(native.isNativeApp).not.toHaveBeenCalled();
  });
});

describe('serverEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('keeps the source visible, so a trial can be told from a paid plan', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({
      data: [row({ plan: 'demo', source: 'trial', permanent: false, expires_at: '2026-10-11T00:00:00Z' })],
      error: null,
    });
    const ent = await serverEntitlement();
    expect(ent?.source).toBe('trial');
    expect(ent?.plan).toBe('demo');
    expect(ent?.permanent).toBe(false);
  });

  it('is null, not merely falsy, when an admin grant is suppressed on native', async () => {
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await serverEntitlement()).toBeNull();
  });
});

describe('entitlementTier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('is none with no grant', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({ data: [], error: null });
    expect(await entitlementTier()).toBe('none');
  });

  it('is full for a paid grant', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({
      data: [row({ plan: 'yearly', source: 'razorpay', permanent: false })],
      error: null,
    });
    expect(await entitlementTier()).toBe('full');
  });

  it('is trial for a trial grant', async () => {
    native.isNativeApp.mockResolvedValue(false);
    sb.rpc.mockResolvedValue({
      data: [row({ plan: 'demo', source: 'trial', permanent: false })],
      error: null,
    });
    expect(await entitlementTier()).toBe('trial');
  });

  it('is none for an admin grant inside the native app', async () => {
    // The whole reason the tier is derived rather than asked for. Asking
    // `entitlement_tier()` directly would answer 'full' here.
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockResolvedValue({ data: [row()], error: null });
    expect(await entitlementTier()).toBe('none');
  });

  it('derives its answer instead of asking the collapsing RPC', async () => {
    // The test above cannot catch a tier that asks `entitlement_tier()`
    // directly: that mock answers every RPC with the same row array, which the
    // old `asTier` collapsed to 'none' anyway. So the backend's real answer is
    // routed here instead — 'full' for an admin comp, because the SQL collapses
    // `source` and cannot see the comp it is honouring.
    native.isNativeApp.mockResolvedValue(true);
    sb.rpc.mockImplementation((fn: string) =>
      Promise.resolve(
        fn === 'entitlement_tier'
          ? { data: 'full', error: null }
          : { data: [row()], error: null },
      ),
    );
    expect(await entitlementTier()).toBe('none');
  });
});

describe('startTrial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    native.isNativeApp.mockResolvedValue(false);
  });

  it('re-reads the grant rather than trusting the returned string', async () => {
    sb.rpc.mockImplementation((fn: string) =>
      Promise.resolve(
        fn === 'start_trial'
          ? { data: 'trial', error: null }
          : { data: [row({ plan: 'demo', source: 'trial', permanent: false })], error: null },
      ),
    );
    expect(await startTrial()).toBe('trial');
    expect(sb.rpc).toHaveBeenCalledWith('start_trial');
    expect(sb.rpc).toHaveBeenCalledWith('current_entitlement');
  });

  it('is none when the trial cannot be started', async () => {
    sb.rpc.mockResolvedValue({ data: null, error: { message: 'not authenticated' } });
    expect(await startTrial()).toBe('none');
  });
});
