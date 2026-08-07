// The ONLY module allowed to touch window.AppbuildWrapper.

export interface WrapperAppInfo {
  platform?: string;
  [key: string]: unknown;
}

export interface WrapperReady {
  appInfo: WrapperAppInfo;
  capabilities: Record<string, unknown>;
}

interface AppbuildWrapperApi {
  ready: Promise<{ appInfo?: WrapperAppInfo; capabilities?: Record<string, unknown> }>;
  plugin: (name: string) => any;
}

declare global {
  interface Window {
    AppbuildWrapper?: AppbuildWrapperApi;
  }
}

const READY_TIMEOUT_MS = 1000;

let readyPromise: Promise<WrapperReady | null> | null = null;

/**
 * Awaits the native wrapper's ready promise (1s timeout).
 * Returns { appInfo, capabilities } inside the native wrapper, or null in a plain browser.
 */
export function waitForWrapper(): Promise<WrapperReady | null> {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    const wrapper = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
    if (!wrapper?.ready) return null;

    try {
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), READY_TIMEOUT_MS)
      );
      const result = await Promise.race([wrapper.ready, timeout]);
      if (!result) return null;
      return {
        appInfo: result.appInfo ?? {},
        capabilities: result.capabilities ?? {},
      };
    } catch {
      return null;
    }
  })();

  return readyPromise;
}

/** Returns the wrapper's 'Purchases' (RevenueCat) plugin, or null outside the native app. */
export function getPurchasesPlugin(): any | null {
  const wrapper = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
  if (!wrapper?.plugin) return null;
  try {
    return wrapper.plugin('Purchases') ?? null;
  } catch {
    return null;
  }
}
