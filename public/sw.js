import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images and other static assets using StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  })
);

// Offline fallback for HTML pages
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      await fetch(event.request);
    } catch (error) {
      return caches.match('/offline');
    }
  }
);

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
