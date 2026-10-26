# Changelog

## [Unreleased]

### Testing
- Add Vitest/React Testing Library regressions and Chromium production-build smoke tests.
- Add coverage reporting and read-only pull-request validation CI.
- Update compatible locked development dependencies to resolve setup audit findings.

### Added
- React/Vite Frontend workspace shell with resizable and collapsible layout,
  persisted layout preferences, theme control and Frontend selector.
- Modular sample Preview with viewport, zoom, reload and standalone Visualized view.

### Changed
- Use native system interface typography, preferring Segoe UI on Windows.
- Use charcoal dark surfaces, teal-green accents and softer shell dividers.
- Replace device emoji with consistent monitor, tablet and phone outline icons.

### Fixed
- Announce Preview device selections through a dedicated screen-reader status.
- Add keyboard resizing and accessible separator values for layout controls.
- Complete Editor tab navigation/panel relationships and selector Escape dismissal.
- Remove redundant zoom input synchronization that failed React hooks lint.
- Route root visits to Frontend instead of restoring unimplemented visualizers.
- Keep theme selection usable when browser storage is unavailable.

### Documentation
- Record the Foundation audit, open blockers and testing/CI/release sequence.
- Document current development commands, placeholder behavior and hosting limits.
