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
- Clear drag insertion markers, moved-row highlights/position feedback and a move-to-top action for saved projects.
- Numbered, scrollable Saved Work with persisted drag/keyboard reordering while preserving Templates resize space.
- Save creates or updates a linked saved project; Save As creates a named copy.
- Compact Save/Save As/New and folder/trash icons, double-click/keyboard renaming, and visible draft/saved edit timestamps.
- Current Work autosave and refresh restoration with named local saved copies, search, rename, open and delete.
- Versioned bounded project storage, explicit save failures and observed multi-tab conflict detection.
- Live HTML/CSS/JavaScript Preview with debounced updates, immediate Reload and sandboxed script execution.
- Standalone in-memory snapshots with explicit unavailable feedback and no source in URLs/storage.
- Editable CodeMirror HTML, CSS and JavaScript documents with separate session undo/selection state.
- Editor state survives tab changes and collapse without source persistence.
- Load the editor workspace separately from standalone Preview.
- React/Vite Frontend workspace shell with resizable and collapsible layout,
  persisted layout preferences, theme control and Frontend selector.
- Modular Preview with viewport, zoom, reload and standalone Visualized view.

### Changed
- Use native system interface typography, preferring Segoe UI on Windows.
- Use charcoal dark surfaces, teal-green accents and softer shell dividers.
- Replace device emoji with consistent monitor, tablet and phone outline icons.

### Fixed
- Keep editor selections visible on the active line and strengthen Light/Dark highlight colors.
- Use inline project rename fields in browsers that suppress native prompts.
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
