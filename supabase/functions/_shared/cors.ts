// CORS for browser-called edge functions: an origin allowlist instead of '*'.
//
// Allowed origins come from the ALLOWED_ORIGINS secret (comma-separated). An
// entry may use one leading wildcard label, e.g. `https://*.lovableproject.com`
// for Lovable preview builds. When unset, the default is the production web app
// plus the local Vite dev server.
//
// A disallowed origin gets no Access-Control-Allow-Origin header, so the
// browser blocks the response. Server-to-server callers (Razorpay webhooks)
// send no Origin and are unaffected.

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://cognitive-psychiatric-tests.lovable.app',
  'http://localhost:8080',
];

// Same header/method lists as `@supabase/supabase-js/cors`, minus the origin.
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  Vary: 'Origin',
};

export function allowedOrigins(): string[] {
  const raw = Deno.env.get('ALLOWED_ORIGINS')?.trim();
  if (!raw) return DEFAULT_ALLOWED_ORIGINS;
  return raw.split(',').map((s) => s.trim().replace(/\/+$/, '')).filter(Boolean);
}

export function isOriginAllowed(origin: string, allowlist = allowedOrigins()): boolean {
  if (!origin) return false;
  return allowlist.some((entry) => {
    if (entry === origin) return true;
    const m = /^(https?:\/\/)\*\.(.+)$/.exec(entry);
    if (!m) return false;
    const [, scheme, suffix] = m;
    return (
      origin.startsWith(scheme) &&
      origin.endsWith('.' + suffix) &&
      /^[a-z0-9-]+$/i.test(origin.slice(scheme.length, origin.length - suffix.length - 1))
    );
  });
}

/** Wraps a handler: answers preflight and stamps the allowed origin on every response. */
export function withCors(handler: (req: Request) => Response | Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get('Origin') ?? '';
    const allowed = isOriginAllowed(origin);
    if (req.method === 'OPTIONS') {
      const headers = new Headers(corsHeaders);
      if (allowed) headers.set('Access-Control-Allow-Origin', origin);
      return new Response(allowed ? 'ok' : 'origin not allowed', { status: allowed ? 200 : 403, headers });
    }
    const res = await handler(req);
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
    headers.delete('Access-Control-Allow-Origin');
    if (allowed) headers.set('Access-Control-Allow-Origin', origin);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  };
}
