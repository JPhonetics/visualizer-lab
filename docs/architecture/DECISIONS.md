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
