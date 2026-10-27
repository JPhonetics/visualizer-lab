# Changelog

## [Unreleased]

### Testing
- Add Vitest/React Testing Library regressions and Chromium production-build smoke tests.
- Add coverage reporting and read-only pull-request validation CI.
- Update compatible locked development dependencies to resolve setup audit findings.

### Deployment
- Prepare GitHub Pages hosting on visualizerlab.dev with clean direct-route URLs.
- Add static route/404 entries, Pages-style browser checks, a custom-domain target guard and manual-only publication workflow.

### Added
- Editable CodeMirror HTML, CSS and JavaScript documents with separate session undo/selection state.
- Editor state survives tab changes and collapse without source persistence or Preview execution.
- Load the editor workspace separately from standalone Preview.
- React/Vite Frontend workspace shell with resizable and collapsible layout,
  persisted layout preferences, theme control and Frontend selector.
- Modular sample Preview with viewport, zoom, reload and standalone Visualized view.

### Changed
- Use native system interface typography, preferring Segoe UI on Windows.
- Use charcoal dark surfaces, teal-green accents and softer shell dividers.
- Replace device emoji with consistent monitor, tablet and phone outline icons.

### Fixed
- Use distinct blue keywords and red strings in the Light editor palette, with theme/contrast browser regression checks.
- Announce Preview device selections through a dedicated screen-reader status.
- Add keyboard resizing and accessible separator values for layout controls.
- Complete Editor tab navigation/panel relationships and selector Escape dismissal.
- Remove redundant zoom input synchronization that failed React hooks lint.
- Route root visits to Frontend instead of restoring unimplemented visualizers.
- Keep theme selection usable when browser storage is unavailable.

### Documentation
- Record the Foundation audit, open blockers and testing/CI/release sequence.
- Document current development commands, placeholder behavior and hosting limits.
