import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const wrapper = vi.hoisted(() => ({
  waitForWrapper: vi.fn(),
  isWrapperPresent: vi.fn(),
}));

vi.mock('./wrapper', () => ({
  waitForWrapper: wrapper.waitForWrapper,
  isWrapperPresent: wrapper.isWrapperPresent,
  getPurchasesPlugin: () => null,
}));

describe('isNativeApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
