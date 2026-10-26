# Frontend Foundation — Definition of Done

## Product behavior
- [ ] `/frontend` loads correctly.
- [ ] Frontend is the only available Visualizer.
- [ ] Visualizer selector behaves as a real dropdown.
- [ ] Sidebar expand/collapse works.
- [ ] Sidebar resize works smoothly.
- [ ] Template resize works smoothly.
- [ ] Editor/Preview resize works smoothly.
- [ ] Editor collapse works.
- [ ] Preview collapse works.
- [ ] Collapsed rails align with shared header height.
- [ ] Both Editor and Preview cannot remain collapsed simultaneously.
- [ ] HTML/CSS/JavaScript folder tabs retain intended appearance.
- [ ] Preview controls work.
- [ ] Visualized view works.
- [ ] Theme works.
- [ ] persistent layout preferences survive refresh.
- [ ] transient Preview controls reset as intended.

## Layout / styling
- [ ] compact header sizing is intentional.
- [ ] collapsed header lines align.
- [ ] sidebar typography/control sizing is consistent.
- [ ] no broad stylesheet regression exists.
- [ ] Visualized-only styling remains isolated appropriately.
- [ ] duplicate/stale CSS is removed when safe.

## Routing
- [ ] `/frontend` works.
- [ ] `/frontend/visualized` works.
- [ ] browser titles are correct.
- [ ] production direct-route refresh is supported.
- [ ] unknown routes behave intentionally.

## Engineering
- [ ] no unnecessary dependencies.
- [ ] pointer capture remains intact.
- [ ] requestAnimationFrame resize behavior remains intact.
- [ ] persistence rules match architecture docs.
- [ ] comments are accurate.
- [ ] no major dead/duplicate implementation remains.

## Validation
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] production output is smoke-tested.
- [ ] routes are manually checked.
- [ ] independent review completed.
- [ ] findings addressed or accepted.

## Testing lifecycle
- [ ] automated testing foundation exists OR a dedicated next testing branch is explicitly scheduled before major feature work.
- [ ] critical foundation behavior has meaningful automated coverage once the testing foundation is established.
- [ ] CI runs validation before merge.

## Version control / release
- [ ] foundation work is committed on `feature/app-shell`.
- [ ] commit history is understandable.
- [ ] human review completed.
- [ ] changelog updated.
- [ ] merge only after approval.
- [ ] release version chosen intentionally.
