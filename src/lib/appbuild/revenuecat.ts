import { getPurchasesPlugin, isWrapperPresent, waitForPurchasesPlugin, waitForWrapper } from './wrapper';
import { REVENUECAT_ANDROID_KEY, REVENUECAT_IOS_KEY } from './revenuecatKeys';

export interface RcPackage {
  identifier: string;
  title: string;
  priceString: string;
  period: string;
  raw: any;
}

export const RC_OFFERING_ID = 'sale 2';

let configured = false;

function detectPlatform(wrapperPlatform: unknown): 'android' | 'ios' {
  const p = String(wrapperPlatform ?? '').toLowerCase();
  if (p.includes('android')) return 'android';
  if (p.includes('ios')) return 'ios';
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return /android/i.test(ua) ? 'android' : 'ios';
}

/** Configure RevenueCat with the platform-specific public key. Returns true when configured. */
export async function configure(appUserId?: string | null): Promise<boolean> {
  const purchases = await waitForPurchasesPlugin();
  if (!purchases) return false;
  if (configured) return true;

  const wrapper = await waitForWrapper();
  const platform = detectPlatform(wrapper?.appInfo?.platform);
  const apiKey = platform === 'android' ? REVENUECAT_ANDROID_KEY : REVENUECAT_IOS_KEY;
  if (!apiKey) return false;

  try {
    await purchases.configure({ apiKey, appUserID: appUserId ?? undefined });
  } catch (e: any) {
    // Already configured natively by the wrapper is fine.
    if (!/already|configured/i.test(String(e?.message ?? ''))) throw e;
  }
  configured = true;
  return true;
}

/** Packages of the "sale 2" offering (falls back to current / first offering). */
export async function getOfferings(): Promise<RcPackage[]> {
  const purchases = await waitForPurchasesPlugin();
  if (!purchases) return [];

  const result = await purchases.getOfferings();
  const offerings = result?.offerings ?? result;
  const all = offerings?.all ?? {};
  const offering =
    all[RC_OFFERING_ID] ??
    Object.values(all).find((o: any) => o?.identifier === RC_OFFERING_ID) ??
    offerings?.current ??
    Object.values(all)[0];
  const packages = (offering as any)?.availablePackages ?? (offering as any)?.packages ?? [];

  return packages.map((p: any) => {
    const product = p.product ?? p.storeProduct ?? {};
    return {
      identifier: p.identifier ?? product.identifier ?? '',
      title: product.title ?? product.localizedTitle ?? p.identifier ?? '',
      priceString: product.priceString ?? product.localizedPriceString ?? '',
      period: [p.packageType, product.subscriptionPeriod, product.period, product.identifier]
        .filter(Boolean)
        .join(' '),
      raw: p,
    };
  });
}

/** Purchase a package returned by getOfferings(). */
export async function purchasePackage(pkg: RcPackage): Promise<any> {
  const purchases = await waitForPurchasesPlugin();
  if (!purchases) throw new Error('The App Store / Google Play connection is unavailable. Please restart the app.');
  try {
    return await purchases.purchasePackage({ aPackage: pkg.raw });
  } catch (e: any) {
    if (e?.userCancelled) throw e;
    const msg = String(e?.message ?? '');
    // Some bridges take the package directly instead of { aPackage }.
    if (/apackage|invalid|argument|undefined|missing/i.test(msg)) {
      return purchases.purchasePackage(pkg.raw);
    }
    throw e;
  }
}

/** Restore previous purchases. */
export async function restorePurchases(): Promise<any> {
  const purchases = getPurchasesPlugin();
  if (!purchases) throw new Error('Purchases plugin unavailable');
  return purchases.restorePurchases();
}

/** Active entitlement object, or null. */
export async function getEntitlement(id = 'premium'): Promise<any | null> {
  const purchases = getPurchasesPlugin();
  if (!purchases) return null;
  const result = await purchases.getCustomerInfo();
  const info = result?.customerInfo ?? result;
  return info?.entitlements?.active?.[id] ?? null;
}

/** True when running inside the native wrapper with the Purchases plugin available. */
export function isNativePurchasesAvailable(): boolean {
  return getPurchasesPlugin() !== null;
}

/**
 * How long to keep looking for a wrapper that has not injected itself yet.
 *
 * A browser pays this waiting time only when an administrator's grant is on the
 * account — `serverEntitlement()` consults this after it has seen one and not
 * before — so no ordinary user's load path carries it.
 */
const WRAPPER_PRESENCE_MS = 1000;
const WRAPPER_POLL_MS = 50;

/**
 * True only inside the native wrapper.
 *
 * Async because the wrapper injects itself after first paint; the mount-time
 * check therefore usually runs before it exists. Presence has to be given a
 * window: `waitForWrapper()` returns immediately when there is no wrapper object
 * to await, so a single presence check would answer "browser" for the first few
 * hundred milliseconds — honouring an admin comp inside the shipped app, in the
 * one direction that must never happen, and React would hold that grant for the
 * rest of the session.
 *
 * Readiness is deliberately not required: a wrapper that is present but slow, or
 * present without a Purchases plugin, still counts as native. This answers "are
 * we in the App Store build", not "is IAP configured". The wait is bounded, so a
 * wrapper that never arrives still resolves to `false`, which is the behaviour a
 * browser needs.
 */
export async function isNativeApp(): Promise<boolean> {
  try {
    await waitForWrapper();
  } catch {
    /* fall through to the presence check */
  }

  const deadline = Date.now() + WRAPPER_PRESENCE_MS;
  while (!isWrapperPresent() && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, WRAPPER_POLL_MS));
  }
  return isWrapperPresent();
}
