// Moved out of an inline <script> in index.html so the Content-Security-Policy
// does not need 'unsafe-inline' for scripts.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('SW registered:', reg.scope);
    }).catch((err) => {
      console.error('SW registration failed:', err);
    });
  });
}
