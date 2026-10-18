 # Project architecture

- VitePWA owns service-worker generation and registration; do not add a worker in public or a second manual registration, because unbundled Workbox imports fail in previews and duplicate workers can serve stale app assets.