// Single source of truth for the web app's security response headers.
//
// Used by vite.config.ts (to inject a <meta> CSP into production builds, which
// is what a host that ignores header files still honours) and checked against
// public/_headers and vercel.json by src/test/securityHeaders.test.ts.
//
// Origins allowed, and why:
// - Supabase project (REST, auth, functions, realtime websocket)
// - Razorpay Checkout: script from checkout.razorpay.com; its iframe, API and
//   telemetry live on *.razorpay.com
// - Google Fonts (stylesheet + font files)
// - appbuild.diy: the real AppBuild wrapper SDK, needed by the iOS/Android
//   shell for in-app purchases (the fake mock is dev-only, see vite.config.ts)
// - oauth.lovable.app / lovable.dev: Lovable Cloud OAuth (Google/Apple sign-in)

export const SUPABASE_ORIGIN = 'https://lusgyknbmprhmxbkkdbo.supabase.co';

export function buildCsp(opts: { supabaseOrigin?: string; forMeta?: boolean } = {}): string {
  const supabase = (opts.supabaseOrigin || SUPABASE_ORIGIN).replace(/\/+$/, '');
  const supabaseWs = supabase.replace(/^https:/, 'wss:');
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://checkout.razorpay.com', 'https://appbuild.diy'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'connect-src': [
      "'self'",
      supabase,
      supabaseWs,
      'https://*.razorpay.com',
      'https://oauth.lovable.app',
      'https://lovable.dev',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'frame-src': ['https://*.razorpay.com'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", 'https://*.razorpay.com'],
  };
  // frame-ancestors is ignored (with a console warning) in a <meta> CSP; it is
  // only sent as a real header. Lovable's editor previews the app in a frame.
  if (!opts.forMeta) {
    directives['frame-ancestors'] = ["'self'", 'https://lovable.dev', 'https://*.lovable.dev'];
  }
  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
}

export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': buildCsp(),
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com"), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
