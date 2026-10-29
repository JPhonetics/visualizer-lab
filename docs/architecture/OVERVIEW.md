# Visualizer Lab — Architecture Overview

## Stack

- React
- JavaScript
- Vite
- React Router
- CSS
- browser storage for local preferences and future local-first projects

## Current source structure

```text
src/
├── app/
│   └── App.jsx
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── editor/
│   ├── preview/
│   └── theme/
├── hooks/
├── pages/
├── styles/
├── index.css
└── main.jsx
```

## Responsibility boundaries

### `components/layout`

Application composition and structural layout.

### `components/ui`

Generic reusable UI primitives.

### `features`

Reusable application capabilities.

### `pages`

Route-level views.

## Application shell

```text
App
└── AppShell
    ├── TopBar
    └── Workspace
        ├── Sidebar
        ├── EditorPanel or collapsed Editor rail
        ├── WorkspaceDivider
        └── PreviewPanel or collapsed Preview rail
```

## Editor architecture

AppShell owns a session with one immutable CodeMirror EditorState per language.
EditorPanel owns the transient selected tab. CodeEditor creates a view for that
language and retains each transaction's state in the session; cleanup destroys
only the view. Text, selection and undo history survive panel/tab unmounting.
No keystroke updates React shell state. The project controller separately batches
text persistence; refresh restores source but resets editor history. Preview subscribes to cached text snapshots independently
through useSyncExternalStore; selection-only transactions do not notify it.

The workspace route is loaded lazily, so standalone Visualized does not fetch the
CodeMirror workspace bundle. Editor CSS follows the existing theme variables.

## Preview architecture

```text
PreviewPanel
├── PreviewToolbar
├── PreviewViewport
│   └── PreviewFrame
├── usePreviewControls
└── usePreviewSize
```

`useDebouncedSources` delays document updates by 200ms; Reload flushes the latest
source immediately. `previewDocument.js` parses HTML in a detached document,
then adds the enabled CSS and JavaScript editor layers. PreviewFrame uses an
opaque-origin sandbox (allow-scripts only when enabled, never allow-same-origin).
Changing JS permission remounts the frame to stop previously running scripts.

AppShell owns the in-memory standalone snapshot registry. A UUID in the URL
identifies a BroadcastChannel handoff; source never enters URLs or browser storage.
A standalone tab receives a fixed copy, then closes its channel. Registry channels
remain until workspace unmount so refresh can retrieve the original copy. A loaded
standalone tab survives workspace closure, but refreshing it then reports the
snapshot unavailable. Missing/blocked messaging is handled explicitly.

This is an execution boundary, not a resource limiter: arbitrary user scripts can
still loop or make network requests within browser sandbox permissions.

## Resize architecture

Expected interaction:

```text
pointerdown
→ set pointer capture
→ capture initial geometry

pointermove
→ store newest pointer position
→ requestAnimationFrame
→ update visual layout

pointerup / pointercancel
→ finalize value
→ persist final state once
```

## Local-first direction

Future Saved Work should begin local-first.

Preferred progression:
1. local project storage
2. export/import
3. compact share links where practical
4. optional cloud accounts/sync later

This keeps the application useful without requiring a backend early.

## Future execution visualizers

JavaScript and Python visualizers should share the application shell but own language-specific execution and visualization logic.

Do not force language execution visualization into the Frontend Preview architecture.

## Local project ownership

AppShell owns a project workspace controller. React subscribes to session identity
so opening/new work replaces mounted editor views; Sidebar subscribes to library
and save-status snapshots. Text subscriptions batch persistence separately from
Preview updates. The controller outlives Sidebar/Editor collapse and cleans up
storage/page lifecycle listeners on workspace unmount.

See [Local Projects](../milestones/LOCAL_PROJECTS.md) for schema, bounds, conflict
detection, failure handling and manual acceptance. Layout preference ownership is
unchanged. Project sources now persist intentionally; temporary standalone snapshot
channels remain ephemeral.
