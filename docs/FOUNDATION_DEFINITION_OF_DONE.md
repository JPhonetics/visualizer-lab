# Frontend Foundation — Definition of Done

Evidence updated 2026-10-26: user-reported manual Foundation review, independent
source review, 27 automated tests, production-build Chromium smoke tests and
successful hosted PR/main validation. Checked items apply to Foundation scope
(editor and CSS/JS execution remain placeholders). No release or deployment is
claimed. Actual-host direct refresh remains pending publication; duplicate/stale
CSS cleanup has not been claimed as complete.

## Product behavior
- [x] `/frontend` loads correctly.
- [x] Frontend is the only available Visualizer.
- [x] Visualizer selector behaves as a real dropdown.
- [x] Sidebar expand/collapse works.
- [x] Sidebar resize works smoothly.
- [x] Template resize works smoothly.
- [x] Editor/Preview resize works smoothly.
- [x] Editor collapse works.
- [x] Preview collapse works.
- [x] Collapsed rails align with shared header height.
- [x] Both Editor and Preview cannot remain collapsed simultaneously.
- [x] HTML/CSS/JavaScript folder tabs retain intended appearance.
- [x] Preview controls work.
- [x] Visualized view works.
- [x] Theme works.
- [x] persistent layout preferences survive refresh.
- [x] transient Preview controls reset as intended.

## Layout / styling
- [x] compact header sizing is intentional.
- [x] collapsed header lines align.
- [x] sidebar typography/control sizing is consistent.
- [x] no broad stylesheet regression exists.
- [x] Visualized-only styling remains isolated appropriately.
- [ ] duplicate/stale CSS is removed when safe.

## Routing
- [x] `/frontend` works.
- [x] `/frontend/visualized` works.
- [x] browser titles are correct.
- [ ] production direct-route refresh is supported.
- [x] unknown routes behave intentionally.

## Engineering
- [x] no unnecessary dependencies.
- [x] pointer capture remains intact.
- [x] requestAnimationFrame resize behavior remains intact.
- [x] persistence rules match architecture docs.
- [x] comments are accurate.
- [x] no major dead/duplicate implementation remains.

## Validation
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] production output is smoke-tested.
- [x] routes are manually checked.
- [x] independent review completed.
- [x] findings addressed or accepted.

## Testing lifecycle
- [x] automated testing foundation exists OR a dedicated next testing branch is explicitly scheduled before major feature work.
- [x] critical foundation behavior has meaningful automated coverage once the testing foundation is established.
- [x] CI runs validation before merge.

## Version control / release
- [x] foundation work is committed on `feature/app-shell`.
- [x] commit history is understandable.
- [x] human review completed.
- [x] changelog updated.
- [x] merge only after approval.
- [x] release version chosen intentionally.
