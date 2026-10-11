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

/**
 * How long `Purchases.configure` gets to answer before we stop waiting for it.
 *
 * AppBuild's native shell applies the dashboard keys itself, so for the bridge
 * call there is nothing left to do and no callback ever comes. The wrapper gives
 * up on it client-side after 25 seconds and rejects with the text of the request
 * — `Bridge request 'plugin:Purchases.configure' timed out client-side after
 * 25000ms` — which names our plugin, not the buyer's problem, and which the
 * "already configured" tolerance below does not match. Awaiting that in full
 * stalls the paywall and then prints it in red.
 *
 * Past this window we stop waiting and let `getOfferings()` be the judge: it
 * answers only when RevenueCat really is configured, so a configure that never
 * landed leaves the paywall reporting an empty store, not a phantom price.
 */
const CONFIGURE_TIMEOUT_MS = 2000;

/**
 * Configure RevenueCat with the platform-specific public key.
 *
 * True means "configure has been asked for; go on and read the offerings", not
 * "the store confirmed it" — the native shell is a legitimate second configurer.
 * False means there is nothing to configure *with*: no plugin, or no key.
 * A store error that is not the "already configured" case still rejects.
 */
export async function configure(appUserId?: string | null): Promise<boolean> {
  const purchases = await waitForPurchasesPlugin();
  if (!purchases) return false;
  if (configured) return true;

  const wrapper = await waitForWrapper();
  const platform = detectPlatform(wrapper?.appInfo?.platform);
  const apiKey = platform === 'android' ? REVENUECAT_ANDROID_KEY : REVENUECAT_IOS_KEY;
  if (!apiKey) return false;

  const timedOut = Symbol('configure-timeout');
  let timer: ReturnType<typeof setTimeout>;
  const giveUp = new Promise<typeof timedOut>((resolve) => {
    timer = setTimeout(() => resolve(timedOut), CONFIGURE_TIMEOUT_MS);
  });

  try {
    // A late success still sets the flag, so the next open skips this wait.
    const settled = Promise.resolve()
      .then(() => purchases.configure({ apiKey, appUserID: appUserId ?? undefined }))
      .then(() => {
        configured = true;
      })
      .catch((e: any) => {
        // Already configured natively by the wrapper is fine.
        if (!/already|configured/i.test(String(e?.message ?? ''))) throw e;
        configured = true;
      });

    const outcome = await Promise.race([settled, giveUp]);
    // Silence is not a failure the buyer can act on: carry on and ask for the
    // offerings. A rejection from `settled` wins the race and is rethrown here.
    if (outcome === timedOut) return true;
  } finally {
    clearTimeout(timer!);
  }

  return true;
}

/**
 * How long the offerings read gets before the paywall stops waiting on it.
 *
 * The same bridge as `configure()`: a call the native side has no reason to
 * answer would otherwise leave a spinner on screen for good. Shorter than the
 * wrapper's own 25-second failure, so the paywall reports an empty store — which
 * a buyer can act on — rather than sitting on a request that will end in a
 * message naming our plugin. Apple's product list can take a few seconds to
 * arrive on a cold start, so this is generous rather than tight.
 */
const OFFERINGS_TIMEOUT_MS = 10000;

/** Packages of the "sale 2" offering (falls back to current / first offering). */
export async function getOfferings(): Promise<RcPackage[]> {
  const purchases = await waitForPurchasesPlugin();
  if (!purchases) return [];

  const timedOut = Symbol('offerings-timeout');
  let timer: ReturnType<typeof setTimeout>;
  const giveUp = new Promise<typeof timedOut>((resolve) => {
    timer = setTimeout(() => resolve(timedOut), OFFERINGS_TIMEOUT_MS);
  });

  try {
    // A rejection from the read wins the race and is rethrown here, so the store
    // still gets to explain itself; only silence is reported as "no packages".
    const read = Promise.resolve().then(() => purchases.getOfferings());
    const result = await Promise.race([read, giveUp]);
    if (result === timedOut) return [];

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
  } finally {
    clearTimeout(timer!);
  }
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
