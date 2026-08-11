# iOS Architecture Reference

## Overview
Standards for maintaining a high-quality "native-feeling" experience on iOS and iPadOS.

## Layout & Ergonomics
- **Safe Areas**: Always respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Bottom Navigation**: Keep fixed bottom bars on iPhone (80px height including safe area).
- **Touch Targets**: Minimum 44x44 points for all interactive elements.
- **Search Inputs**: Font size must be at least 16px to prevent automatic iOS zoom on focus.
- **Scrolling**: Use `-webkit-overflow-scrolling: touch` and `scrollbar-none` for smooth, clean lists.

## Visual Standards
- **Backdrop Blur**: Use `backdrop-blur-md` with `bg-background/80` for headers and nav bars.
- **Haptic Feedback**: (Future) Trigger haptics via the AppBuild wrapper on meaningful actions.
- **Transitions**: Use CSS `transition-transform` with `hover:scale-110` sparingly but consistently for touch feedback.

## Offline Support
- App must show a clear "Offline Fallback" when network is unavailable.
- Persist critical UI state (active tab, sidebar state) to `localStorage`.
