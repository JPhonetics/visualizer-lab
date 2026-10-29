# Visualizer Lab — Testing Strategy

## Goal

The repository should become a useful reference for:
- unit testing
- React component testing
- integration testing
- end-to-end testing
- regression testing

## Recommended tools

### Unit / component / integration
- Vitest
- React Testing Library
- `@testing-library/jest-dom`
- `@testing-library/user-event`

### End-to-end
- Playwright

## Test levels

### Unit tests
Best for utilities, preview document generation, state helpers, hooks with meaningful logic, and future serialization/export helpers.

### Component tests
Best for TopBar dropdown, Editor tabs, Preview controls, Theme control, Sidebar interactions, and collapsed panel controls.

### Integration tests
Best for AppShell layout state, persistence behavior, route-level behavior, and Preview-control interactions.

### End-to-end tests
Best for critical flows such as loading `/frontend`, collapsing panels, device changes, opening Visualized, refreshing direct routes, and later editing/saving/exporting.

## Regression tests

When fixing a bug:
1. reproduce it
2. add a failing test when practical
3. implement the fix
4. confirm the test passes

## Coverage

Coverage is a signal, not the goal.

## Initial testing milestone

Before the project becomes a strong reference implementation, establish:
- Vitest
- React Testing Library
- meaningful unit/component tests
- Playwright
- at least one E2E smoke path
- CI running lint/tests/build


## Implemented testing foundation

`feature/testing-foundation` starts from the human-validated application-shell
checkpoint `daefc21`. Its acceptance criteria are meaningful regression tests,
a reproducible locked installation, passing lint/tests/coverage/build/browser
smoke checks, and a pull-request validation workflow with no deployment behavior.
Application components and state ownership do not change in this phase.

- `tests/unit`: keyboard resize keys, bounds and native default prevention.
- `tests/components`: tab selection/focus/panels, selector dismissal/focus,
  draft zoom input and prop synchronization, and denied theme storage.
- `tests/integration`: root/unknown routing with stale stored selection,
  persistent layout versus transient language/device controls, mutually exclusive
  collapse state, and malformed/unwritable storage recovery.
- `tests/e2e`: real Chromium against a fresh production build; Sidebar drag over
  the iframe with zero intermediate writes and one final write, refresh/collapse,
  device selection/status, standalone settings transfer and direct routes.

`npm test` runs once and exits; `npm run test:watch` is interactive.
`npm run test:coverage` reports all source except the application entry point,
including untested code. It does not count Playwright execution as unit coverage.
No arbitrary percentage threshold is imposed. Coverage is a guide for future
regressions, not evidence of complete correctness.

jsdom supplies storage but no real layout. Its ResizeObserver/matchMedia stubs
only allow component composition; they do not prove measurement, OS-theme events,
or browser rendering. Browser tests use isolated contexts, actual geometry and
pointer events. E2E rebuilds and starts its own strict-port preview at 4178;
it deliberately does not reuse a developer's running server.

Current automated coverage does not include Templates/workspace pointer drags,
pointer cancellation, system-theme change/listener cleanup, zoom slider/reset,
Firefox/WebKit, speech output, or visual comparisons. Retain the manual checklist
for those behaviors. Passing local direct-route tests proves Vite fallback, not
GitHub Pages 404 recovery or production hosting.

`.github/workflows/validate.yml` runs on pull requests, pushes to main and manual
dispatch. It uses Node 24, `npm ci`, lint, coverage, Chromium installation and
E2E (which builds production). Reports/traces are retained for seven days.
The workflow has read-only contents permission and no release/deploy step.
A hosted Actions run and required branch protection are still separate checks;
writing the workflow does not configure GitHub branch protection.

Dependency setup adds only development tools. Compatible updates to locked Vite
(8.3.5) and source-map-js clear the audit findings discovered during installation;
application dependency ranges are unchanged. This phase does not add editor,
Templates, Saved Work, runtime or cloud features.

## Local validation — 2026-10-22

After a fresh `npm ci`: lint passed, all 27 Vitest tests passed, coverage reporting
passed (55.48% statements/lines), production build passed, and all three Chromium
E2E tests passed. npm installation/audit reported zero vulnerabilities. Workflow
YAML parsed locally and diff whitespace checks passed. Independent source review
found no blockers; the documented coverage gaps remain intentional follow-up work.
No hosted GitHub Actions result has been observed. Nothing is merged or deployed.

