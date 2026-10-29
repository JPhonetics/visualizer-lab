# Local Projects — Phase 5

## Requirement and acceptance criteria

Current Work survives workspace refresh in the same browser and origin. Users can
name it, save fixed copies, search saved names, open copies, rename them and delete
them. Opening or starting New Work requires confirmation and resets undo history;
cancel leaves source unchanged. Deleting a saved copy never deletes Current Work.
Save creates and links an initial entry when Current Work is unlinked. Save As
asks for a name and creates a separate linked entry. Open links Current Work to that saved
entry; Save explicitly updates its name/source in place without adding
another row. Autosave restores the draft only, so saved output stays unchanged
until Save is used. The link survives refresh; New Work or deleting the
linked entry clears it. Save remains available for both new and opened work.
Duplicate names are allowed; each compact row and Current Work show their last-edited date/time.
Saved rows are numbered from persisted array order. Current Work shows the linked
saved row number beside its name; it follows reorder changes and stays independent
of search filtering. Unlinked/new work and deleted links show no row number. Filtering retains global numbers.
A top-right Reorder toggle exposes draggable tiles and keyboard up/down buttons;
search and reorder are mutually exclusive to avoid reordering only a hidden subset.
Reordering persists without changing IDs, draft linkage or edit timestamps.

Source storage is separate from persisted layout preferences. Editor language,
CSS/JS switches, device and zoom remain transient. Layout drag/pointer architecture
and modular Preview are preserved. Standalone Preview still uses its own temporary
snapshot handoff; it does not create a saved project.

No Templates, export/import, portable share links, cloud or other visualizers.

The library has no count-based limit. Capacity is the whole-record bound below;
more/larger saved source copies reach it sooner. Saved Work uses a thin, subdued scrollbar near the right border within remaining
Sidebar space while Templates retains its requested height and resize behavior.

## Storage design

Use localStorage for this deliberately bounded initial project library, with no
new dependencies. The serialized draft and all saved copies share one atomic
record, `visualizerLab.projects.v1`, with schema version 1. The limit is 1,000,000
UTF-16 code units for the complete JSON record (roughly 2MB before browser overhead).
Larger work or browser quota/access errors produce an explicit unsaved state.
An IndexedDB migration is appropriate if project scale outgrows this bound.

Autosave follows changed text after 300ms. Selection-only transactions do not
schedule writes. Page hiding, pagehide and workspace cleanup flush pending edits;
these lifecycle events are best effort, so allow the 300ms autosave delay before closing
when possible. Undo/selection history stays in memory and resets on reload/open.
Saved copies include ID, name, timestamp and all three source documents. Drafts
also retain a savedId link and their own edit timestamp. Older local drafts without that optional link load
as unlinked, preserving their source; invalid links are rejected. Missing legacy
draft edit timestamps display “No edits yet” until edited; no date is invented.

The reader validates structure and rejects malformed or unknown-version records
without replacing them. There is no prior project schema to migrate; a future
version must add an explicit migration path before accepting old records. Failed
open/new writes keep the active editor intact. Failed saved-copy mutations leave
the saved list intact. Editing remains usable if persistence is blocked.

Observed storage changes in another tab pause local writes; each write also checks
that the stored record still matches the last version read by this workspace.
This is conflict detection, not atomic multi-tab locking: simultaneous competing
read/write sequences can still race. Use one workspace tab for project editing;
standalone previews are unaffected. Copy any unsaved code before refreshing a
conflicted workspace.

Browser storage is local to the origin/browser/profile. Localhost and the public
site have separate libraries. Clearing site data or browser eviction can remove
projects; private browsing may discard them on exit. No backup/export is provided
in this phase.

## Human browser review

Use `/frontend` at the development server URL, then refresh to load this phase.

1. Enter distinctive HTML, CSS and JavaScript. Pause briefly for autosave. Refresh the whole page: all three documents and output return.
   The active language/Preview controls reset, while layout/theme remain saved.
2. Double-click the Current Work name (or focus it and press Enter/F2) to rename it “Example”; the green checkmark confirms,
   the red X or Escape keeps its name. Click the Save icon. Change HTML, then open Example.
   Cancel first: changed text remains. Open again and confirm: original code and
   output return. Undo must not bring back the replaced project.
3. Double-click the saved name to rename it, then search by its name and an absent
   name. Clear search. The folder opens and the trashcan deletes the saved row.
   Edit the opened copy and choose Save: the row count stays the same.
   Refresh, reopen it and confirm updated source. Save As opens an inline new-copy name field; Cancel/Escape creates nothing,
   and Create copy adds a second row.
4. Delete one copy: cancel first and confirm it remains; then confirm deletion.
   Current Work and the other copy remain, including after refresh.
5. Choose New work: cancel retains everything; confirm produces empty Untitled
   documents. Refresh confirms they stay empty and Saved Work remains.
6. Collapse Sidebar/Editor, edit, resize and switch themes. Expand Sidebar and
   refresh: data remains and controls are readable at narrow widths.
7. Open a second workspace tab. Edit the first and pause briefly for autosave. The
   second reports another-tab changes; edits there remain available to copy but
   cannot overwrite the first tab. Close the second tab after reviewing this.
8. Use keyboard navigation through search and project controls, including
   inline rename fields and browser confirmation dialogs. Check focus after deletion. If using a screen
   reader, verify error announcements and distinguish project controls.

Also drag-select the first line and multiple lines in HTML/CSS/JavaScript in both
themes. The selection should remain visible even on the active line.

Human acceptance recorded October 29, 2026: James accepted Local Projects after
iterative browser review of persistence, two-tab conflict handling, naming, saving,
selection and list/control refinements. Dedicated screen-reader and touch testing
were not separately confirmed. Commit, merge and deployment need separate approval.

Timestamp review: edit Current Work and wait for autosave; its edit time changes
while the saved row's timestamp remains unchanged. Save updates the linked saved
version's time. Both times survive refresh and use your browser's local date/time.

List/resize review: save enough entries to overflow, scroll the Saved Work list,
and enlarge/shrink Templates by dragging and keyboard. Templates should retain
its size and all saved rows should remain reachable. Use the top-right Reorder
button, drag tiles or use up/down buttons, finish and refresh: order and sequential
numbers persist. Search disables reorder until cleared; filtered results retain
their original global numbers. The list/control refinements were included in the October 29 acceptance.

Reorder feedback: the dragged source is dimmed and outlined, and a colored line
marks the target slot (above when moving up, below when moving down). Successful
drag or arrow moves highlight the destination; old → new positions are announced to screen readers
without a visible status line.
Double-up moves directly to the top; boundary buttons are disabled. Confirm these
cues are clear in both themes and test moving a row out of the currently visible
portion of the scroll area. Keyboard focus stays with the moved entry.

## Checkpoint validation

Final checkpoint checks: lint, 66 unit/component tests with coverage, production
build, 19 Chromium E2E tests and three Pages route E2E tests. All checks passed. Independent read-only
review found no blocking findings. No dependency changes were needed.
The deployed site is unchanged; Local Projects remains on codex/local-projects
until an explicitly approved commit/PR and merge.

In Reorder mode the entire tile is draggable; the old handle icon is removed.
Arrow controls remain independent and cannot start a tile drag. Keyboard focus
returns to the moved tile when a boundary arrow becomes disabled.
