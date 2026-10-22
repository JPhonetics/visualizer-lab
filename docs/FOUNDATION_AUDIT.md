# Frontend Foundation audit — 2026-10-22

## Baseline and scope

Audited `feature/app-shell` at `c5f6b99`, with a clean starting working tree.
Read AGENTS.md, codex/FIRST_TASK.md, codex/HANDOFF_PROMPT.md and its referenced
product, architecture, lifecycle, testing, roadmap and release documents.
This began as a source audit against FOUNDATION_DEFINITION_OF_DONE.md. The user
subsequently reported the Foundation manual review passed on 2026-10-22. That is
human-reported verification; Codex did not execute browser interactions. Browser,
screen-reader and viewport details were not separately recorded. No later phase
has started.

## Definition of Done assessment

| Area | Evidence and status |
| --- | --- |
| Workspace and routes | `/frontend` and `/frontend/visualized` are implemented. Selector offers only Frontend. Legacy JavaScript/Python routes are explicit placeholders. Root and unknown routes now resolve to Frontend regardless of old storage. |
| Resize | Sidebar, Templates and Editor/Preview use pointer capture, animation-frame visual updates, and final persistent updates. Source inspection supports the intended architecture; manual Foundation review was reported passed by the user. |
| Collapse | Sidebar/Templates use persisted flags. Editor/Preview share one collapsed-panel value, preventing both from remaining collapsed. User reported the manual Foundation review passed. |
| Editor tabs | HTML/CSS/JavaScript selection is transient. Folder-tab appearance is preserved; linked tab panels and roving keyboard focus are implemented, included in the user-reported manual review pass. Editor content remains a placeholder. |
| Preview | Modular controls, iframe reload, device widths, zoom, measured size and standalone view exist. CSS/JS switches change control state only; altering rendered content belongs to Phase 4. Standalone URL values initialize controls, so refreshing that URL restores those supplied values; workspace controls reset. |
| Theme/persistence | Layout persistence matches intended ownership. Theme now tolerates storage read/write failures. Shared persistence hook catches access/JSON errors but does not validate parseable values against types/ranges. |
| Styling | Shared and Visualized styles remain separate. Targeted focus/hidden-panel styles, charcoal/teal dark colors and native system typography were added. User reported the manual layout review passed; broader CSS cleanup is not part of this checkpoint. |
| Routing/hosting | BrowserRouter plus public/404.html and index recovery script exist. Recovery assumes a domain-root deployment; GitHub project subpaths are not configured. Local HTTP fallback is not proof of GitHub Pages behavior. Production refresh remains unverified. |
| Engineering | No dependencies added. Resize and Preview architecture retained. Stale HashRouter and home-redirect comments corrected. Other extensive learning comments retained pending stabilization. |
| Validation | Baseline lint failed on ZoomControl's synchronous effect state update; production build passed. After fixes lint/build and diff whitespace checks pass. Vite production preview returned HTTP 200 for both application routes and `/404.html`; this checks serving only, not rendered interactions or hosting recovery. No automated test scripts or test framework exist. |
| Review | Independent read-only subagent reviewed source against codex/REVIEWER.md; storage/routing findings addressed. Keyboard resize, tab and selector findings are addressed in source; user reported the manual Foundation review passed. User authorized the shell checkpoint commit and creation of the testing branch. |
| Release | Existing checkpoint commit is on feature/app-shell. README/changelog were stubs. Package remains 0.0.0; 0.1.0 is the planned milestone, not a completed release. No CI, release or deployment workflow exists. |

## Changes in this pass

- Remove redundant zoom draft synchronization effect. Idle text derives from the
  zoom prop; focus seeds the editable draft, preserving partial input.
- Make root routing independent of stale or inaccessible storage.
- Catch theme storage failures so the theme works for the current session.
- Correct affected comments and document current behavior and validation gaps.
- Complete keyboard resizing, Editor tab semantics and selector focus behavior;
  see the accessibility continuation and manual checklist below.

Acceptance: lint/build pass; no dependency, pointer-drag architecture or Preview state
ownership changes; root chooses Frontend; denied storage does not throw from theme
storage calls. The user has reported the manual Foundation review passed; automated coverage is still deferred.

## Remaining blockers and review findings

- Keyboard resize handles, linked Editor tabs, and selector Escape/focus behavior
  are implemented. User reported the manual Foundation review passed; tool/browser details were not supplied.
- The [manual browser checklist](FOUNDATION_MANUAL_CHECKLIST.md) was reported
  passed by the user. This clears the manual application-shell checkpoint gate;
  the user subsequently authorized the checkpoint commit and testing branch.
- Important: meaningful regression coverage and CI must precede merge, but are
  intentionally deferred until the dedicated testing foundation task.
- Follow-up: validate parseable but invalid saved layout preferences.
- Hosting blocker: verify direct refresh on the selected deployment path; do not
  treat Vite fallback as production-host verification.

No Definition of Done boxes are checked solely from source inspection. The
foundation is not yet ready for merge or release.

## Accessibility continuation

- All three resize handles are focusable named separators with orientation,
  bounds and current values. Arrows resize; Home/End select limits. The split
  handle leaves the Tab order while a panel is collapsed.
- Keyboard actions commit discrete layout preferences; active pointer drags keep
  their capture, animation-frame updates and final-only persistence.
- Editor tabs use roving focus, Left/Right/Home/End and linked hidden tab panels.
- Frontend selector closes on Escape with focus restored, on selection, on outside
  pointer interaction and when focus leaves its disclosure.
- Preview device selection has a dedicated polite status announcement and
  consistent outline device icons; changing measured dimensions is no longer a
  live announcement. The user reported the manual review passed.
- Dark theme uses charcoal surfaces, teal accents and softer dividers, following
  the supplied visual reference; light theme and shell geometry are preserved.
- Thin resize handles have visible focus styles. No dependencies or testing
  infrastructure were added. Application changes remain on feature/app-shell.
- Lint, production build and diff whitespace checks pass after these changes.
  An ad hoc Node check passed 36 assertions for arrow/Home/End handling, bounds
  and default prevention. No persistent test setup was added. Automated browser
  interaction tests were not run; no test scripts exist. The user reported the
  manual browser checklist passed. Independent reviewer inspected the resulting diff.

## Safest sequence

1. Finish the accessibility and browser-verified UI polish on feature/app-shell;
   keep fixes focused and attach regression cases to the testing plan.
2. With explicit commit authorization, checkpoint this audited shell logically.
   Preserve feature/app-shell; do not merge it yet.
3. Schedule feature/testing-foundation next, before any major feature work
   (handoff option A). Start from the approved shell checkpoint so tests target
   this implementation. Add the documented Vitest/RTL and Playwright setup, with
   regressions for zoom, storage failures, route defaults and layout persistence.
4. Add pull-request CI for lint, tests and build; add the E2E smoke path. Document
   supported runtime, installation and test commands, and address review findings.
5. Obtain human review and explicit approval before merging the foundation.
6. When Definition of Done and CI pass, prepare package/changelog 0.1.0 and release
   notes; tag/publish only as authorized. Do not label the current state released.
7. In the deployment phase, configure GitHub Pages/domain path, deploy automation,
   HTTPS and direct-route verification. Deploy only with explicit instruction.

The user subsequently authorized the application-shell checkpoint and proceeding
to the dedicated testing-foundation branch. Testing foundation and CI remain
scheduled work. Release, merge and deployment still require separate approval.
