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

  it('is false, not a rejection, when the wrapper probe throws', async () => {
    wrapper.waitForWrapper.mockRejectedValue(new Error('boom'));
    wrapper.isWrapperPresent.mockReturnValue(false);
    const { isNativeApp } = await import('./revenuecat');
    await expect(isNativeApp()).resolves.toBe(false);
  });
});
