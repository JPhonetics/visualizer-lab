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

## Preview architecture

```text
PreviewPanel
├── PreviewToolbar
├── PreviewViewport
│   └── PreviewFrame
├── usePreviewControls
└── usePreviewSize
```

`previewDocument.js` will eventually evolve to combine real editor content.

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
