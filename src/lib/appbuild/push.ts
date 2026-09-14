import { waitForWrapper } from "./wrapper";

export interface PushRegistration {
  token: string;
  platform?: string;
}

let cachedToken: string | null = null;

/**
 * Request push notification permission and register with the AppBuild wrapper.
 * Returns the device token inside the native app, or null in a browser.
 * Safe to call repeatedly: returns the cached token after the first successful registration.
 */
export async function registerPushNotifications(): Promise<PushRegistration | null> {
  if (typeof window === "undefined" || !(window as any).AppbuildWrapper) {
    return null;
  }

  if (cachedToken) {
    return { token: cachedToken };
  }

  const wrapper = (window as any).AppbuildWrapper;
  if (!wrapper?.push?.register) {
    return null;
  }

  try {
    await waitForWrapper();
    const result = await wrapper.push.register();
    const token = result?.token ?? result ?? null;
    if (typeof token === "string" && token) {
      cachedToken = token;
      return { token };
    }
    return null;
  } catch (e) {
    console.error("Push registration failed:", e);
    return null;
  }
}

/** True when running inside the native wrapper with push support. */
export function isNativePushAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as any).AppbuildWrapper?.push?.register
  );
}

/** Clear the cached push token (useful after logout or for testing). */
export function clearPushToken(): void {
  cachedToken = null;
}
