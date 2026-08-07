import { getPurchasesPlugin, waitForWrapper } from './wrapper';
import { REVENUECAT_ANDROID_KEY, REVENUECAT_IOS_KEY } from './revenuecatKeys';

export interface RcPackage {
  identifier: string;
  title: string;
  priceString: string;
  period: string;
  raw: any;
}

let configured = false;

/** Configure RevenueCat with the platform-specific public key. Returns true when configured. */
export async function configure(appUserId?: string | null): Promise<boolean> {
  const purchases = getPurchasesPlugin();
  if (!purchases) return false;

  const wrapper = await waitForWrapper();
  const platform = String(wrapper?.appInfo?.platform ?? '').toLowerCase();
  const apiKey = platform === 'android' ? REVENUECAT_ANDROID_KEY : REVENUECAT_IOS_KEY;
  if (!apiKey) return false;

  if (configured) return true;
  await purchases.configure({ apiKey, appUserID: appUserId ?? undefined });
  configured = true;
  return true;
}

/** Packages of the current offering. Empty array outside the native app. */
export async function getOfferings(): Promise<RcPackage[]> {
  const purchases = getPurchasesPlugin();
  if (!purchases) return [];

  const result = await purchases.getOfferings();
  const offerings = result?.offerings ?? result;
  const current = offerings?.current;
  const packages = current?.availablePackages ?? current?.packages ?? [];

  return packages.map((p: any) => {
    const product = p.product ?? p.storeProduct ?? {};
    return {
      identifier: p.identifier ?? product.identifier ?? '',
      title: product.title ?? product.localizedTitle ?? p.identifier ?? '',
      priceString: product.priceString ?? product.localizedPriceString ?? '',
      period:
        p.packageType ??
        product.subscriptionPeriod ??
        product.period ??
        '',
      raw: p,
    };
  });
}

/** Purchase a package returned by getOfferings(). */
export async function purchasePackage(pkg: RcPackage): Promise<any> {
  const purchases = getPurchasesPlugin();
  if (!purchases) throw new Error('Purchases plugin unavailable');
  return purchases.purchasePackage({ aPackage: pkg.raw });
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
