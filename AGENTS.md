 # Project architecture

- VitePWA owns service-worker generation and registration; do not add a worker in public or a second manual registration, because unbundled Workbox imports fail in previews and duplicate workers can serve stale app assets.
- App launch and route browsing must not wait on entitlement checks or open a blocking paywall; keep Upgrade as an on-demand, dismissible sheet so store outages cannot block clinical browsing.
- Preserve trusted payment verification when changing access presentation; browsing does not create a paid entitlement, and browser storage is not proof of payment.
- Developer access is an admin-issued entitlement keyed to a verified auth user ID, never a client email whitelist; Google sign-in uses the managed Lovable OAuth helper so account ownership remains verified without email codes.