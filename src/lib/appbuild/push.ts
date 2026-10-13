import { getPushBridge, waitForWrapper, wrapperPlatform } from "./wrapper";

// AppBuild's push API is first-class on `AppbuildWrapper.push`. Registration
// with APNs/FCM is owned by the native shell — there is no `register()` call;
// the page asks for permission and reads the registration id.

export interface PushRegistration {
  token: string;
  platform?: string;
}

export interface PushMessage {
  id: string;
  title: string;
  body: string;
  receivedAt: number;
  data?: Record<string, unknown>;
}

let cachedToken: string | null = null;

/** True when running inside the native wrapper with push support. */
export function isNativePushAvailable(): boolean {
  return getPushBridge() !== null;
}

/**
 * Ask for notification permission and read this device's push registration id.
 * Returns null in a browser. Safe to call repeatedly.
 */
export async function registerPushNotifications(): Promise<PushRegistration | null> {
  await waitForWrapper();
  const api = getPushBridge();
  if (!api) return null;
  if (cachedToken) return { token: cachedToken, platform: wrapperPlatform() };

  try {
    const perm = await api.checkPermissions?.().catch(() => null);
    const state = perm?.receive ?? perm?.permission ?? perm;
    if (state !== "granted") await api.requestPermissions?.().catch(() => null);
    const result = await api.getId();
    const token = typeof result === "string" ? result : result?.id ?? null;
    if (typeof token === "string" && token) {
      cachedToken = token;
      return { token, platform: wrapperPlatform() };
    }
    return null;
  } catch (e) {
    console.warn("Push registration unavailable:", e);
    return null;
  }
}

function normalise(payload: any): PushMessage {
  const notification = payload?.notification ?? payload ?? {};
  return {
    id:
      String(payload?.id ?? notification?.id ?? "") ||
      `push-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: notification.title ?? payload?.title ?? "Notification",
    body: notification.body ?? payload?.body ?? payload?.message ?? "",
    receivedAt: Date.now(),
    data: payload?.data ?? undefined,
  };
}

/**
 * Subscribe to incoming notifications. Returns an unsubscribe function; a no-op
 * outside the native app.
 */
export function onPushMessage(handler: (message: PushMessage) => void): () => void {
  const api = getPushBridge();
  if (!api?.onReceived) return () => {};
  try {
    const off = api.onReceived((payload: any) => handler(normalise(payload)));
    return typeof off === "function" ? off : () => {};
  } catch {
    return () => {};
  }
}

/** Clear the cached push token (useful after logout or for testing). */
export function clearPushToken(): void {
  cachedToken = null;
}