The workflow setup was checked against the official
[Playwright CI guide](https://playwright.dev/docs/ci-intro).


## Pages preparation — 2026-10-26

The new `npm run test:e2e:pages` builds for the custom-domain root and exercises a
separate static host on port 4179. It runs three Chromium tests for domain-root/
workspace entry and refresh, standalone paths/settings/query/fragment retention,
and a genuine custom 404 response followed by the application redirect. Unlike
normal E2E's Vite preview, this server does not rewrite unknown paths to index.
Both E2E commands are part of PR CI. They rebuild dist, so run them sequentially.
These checks model Pages behavior but do not replace actual-host verification.

The first validation run and post-merge main validation both passed on GitHub:
[PR run](https://github.com/JPhonetics/visualizer-lab/actions/runs/40371722781),
[main run](https://github.com/JPhonetics/visualizer-lab/actions/runs/40372438340).
The earlier "unobserved hosted CI" notes record the initial local-only milestone.

The configured custom domain is visualizerlab.dev, so the build uses `/`, not a
repository prefix. Deployment target tests accept that hostname at its root and
reject a default github.io project URL, a wrong path/host or a missing value.
The workflow obtains this target from configure-pages, not an unchecked user input.


Custom-domain correction validation: the target is visualizerlab.dev, confirmed
with Cloudflare nameservers. Lint, 33 tests, both production builds and all six
Chromium checks pass. Independent review found no domain-consistency blockers.
The former .com target is explicitly rejected by a regression test. DNS records,
repository Pages settings and publication have not been changed.


## Phase 3 editor coverage

State tests cover independent documents/selections, per-language undo/redo and
fresh sessions. A Chromium test types source, switches languages, exercises undo
and redo before/after collapse, checks Tab/Shift+Tab exit, verifies no code storage
or execution and unchanged Preview srcdoc, then refreshes to an empty document.
Existing Foundation and Pages suites remain enabled. jsdom range geometry stubs
only support mounting CodeMirror; actual layout/input behavior is browser-tested.

Editor palette regression checks measure actual keyword/string colors across Light,
Dark and the default System-light appearance, retain document text, and verify
contrast against both editor and active-line backgrounds. They do not simulate an
OS appearance change while System mode is active.

## Phase 4 Live Preview coverage

Document assembly tests cover full HTML/fragments, enabled layers and closing-tag
handling. Session tests prove cached text-only notifications; hook tests cover
200ms debounce, Reload flush and timer cleanup. Snapshot tests cover immutable
handoff, malformed responses, timeout, unsupported/blocked browser APIs and cleanup.
A component regression checks the accessible standalone failure message.

Chromium exercises real HTML/CSS/JS output, inline handlers, script toggle remount,
Reload, denied parent DOM access, standalone snapshot independence, refresh with
collapsed Preview, and unavailable refresh after workspace closure. Existing
editor/history/resize/theme and clean Pages route suites still run.

Human usability and screen-reader review follow
[the Live Preview checklist](../milestones/LIVE_PREVIEW.md). Arbitrary user scripts
are not resource-limited; this milestone adds no execution worker or network policy.

## Phase 5 local projects

Schema/controller tests cover bounded validation, text-only debounce, lifecycle
flush, restoring all languages, immutable copies, fresh sessions, rename/delete,
failed writes/retry, corrupt/future/denied storage, and observed tab conflicts.
Browser tests cover actual page refresh and rendering, confirmations/cancellation,
search, naming/deletion, fresh undo history and multiple workspace tabs. Previous
editor tests now assert persisted source; standalone snapshot tests distinguish
project storage from temporary handoff. Existing layout/theme/Pages checks remain.

Human acceptance follows [Local Projects](../milestones/LOCAL_PROJECTS.md).

Local Projects revisions add coverage for inline rename/Escape, restoring a saved
link, explicit in-place updates, deletion detachment, and older drafts without a
link. Pointer-drag browser checks select the first line in all three languages
in Light/Dark and assert a visible selection layer with translucent active-line
paint; screenshots preserve the result for visual inspection.

Further project controls exercise Save on unlinked and linked drafts, named Save As
and cancellation, double-click/keyboard name activation, and independent persistent
draft/saved edit timestamps.

Reorder tests cover persisted array positions, unchanged source identity/timestamps,
invalid IDs, failed writes, native browser drag and keyboard movement, filtered
numbering and search exclusion. A 25-project browser fixture verifies overflow,
last-row reachability and Templates pointer resizing and refresh persistence.
