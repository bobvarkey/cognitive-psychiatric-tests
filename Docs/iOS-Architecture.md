# iOS Architecture Reference

This project follows a mobile-optimized architecture for iOS deployment.

## Core Principles
1. **Safe Area Insets**: Always use `env(safe-area-inset-*)` for sticky headers and footers.
2. **Touch Targets**: Minimum 44x44px for all interactive elements.
3. **Viewport**: `viewport-fit=cover` to handle notches.
4. **Input Handling**: Use `inputmode="search"` and avoid font sizes below 16px to prevent auto-zoom.

## Component Map
- `MobileBottomNav`: iOS-style tab bar.
- `CategoryChips`: Horizontal scroll for filter discovery.
- `NavigationButtons`: Floating actions for navigation.
