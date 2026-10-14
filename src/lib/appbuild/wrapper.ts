// The ONLY module allowed to touch window.AppbuildWrapper.
//
// Facts about the real SDK (https://appbuild.diy/snippets/appbuild-wrapper-sdk.js):
// - It defines window.AppbuildWrapper in EVERY browser, not just the phone app.
//   Presence of the object therefore proves nothing.
// - `ready` resolves only when a host (native shell or AppBuild PWA) posts its
//   appInfo: { platform, transport, capabilities: { push, camera, plugins } }.
//   In a plain browser it never resolves.
// - `plugin(name)` always returns a proxy; any call is posted to the host as
//   `plugin:<Name>.<method>` and, with no host, times out after 25 seconds.

export interface WrapperAppInfo {
  platform?: string;
  transport?: string;
  capabilities?: WrapperCapabilities;
  [key: string]: unknown;
}

export interface WrapperCapabilities {
  push?: { available?: boolean; permission?: string };
  camera?: { available?: boolean };
  plugins?: Record<string, { available?: boolean; methods?: string[] }>;
  [key: string]: unknown;
}

export interface WrapperReady {
  appInfo: WrapperAppInfo;
  capabilities: WrapperCapabilities;
}

interface AppbuildWrapperApi {
  ready: Promise<any>;
  appInfo?: any;
  plugin: (name: string) => any;
  push?: any;
}

declare global {
  interface Window {
    AppbuildWrapper?: AppbuildWrapperApi;
  }
}

/** The host broadcasts appInfo on page load and the SDK re-asks at 250ms. */
const READY_TIMEOUT_MS = 10000;

let readyPromise: Promise<WrapperReady | null> | null = null;
let cachedInfo: WrapperReady | null = null;

/** Accepts both the real SDK shape (the payload itself) and the dev mock's { appInfo, capabilities }. */
function normalise(raw: any): WrapperReady | null {
  if (!raw || typeof raw !== 'object') return null;
  const appInfo: WrapperAppInfo = raw.appInfo && typeof raw.appInfo === 'object' ? raw.appInfo : raw;
  const capabilities: WrapperCapabilities =
    raw.capabilities ?? appInfo.capabilities ?? {};
  return { appInfo, capabilities };
}

function currentInfo(): WrapperReady | null {
  if (cachedInfo) return cachedInfo;
  const w = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
  const live = normalise(w?.appInfo);
  if (live) cachedInfo = live;
  return live;
}

/**
 * Awaits the host's appInfo (2s timeout).
 * Returns { appInfo, capabilities } when a host answered, or null in a plain browser.
 */
export function waitForWrapper(): Promise<WrapperReady | null> {
  const known = currentInfo();
  if (known) return Promise.resolve(known);
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    const wrapper = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
    if (!wrapper?.ready) return null;
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), READY_TIMEOUT_MS));
      const result = normalise(await Promise.race([wrapper.ready, timeout]));
      if (result) cachedInfo = result;
      return result;
    } catch {
      return null;
    } finally {
      // A late host can still answer: let the next caller wait again.
      if (!cachedInfo) readyPromise = null;
    }
  })();

  return readyPromise;
}

/**
 * True only inside the App Store / Google Play shell: a host answered and it is
 * not AppBuild's web (PWA) host, which has no store billing.
 */
export function isNativeShell(): boolean {
  const info = currentInfo();
  if (!info) return false;
  const transport = String(info.appInfo.transport ?? '').toLowerCase();
  const platform = String(info.appInfo.platform ?? '').toLowerCase();
  if (transport === 'pwa' || platform === 'web') return false;
  return true;
}

/** The platform the host reported ('ios' | 'android'), or '' when unknown. */
export function wrapperPlatform(): string {
  return String(currentInfo()?.appInfo.platform ?? '').toLowerCase();
}

/** Names of the second-class plugins the host says are installed. */
export function availablePluginNames(): string[] {
  return Object.keys(currentInfo()?.capabilities.plugins ?? {});
}

/** Returns a wrapper plugin proxy by name, or null when no native host answered. */
export function getPlugin(name: string): any | null {
  const wrapper = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
  if (!wrapper?.plugin || !isNativeShell()) return null;
  try {
    return wrapper.plugin(name) ?? null;
  } catch {
    return null;
  }
}

/** The RevenueCat plugin name as the host registered it (Capacitor's is 'Purchases'). */
export function purchasesPluginName(): string {
  const listed = availablePluginNames().find((n) => /purchases|revenue ?cat/i.test(n));
  return listed ?? 'Purchases';
}

/** Returns the wrapper's RevenueCat plugin, or null outside the native app. */
export function getPurchasesPlugin(): any | null {
  return getPlugin(purchasesPluginName());
}

/** Waits for the host (up to `ms`) and returns the RevenueCat plugin, or null. */
export async function waitForPurchasesPlugin(ms = 4000): Promise<any | null> {
  const deadline = Date.now() + ms;
  await waitForWrapper();
  let p = getPurchasesPlugin();
  while (!p && isWrapperPresent() && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 200));
    await waitForWrapper();
    p = getPurchasesPlugin();
  }
  return p;
}

/** The wrapper's first-class push API, or null outside the native app. */
export function getPushBridge(): any | null {
  const wrapper = typeof window !== 'undefined' ? window.AppbuildWrapper : undefined;
  if (!wrapper?.push || !isNativeShell()) return null;
  if (currentInfo()?.capabilities.push?.available === false) return null;
  return wrapper.push;
}

/** Short, non-secret description of what the host reported — shown with store errors. */
export function describeHost(): string {
  const info = currentInfo();
  if (!info) return 'no app host';
  const plugins = availablePluginNames();
  return [
    info.appInfo.platform ?? 'unknown platform',
    info.appInfo.transport ?? 'native',
    `plugins: ${plugins.length ? plugins.join(', ') : 'none listed'}`,
  ].join(' · ');
}

/**
 * True when the wrapper object exists at all. The real SDK defines it in every
 * browser, so this only means "the SDK script loaded" — use isNativeShell() to
 * decide whether we are inside the store app.
 */
export function isWrapperPresent(): boolean {
  return typeof window !== 'undefined' && !!window.AppbuildWrapper;
}

/** Test hook. */
export function __resetWrapperForTests(): void {
  readyPromise = null;
  cachedInfo = null;
}

/** True on iPhone/iPad/iPod: web (Razorpay) checkout must never be shown there. */
export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1);
}

/** Store-billing context: native shell or any iOS device. */
export function mustUseStoreBilling(): boolean {
  return isIOSDevice() || isNativeShell();
}
