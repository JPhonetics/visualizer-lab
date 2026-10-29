# Visualizer Lab — Architecture Decisions

## ADR-001 — React with JavaScript

Status: Accepted

Decision:
Use React with JavaScript rather than TypeScript during the current learning phase.

## ADR-002 — Modular Preview feature

Status: Accepted

Decision:
Keep Preview controls, measurement, viewport, iframe rendering, and preview-document generation separated.

## ADR-003 — Local-first project storage

Status: Planned

Decision:
Saved Work should initially use browser-side storage instead of requiring user accounts and a backend.

## ADR-004 — Share portability before cloud accounts

Status: Planned

Decision:
Prefer export/import and client-side share mechanisms before building cloud project storage.

## ADR-005 — Deep learning documentation after stabilization

Status: Accepted

Decision:
Keep implementation comments useful but concise during active development. Add detailed learning/reference explanations after architecture stabilizes.


## ADR-006 — Session-owned CodeMirror documents

Status: Implemented on feature/frontend-editor; checkpoint review pending.

Decision:
Use CodeMirror 6 with separate immutable states for HTML, CSS and JavaScript.
AppShell retains those states while EditorPanel views mount/unmount, preserving
selection and history without shell renders/storage writes per keystroke.
Tab remains a focus-traversal key. Theme styles inherit the shared shell tokens.
Load the workspace route lazily so standalone Preview avoids editor dependencies.

Source persistence and editor-to-Preview integration remain later milestones.
Editor dependencies are state/view/commands/language, HTML/CSS/JavaScript support,
and Lezer highlighting tags. No execution runtime or React editor wrapper is added.

## Phase 4 — Live Preview and standalone snapshots

Subscribe to cached editor text snapshots at PreviewPanel, debounce assembly by
200ms, and flush pending source on Reload. This avoids React shell renders per
keystroke and preserves the existing drag/persistence boundaries.

Use detached DOMParser assembly and iframe srcDoc. Allow scripts only when enabled;
never combine script permission with allow-same-origin. Remount on JS permission
changes so disabling scripts also stops prior frame execution.

Standalone Preview receives an immutable in-memory snapshot through a random UUID
BroadcastChannel. Keep source out of query strings and browser storage, preserve
noopener, and retain registry channels until workspace unmount to support refresh.
This is temporary tab handoff, not a Saved Work or portable sharing implementation.
Missing browser support or a closed workspace produces explicit feedback.

## Phase 5 — bounded local projects

Use a versioned localStorage record for one draft and named immutable copies.
The initial whole-library limit is 1,000,000 UTF-16 code units; writes are batched
300ms after source changes with best-effort lifecycle flushing. A single record
avoids partial draft/library writes and requires no dependency. This bounded model
is appropriate for small exercises; adopt IndexedDB with migration when larger
libraries justify asynchronous storage complexity.

Validate on read and preserve malformed/future-version records. Storage failures
remain visible; failed open/new operations must never replace the current editor.
Compare the last-read raw record before writing and pause on external storage
events. This detects ordinary tab conflicts but is not a cross-tab transaction lock.
Saved entries remain unchanged by draft autosave. A persisted savedId links the
draft to an opened/newly saved entry; explicit Save updates it in place.
New work and deletion detach the link. Inline naming avoids native prompt support
limitations in embedded browsers.

The Save action creates the first linked entry when needed; Save As explicitly
names and creates another. Name controls use double-click with Enter/Space/F2
keyboard activation, keeping icon controls compact. Draft edit times change with
text/name edits, independently of the saved version, and persist across refresh.

Saved project order is the version-1 record's array order; display numbers are
derived and never stored as IDs. Reorder writes use the same failure/conflict
protection as saves and leave source timestamps unchanged. Native drag/drop and
explicit up/down controls share one move operation. Reordering is disabled during
search to prevent ambiguity around hidden entries.

Sidebar now has bounded flex height, with a separate scrolling Saved Work list.
Templates keeps its no-shrink dock and existing pointer-capture/rAF resize flow.
