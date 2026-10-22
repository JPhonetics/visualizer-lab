# Frontend Foundation manual browser verification

Status: user reported the Foundation review passed in this chat on 2026-10-22.
This records human verification, not automated browser execution by Codex.
Browser/version, screen-reader version and viewport results were not separately
recorded. Production-host checks remain deferred as described below.

Repeatable procedure: lint/build and source review do not replace these checks. Use `npm run build` then `npm run preview`; open the URL Vite prints.
Record browser/version, OS, viewport dimensions, pass/fail and reproduction steps.
Use a Chromium browser and Firefox; perform the keyboard/screen-reader checks with
NVDA on Windows (or your available screen reader). No new test tooling is required.

## Keyboard and accessibility

1. At `/frontend`, navigate with Tab and Shift+Tab. Every available control must
   show visible focus without trapping it. Enter/Space must activate buttons.
   Search, Format, Help, Coffee, Saved Work and Templates content remain foundation
   placeholders; do not expect implemented product actions.
2. Focus Frontend and press Enter/Space. The dropdown opens with only Frontend.
   Tab reaches its option. Escape from the option closes it and returns focus to
   the trigger. Reopen and select Frontend: close and return focus to the trigger.
   Reopen and Tab out or click elsewhere: close without stealing destination focus.
3. Tab to the Templates height separator. Up grows and Down shrinks by 10px;
   Home sets 120px; End sets the lesser of 360px and Sidebar height minus 180px
   (with a 120px floor). Repeated keys stop at the limits without scrolling.
   In a shortened window, focusing the handle clamps an oversized saved height.
4. Tab to the Workspace sidebar width separator. Right grows and Left shrinks
   by 10px. Home sets 180px; End sets 360px. Repeated keys respect both limits.
5. Tab to the Editor width separator. Right grows and Left shrinks the Editor
   share by 5 percentage points; Home sets 25%; End sets 75%. Preview receives the
   remaining share. Tab/Shift+Tab leave the handle normally; unrelated keys do not
   resize. Refresh after each keyboard resize: the final preference survives.
6. Tab into Editor language tabs: only the selected tab is a Tab stop. Right/Left
   switch and focus the adjacent language, wrapping HTML ↔ JavaScript. Home chooses
   HTML; End chooses JavaScript. Tab leaves the tablist; only the active panel is
   visible/focusable. Pointer clicks still switch tabs and folder styling matches.
7. With a screen reader, confirm resize controls announce their names, orientation,
   current size and bounds. Confirm language tab selection and the corresponding
   named tab panel. Confirm the selector's expanded/collapsed state. Repeat resize
   checks in screen-reader interaction/focus mode so keys reach the controls.
8. Activate Editor collapse and the collapsed rail restore by keyboard; repeat
   for Preview. Focus must remain visible/recoverable, with no keyboard trap.
   The split separator must be absent from Tab order while either is collapsed
   and must not resize. Restore and confirm it becomes keyboard-operable again.
   Collapse the opposite panel while one is collapsed: the first restores; both
   cannot remain collapsed. Check Sidebar and Templates toggles similarly.

## Pointer, layout and persistence

9. Drag all three resize handles to both limits, including fast movements and
   moving over Preview's iframe. Release outside the handle; no stuck drag or
   continued resizing. Interrupt a drag by switching applications or another
   available pointer-cancellation gesture; the shell remains usable afterward.
   Refresh: final sizes survive. If DevTools is available, inspect Storage or
   trace `Storage.prototype.setItem`: layout writes occur at drag completion,
   not repeatedly during pointer movement. Keyboard presses commit separately.
10. Collapse/restore Sidebar, Templates, Editor and Preview, then refresh each
    state. Flags/sizes survive; restored panel split matches the previous value.
    Header lines and collapsed rails align; text/icons are not clipped.
11. Repeat the layout checks at approximately 1440×900, 900×700 and 390×844,
    and at 200% browser zoom. Check reachable controls, no overlapping text or
    unusable overflow, visible resize focus, legible tabs and shared header sizing.
    Check both Light and Dark. Record any narrow-screen issue rather than treating
    a successful desktop check as responsive sign-off.

## Preview and standalone view

12. With a screen reader active, cycle Desktop → Tablet → Phone → Desktop using
    keyboard and pointer. Each change should announce the selected device and
    its width constraint, without repeated dimension announcements while resizing.
    Confirm matching monitor/tablet/phone outline icons. Width is available space, capped at
    768px/390px for Tablet/Phone; size readout follows layout/window changes. Open
    zoom: type 125 and press Enter; type an empty value and blur (retain current);
    type 1/999 and blur (clamp to 50/200). Move slider; Reset to 100 works and is
    disabled at 100. Escape/outside click closes popup. Zoom changes presentation
    without changing the responsive size readout. Reload recreates the iframe.
13. Toggle CSS/JS and choose CSS editor tab, Phone and 125% zoom. Refresh workspace:
    HTML, enabled CSS/JS, Desktop and 100% return, while layout preferences remain.
    CSS/JS switches currently change button state only, not sample document output.
14. Open Visualized with Phone, 125%, CSS off and JS off. New tab has transferred
    settings and title `Visualized - Visualizer Lab`. Dock hides/shows with its
    tab by keyboard and pointer; dimensions remain visible when collapsed. Check
    zoom/device/reload and narrow layout there. Refresh: URL-supplied initial
    settings return; dock starts expanded. Opening bare `/frontend/visualized`
    starts with default settings.

## Routing, theme and failure handling

15. Visit `/`, `/frontend`, `/frontend/visualized` and an unknown URL directly,
    then refresh each. Root/unknown end at Frontend; workspace title is
    `Frontend - Visualizer Lab`. Browser back/forward remains usable. With the
    legacy `visualizerLab.lastVisualizer` set to `python` or `javascript`, root
    still opens Frontend. Direct legacy language URLs remain intentional
    placeholders; they must not appear in the selector.
16. Cycle System → Light → Dark → System; refresh each choice in workspace.
    In System mode, changing OS appearance updates the theme; explicit Light/Dark
    ignores OS changes. With site storage denied (if browser supports it), loading
    and changing theme remains usable with no uncaught storage exception.

Production-host direct refresh, custom domain, HTTPS and the 404 recovery round
trip are deferred to the authorized deployment phase. Local Vite route serving
cannot verify them. Report each unchecked item as pending, not passed.
