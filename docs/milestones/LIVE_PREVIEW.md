# Live Preview — Phase 4

## Requirement and scope

Connect the merged Frontend editor to isolated rendered output. This phase adds
no project saving, Templates, sharing service, dependencies or other visualizers.
The existing resize, theme, layout persistence and modular Preview architecture
remain intact. Source is ephemeral and resets on refresh.

## Acceptance criteria

- HTML fragments and complete documents render after 200ms without editing activity.
- CSS adds the CSS editor stylesheet; switching CSS off removes that layer only.
  Inline HTML styles and HTML style elements remain part of the HTML document.
- JavaScript runs inside an opaque-origin iframe. JS off blocks all scripts,
  including inline HTML scripts, and destroys previously running frame scripts.
- Reload flushes pending edits and recreates the frame, rerunning enabled scripts.
- Editor text cannot execute inside or read the parent application DOM.
- Device size, zoom, collapse and editor history behavior remain unchanged.
- Open New Tab captures the latest source and initial Preview settings. The new
  tab is a fixed snapshot, with independent controls and no source in URL/storage.
- Standalone refresh can retrieve that original snapshot while its workspace is
  open, including when workspace Preview is collapsed. After workspace closure,
  loaded output remains usable; a refresh shows an unavailable message.
- A direct standalone URL without a snapshot explains how to open one. Missing or
  blocked messaging fails gracefully without crashing the app.

## Human browser review before commit

Open `/frontend` at the URL printed by the development server and refresh to
load the new milestone. This clears old editor text. Review in your normal browser; automated Chromium covers the same core
flows but does not replace your usability check or screen-reader verification.

1. In HTML enter `<h1 id="result">Hello</h1><button onclick="this.textContent='Clicked'">Try me</button>`.
   Confirm it appears after a brief pause and the button changes to Clicked.
2. In CSS enter `h1 { color: green; }`. Confirm green output. Toggle CSS off/on;
   the heading changes back and forth. HTML inline styles intentionally remain.
3. In JavaScript enter `document.querySelector('#result').textContent = 'JavaScript ran';`.
   Confirm the heading changes. Toggle JS off: Hello returns and the HTML button
   stops responding. Toggle JS on: both scripts work again.
4. Click the HTML button, then Reload Preview. Its label resets to Try me and the
   JavaScript runs again. Make an edit and immediately Reload to confirm latest text.
5. Switch languages, undo/redo, resize and collapse both panels. Confirm source
   remains, output fits the frame, and keyboard focus can leave every editor.
6. Open New Tab. Confirm the output and initial device/zoom settings match. Change
   workspace HTML: standalone stays unchanged. Its controls work independently.
7. Keep the workspace open and refresh standalone: original output returns. Collapse
   workspace Preview and repeat. Close workspace: loaded standalone still works;
   refresh it and confirm the unavailable message. Reopen workspace afterward.
8. Check Light/Dark mode and narrow width for readable output controls and errors.
   If using a screen reader, check named editors, device-change announcement and
   snapshot failure announcement. Preview contents use the semantics you author.

## Validation and review

Regression coverage includes document assembly, text subscriptions, debounce and
flush, handoff validation/timeout/API failure, immutable snapshots, actual browser
script isolation, toggles, reload and standalone lifecycle. Run lint, unit/component
suite, production build, Chromium E2E and Pages route E2E. Obtain an independent
read-only review.

Acceptance recorded October 28, 2026: James reported completing checks 1–8 and
confirmed the behavior works. Full workspace refresh clearing sources was clarified
as intentional for this milestone; Reload Preview retains editor text. Dedicated
screen-reader testing was not separately confirmed.

Validation: lint, 50 unit/component tests with coverage, production build, eight
Chromium E2E tests and three Pages route tests passed. Independent review found
no blocking findings. HTTPS certificate provisioning remains a separate deployment
sign-off item.

No Phase 4 commit, merge or deployment is implied by implementation approval.
