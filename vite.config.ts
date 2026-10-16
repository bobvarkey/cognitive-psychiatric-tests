import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';
import fs from "fs";
import { loadEnv, type Plugin } from "vite";
import { buildCsp } from "./security-headers.config";

// DEV-ONLY: serve and inject the fake AppbuildWrapper (dev-mocks/), which can
// fake store purchases. `apply: 'serve'` means it never runs for `vite build`,
// and the file lives outside public/, so production bundles cannot contain it.
const MOCK_PATH = "/appbuild-wrapper-sdk.mock.js";
function appbuildMockDevOnly(): Plugin {
  return {
    name: "appbuild-mock-dev-only",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(MOCK_PATH, (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.end(fs.readFileSync(path.resolve(__dirname, "dev-mocks/appbuild-wrapper-sdk.mock.js")));
      });
    },
    transformIndexHtml() {
      return [{ tag: "script", attrs: { src: MOCK_PATH, defer: true }, injectTo: "head" }];
    },
  };
}

// https://vitejs.dev/config/
// BUILD-ONLY: a <meta> Content-Security-Policy fallback for hosts that ignore
// public/_headers and vercel.json. Not applied to the dev server, whose React
// refresh preamble is an inline script. The real header (with frame-ancestors)
// lives in public/_headers and vercel.json; see security-headers.config.ts.
function cspMetaBuildOnly(supabaseUrl: string | undefined): Plugin {
  return {
    name: "csp-meta-build-only",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: buildCsp({ supabaseOrigin: supabaseUrl, forMeta: true }),
          },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    appbuildMockDevOnly(),
    cspMetaBuildOnly(loadEnv(mode, process.cwd(), "VITE_").VITE_SUPABASE_URL),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Cognito — Clinical Assessment Toolkit',
        short_name: 'Cognito',
        description: 'Evidence-based neuropsychiatric assessments for clinicians.',
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Precache only the app shell; large images are cached at runtime instead
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        navigateFallbackDenylist: [/^\/~oauth/],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 90
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
