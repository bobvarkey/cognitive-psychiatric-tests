import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const wrapper = vi.hoisted(() => ({
  waitForWrapper: vi.fn(),
  isWrapperPresent: vi.fn(),
  getPurchasesPlugin: vi.fn(),
  waitForPurchasesPlugin: vi.fn(),
}));

vi.mock('./wrapper', () => ({
  waitForWrapper: wrapper.waitForWrapper,
  isWrapperPresent: wrapper.isWrapperPresent,
  getPurchasesPlugin: wrapper.getPurchasesPlugin,
  waitForPurchasesPlugin: wrapper.waitForPurchasesPlugin,
}));

const IOS = { appInfo: { platform: 'ios' }, capabilities: {} };

describe('isNativeApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    wrapper.getPurchasesPlugin.mockReturnValue(null);
  });
  afterEach(() => {
    vi.resetModules();
  });

  it('is true when the wrapper settled and is present', async () => {
    wrapper.waitForWrapper.mockResolvedValue({ appInfo: {}, capabilities: {} });
    wrapper.isWrapperPresent.mockReturnValue(true);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(true);
  });

  it('is true when the wrapper is present but never became ready', async () => {
    // waitForWrapper gives up after 1s; the wrapper object is still there.
    wrapper.waitForWrapper.mockResolvedValue(null);
    wrapper.isWrapperPresent.mockReturnValue(true);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(true);
  });

  it('is false in a plain browser', async () => {
    wrapper.waitForWrapper.mockResolvedValue(null);
    wrapper.isWrapperPresent.mockReturnValue(false);
    const { isNativeApp } = await import('./revenuecat');
    expect(await isNativeApp()).toBe(false);
  });

  it('waits for a wrapper that injects after the first check', async () => {
    // The wrapper injects itself after first paint, so the mount-time check
    // usually runs before it exists. Answering "browser" there would honour an
    // admin comp inside the App Store build — the one direction that must never
    // happen — and React would hold that grant for the session.
    let present = false;
    wrapper.waitForWrapper.mockResolvedValue(null);
    wrapper.isWrapperPresent.mockImplementation(() => present);
    const { isNativeApp } = await import('./revenuecat');
    setTimeout(() => {
      present = true;
    }, 200);
    await expect(isNativeApp()).resolves.toBe(true);
  });

  it('is false, not a rejection, when the wrapper probe throws', async () => {
    wrapper.waitForWrapper.mockRejectedValue(new Error('boom'));
    wrapper.isWrapperPresent.mockReturnValue(false);
    const { isNativeApp } = await import('./revenuecat');
    await expect(isNativeApp()).resolves.toBe(false);
  });
});

describe('configure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    wrapper.getPurchasesPlugin.mockReturnValue(null);
    wrapper.waitForPurchasesPlugin.mockResolvedValue(null);
    wrapper.waitForWrapper.mockResolvedValue(IOS);
  });
  afterEach(() => {
    vi.resetModules();
    vi.useRealTimers();
  });

  it('is false when no Purchases plugin ever registers', async () => {
    const { configure } = await import('./revenuecat');
    await expect(configure()).resolves.toBe(false);
  });

  it('stops waiting on a configure the native shell never answers', async () => {
    // AppBuild applies the dashboard keys itself, so the bridge call has no
    // callback to send: the wrapper holds it for 25s and only then rejects. The
    // paywall must not sit on that.
    vi.useFakeTimers();
    const never = vi.fn(() => new Promise(() => {}));
    wrapper.waitForPurchasesPlugin.mockResolvedValue({ configure: never });

    const { configure } = await import('./revenuecat');
    const pending = configure();
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toBe(true);
    expect(never).toHaveBeenCalledTimes(1);
  });

  it('does not let the bridge\'s own late timeout reach the paywall', async () => {
    // The wrapper's client-side failure lands at 25s with the text of the
    // request. By then configure() has already answered, so it must not turn
    // into an unhandled rejection or a red message on screen.
    vi.useFakeTimers();
    wrapper.waitForPurchasesPlugin.mockResolvedValue({
      configure: () =>
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error("Bridge request 'plugin:Purchases.configure' timed out client-side after 25000ms")
              ),
            25000
          )
        ),
    });

    const { configure } = await import('./revenuecat');
    const pending = configure();
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toBe(true);
    // Let the bridge's failure fire; nothing awaits it any more.
    await vi.advanceTimersByTimeAsync(25000);
  });

  it('tolerates the "already configured" rejection the native shell produces', async () => {
    wrapper.waitForPurchasesPlugin.mockResolvedValue({
      configure: vi.fn().mockRejectedValue(new Error('Purchases is already configured')),
    });

    const { configure } = await import('./revenuecat');
    await expect(configure()).resolves.toBe(true);
  });

  it('still reports a store error that is not the already-configured case', async () => {
    wrapper.waitForPurchasesPlugin.mockResolvedValue({
      configure: vi.fn().mockRejectedValue(new Error('Invalid API key.')),
    });

    const { configure } = await import('./revenuecat');
    await expect(configure()).rejects.toThrow('Invalid API key.');
  });

  it('configures once and remembers it', async () => {
    const plugin = { configure: vi.fn().mockResolvedValue(undefined) };
    wrapper.waitForPurchasesPlugin.mockResolvedValue(plugin);

    const { configure } = await import('./revenuecat');
    await configure('user-1');
    await configure('user-1');

    expect(plugin.configure).toHaveBeenCalledTimes(1);
    expect(plugin.configure).toHaveBeenCalledWith({
      apiKey: expect.any(String),
      appUserID: 'user-1',
    });
  });
});

describe('getOfferings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    wrapper.waitForPurchasesPlugin.mockResolvedValue(null);
  });
  afterEach(() => {
    vi.resetModules();
    vi.useRealTimers();
  });

  it('is empty when the plugin never registers', async () => {
    const { getOfferings } = await import('./revenuecat');
    await expect(getOfferings()).resolves.toEqual([]);
  });

  it('gives up on a read the bridge never answers, rather than spinning', async () => {
    vi.useFakeTimers();
    wrapper.waitForPurchasesPlugin.mockResolvedValue({ getOfferings: () => new Promise(() => {}) });

    const { getOfferings } = await import('./revenuecat');
    const pending = getOfferings();
    await vi.advanceTimersByTimeAsync(10000);
    await expect(pending).resolves.toEqual([]);
  });

  it('rethrows what the store said, so only silence reads as an empty store', async () => {
    wrapper.waitForPurchasesPlugin.mockResolvedValue({
      getOfferings: () => Promise.reject(new Error('Invalid API key.')),
    });

    const { getOfferings } = await import('./revenuecat');
    await expect(getOfferings()).rejects.toThrow('Invalid API key.');
  });

  it('reads the pinned "sale 2" offering rather than whatever is current', async () => {
    wrapper.waitForPurchasesPlugin.mockResolvedValue({
      getOfferings: () =>
        Promise.resolve({
          offerings: {
            all: {
              default: { identifier: 'default', availablePackages: [{ identifier: '$rc_monthly' }] },
              'sale 2': {
                identifier: 'sale 2',
                availablePackages: [
                  { identifier: '$rc_annual', product: { priceString: '₹1,499.00', identifier: 'annual' } },
                ],
              },
            },
            current: { identifier: 'default' },
          },
        }),
    });

    const { getOfferings } = await import('./revenuecat');
    const pkgs = await getOfferings();
    expect(pkgs).toHaveLength(1);
    expect(pkgs[0].identifier).toBe('$rc_annual');
    expect(pkgs[0].priceString).toBe('₹1,499.00');
  });
});
