# Visualizer Lab — User Stories

These stories are intentionally lightweight during active development.

## Frontend Foundation

### Workspace shell

As a learner, I want a stable application workspace so I can focus on code and output without the interface getting in my way.

Acceptance criteria:
- Sidebar, Editor, and Preview render correctly.
- Resize behavior is smooth.
- Collapse behavior is predictable.
- Layout preferences survive refresh where intended.

### Frontend selector

As a learner, I want to know which visualizer I am using so I can understand the current learning environment.

Acceptance criteria:
- Frontend is shown as the active visualizer.
- The selector behaves as a real dropdown.
- Only implemented visualizers are offered.

### Preview controls

As a learner, I want to manipulate how the rendered result is displayed so I can understand responsive behavior and execution.

Acceptance criteria:
- CSS and JavaScript controls are available.
- Reload is available.
- Device width can be changed.
- Zoom can be changed.
- Standalone Visualized view can be opened.

## Real Frontend Editor — Phase 3

As a learner, I want to edit independent HTML, CSS and JavaScript documents in the
workspace, with readable highlighting and predictable keyboard editing.

Acceptance criteria:
- Each language is editable and correctly named for assistive technology.
- Text, selection and undo history survive tab changes and Editor collapse.
- Tab/Shift+Tab can leave the editor without a keyboard trap.
- Documents remain in memory and reset on refresh; layout persistence is unchanged.
- Editing does not execute code or update Preview until Phase 4.
- State/history and real-browser editing have regression coverage.

See [the milestone](../milestones/FRONTEND_EDITOR.md) for scope and review steps.

## Live Preview — Phase 4

As a learner, I want my edited HTML, CSS and JavaScript to update the isolated
Preview so I can immediately see the effect of a change.

Acceptance criteria and the exact human checklist are maintained in
[Live Preview](../milestones/LIVE_PREVIEW.md).

## Future stories

### Saved work — Phase 5

As a learner, I want to save projects locally so I can return to them later without creating an account.

Acceptance and browser review: [Local Projects](../milestones/LOCAL_PROJECTS.md).

### Export and import

As a learner, I want to export a project and import it on another device so my locally saved work is portable.

### Share link

As a learner, I want to share a project with someone else so they can open the same example in Visualizer Lab.

### JavaScript execution visualization

As a learner, I want to step through JavaScript execution so I can see how variables, scope, arrays, and function calls change over time.

### Python execution visualization

As a learner, I want to step through Python execution so I can see how variables, loops, functions, and data structures change over time.

### Visual export

As a learner or instructor, I want to export the current visualization so I can include it in notes, documentation, or teaching material.
