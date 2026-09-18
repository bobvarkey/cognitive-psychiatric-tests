import { getPlugin, waitForWrapper } from "./wrapper";

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

/** The wrapper's push bridge: either the 'Push' plugin or a legacy `wrapper.push` object. */
function getPushApi(): any | null {
  if (typeof window === "undefined") return null;
  const plugin = getPlugin("Push");
  if (plugin?.register) return plugin;
  const legacy = (window as any).AppbuildWrapper?.push;
  return legacy?.register ? legacy : null;
}

/** True when running inside the native wrapper with push support. */
export function isNativePushAvailable(): boolean {
  return getPushApi() !== null;
}

/**
 * Request push notification permission and register with the AppBuild wrapper.
 * Returns the device token inside the native app, or null in a browser.
 * Safe to call repeatedly: returns the cached token after the first successful registration.
 */
export async function registerPushNotifications(): Promise<PushRegistration | null> {
  const api = getPushApi();
  if (!api) return null;
  if (cachedToken) return { token: cachedToken };

  try {
    const wrapper = await waitForWrapper();
    const result = await api.register();
    const token = result?.token ?? result ?? null;
    if (typeof token === "string" && token) {
      cachedToken = token;
      return { token, platform: wrapper?.appInfo?.platform as string | undefined };
    }
    return null;
  } catch (e) {
    console.error("Push registration failed:", e);
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
 * Subscribe to incoming remote notifications (foreground receipt and taps).
 * Returns an unsubscribe function; a no-op outside the native app.
 */
export function onPushMessage(handler: (message: PushMessage) => void): () => void {
  const api = getPushApi();
  if (!api?.addListener) return () => {};

  const events = ["pushNotificationReceived", "pushNotificationActionPerformed"];
  const subs = events
    .map((event) => {
      try {
        return api.addListener(event, (payload: any) => handler(normalise(payload)));
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return () => subs.forEach((s: any) => s?.remove?.());
}

/** Clear the cached push token (useful after logout or for testing). */
export function clearPushToken(): void {
  cachedToken = null;
}
