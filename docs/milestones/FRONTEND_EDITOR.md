# Phase 3 — Real Frontend Editor

Active scope: move from the validated shell into editable HTML/CSS/JavaScript.
Deployment is published; certificate provisioning/HTTPS verification remain open
external tasks. This milestone does not claim that deployment verification is done.

## Acceptance criteria

- Each language tab presents a named, keyboard-accessible CodeMirror editor.
- Language-aware highlighting, line numbers, indentation and undo/redo work.
- Each language retains its own text, selection and undo history across tab
  switches and Editor collapse/restore during the same workspace session.
- Tab/Shift+Tab can leave the editor; no default Tab indentation trap is introduced.
- Editor input never executes in the parent page and does not alter Preview yet.
- Source text is not written to localStorage. Refresh begins with empty documents.
  Layout/theme persistence and transient tab/Preview controls retain their rules.
- Existing resize/collapse, theme, responsive layout and standalone Preview work.
- Tests cover state retention/undo and real-browser typing, keyboard exit,
  collapse/restore, refresh, and the absence of Preview execution/wiring.
- Lint, tests, both production builds and browser suites pass; independent review.

## Architecture impact

Add a small editor feature area. AppShell owns a session of three EditorState
objects in memory; CodeMirror owns document transactions and undo history.
EditorPanel retains tab UI ownership and mounts the corresponding view. View
cleanup destroys DOM/listeners without discarding the workspace-owned session.
This avoids React re-rendering the shell or writing storage on each keystroke.

Dependencies: CodeMirror state/view/commands/language and the three language
packages. Tab is reserved for focus traversal; indentation uses the supported
editing commands instead. Existing shell CSS remains shared; editor-specific
styling lives in a new editor stylesheet.

## Exclusions

No live editor-to-Preview wiring, real code execution, formatting/help feature,
Templates, Saved Work, export/import, language visualizers or cloud work.
Preview integration is Phase 4. Refresh persistence/project storage is Phase 5.
No commit, merge, release or deployment of this editor is authorized by its checks.


## Manual review on the feature branch

1. Type distinct HTML, CSS and JavaScript into their named editors.
2. Switch tabs and collapse/restore Editor; text remains. Undo/redo in one language
   affects that document only, including after collapse/restore.
3. From the editor, press Tab to leave and Shift+Tab to return. Check language-tab
   arrow navigation and visible focus in both themes.
4. Resize the workspace and use long/multiline content; scrolling remains inside
   the editor. Check a narrow browser window and keyboard zoom.
5. Confirm Preview stays the sample and typed JavaScript does not execute.
6. Refresh deliberately: document text resets while layout preferences survive.

No commit, merge or publication of the editor is performed before checkpoint
approval. The deployed foundation is not changed by this local feature branch.

## Local validation

Fresh locked install succeeds with zero reported vulnerabilities. Lint, 36 tests,
coverage reporting, the normal production build and Pages build pass. The Foundation, editor and Pages Chromium checks pass. Browser checks now include
selection restoration across tabs/collapse, per-platform undo/redo, keyboard exit,
long-document scrolling, theme inheritance and a narrow viewport. Independent
review found no blocking findings. Screen-reader editing and user-platform visual/
shortcut review remain manual checks before the checkpoint.

A compatible transitive Zod patch cleared an audit finding discovered during
installation. Lazy workspace loading removed the single-bundle size warning;
standalone Preview does not request the workspace/editor chunk.

## Human review reported

The user confirmed text remains when switching language tabs and collapsing/
restoring the editor; Ctrl+Z/Ctrl+Y work; Tab and arrows navigate language tabs;
and Sidebar/Preview resizing does not change document content. This records
those specific observations, not a blanket pass of every manual checklist item.
The user also confirmed scrolling and refresh/reset behavior. Light-theme keyword
and string colors were reported difficult to read and changed to more distinct
blue/red colors; the user subsequently accepted this palette adjustment. Screen-reader editing
has not separately been reported.


Light palette follow-up: keyword and string colors use blue/red for greater visual
distinction. Lint, 36 tests, production builds and the updated editor/Pages browser
checks pass; independent review found no blockers. Browser assertions check actual
token colors, text retention and at least 4.5:1 contrast against editor and active-line
backgrounds in both Light and Dark. The user accepted the revised Light palette.


The user approved committing this editor milestone, pushing the feature branch
and opening a draft PR for hosted validation. Merge and publication remain separate
approvals; the deployed foundation has not been replaced with this editor.


Hosted CI initially exposed a title assertion racing the lazy workspace's passive
effect. The integration check now waits for the exact title, and setup clears the
title between tests to avoid stale-value false positives. No production behavior
was changed for this test timing correction.
