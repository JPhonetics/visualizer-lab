# Visualizer Lab Repository Instructions

## Purpose

Visualizer Lab is both a real application and a long-term learning/reference repository.

The codebase should demonstrate disciplined, understandable software development practices that can be revisited later as an example of how to plan, build, test, review, version, release, and deploy an application.

## Current milestone

Finish and stabilize the **Frontend Foundation** before starting major feature development.

Do not start CodeMirror, real editor execution, Templates functionality, Saved Work functionality, JavaScript/Python visualizers, or cloud features unless the active task explicitly moves the roadmap into that phase.

## Working principles

- Prefer small, focused changes.
- Preserve working architecture unless a change is necessary.
- Do not redesign unrelated UI.
- Reuse existing components and hooks before creating new ones.
- Avoid cleverness that reduces readability.
- Do not silently add dependencies.
- Keep behavior, tests, comments, and documentation synchronized.
- Treat accessibility and responsive behavior as implementation requirements.
- Treat testing and release discipline as part of the feature, not optional cleanup.

## Formatting

- Use 4 spaces for indentation.
- Use double quotes for JavaScript and JSX strings.
- Keep imports organized and alphabetized where practical.
- Follow existing naming and file-organization conventions.
- Preserve semantic HTML and appropriate accessibility attributes.

## Documentation during active development

Keep implementation comments concise while architecture is still changing.

Maintain:
- short file/component purpose
- important architectural reasoning
- non-obvious behavior
- browser API behavior
- important cross-file dependencies
- warnings about behavior that must not regress

Do not expand routine code into textbook-length explanations during active development.

Do not delete useful existing learning comments just to shorten files.

A deeper teaching/reference documentation pass happens after the implementation stabilizes.

## Required development lifecycle

For meaningful work, follow this lifecycle:

1. Define or identify the requirement.
2. Add or update acceptance criteria when needed.
3. Confirm architecture impact.
4. Work on a feature branch.
5. Implement the smallest coherent change.
6. Add or update automated tests.
7. Run lint, tests, and production build.
8. Perform a self-review.
9. Perform an independent reviewer pass when practical.
10. Address blocking findings.
11. Commit logically.
12. Update changelog/release notes when appropriate.
13. Merge only after human approval.
14. Deploy through the documented deployment path.
15. Verify production after deployment.

## Testing policy

New behavior should be testable.

When adding meaningful logic:
- add unit tests for utilities/hooks where appropriate
- add component tests for UI behavior where appropriate
- add integration tests for cross-component behavior where appropriate
- add end-to-end tests for important user flows when the project reaches that layer

Do not write tests merely for coverage percentage.

Prefer tests that prove behavior users or maintainers care about.

A bug fix should normally include a regression test when practical.

## Important architecture constraints

### Resize behavior

Do not regress the existing resize architecture.

Preserve:
- pointer capture where currently used
- requestAnimationFrame-based visual updates where currently used
- final persistent-state updates at the end of a drag rather than repeated localStorage writes during dragging

### Persistence

Persistent layout preferences may use `useLocalStorageState`.

Current intent is to persist layout preferences but not transient Preview controls.

Persist:
- theme
- sidebar expanded/collapsed state
- sidebar width
- editor/preview split
- template expanded/collapsed state
- template height
- editor/preview collapsed state

Do not persist:
- active editor language tab
- CSS enabled state
- JavaScript enabled state
- Preview device mode
- Preview zoom

### Preview

Keep Preview behavior modular.

Current Preview feature area includes:
- `previewDocument.js`
- `PreviewFrame.jsx`
- `PreviewToolbar.jsx`
- `PreviewViewport.jsx`
- `usePreviewControls.js`
- `usePreviewSize.js`
- `ZoomControl.jsx`

Do not collapse this into a monolithic component without a strong architectural reason.

### Styling

Treat the existing visual design as intentional.

Do not replace an entire stylesheet to make a small visual adjustment.

Prefer targeted selector changes.

Keep:
- `app-shell.css` for shared shell and reusable Preview/control styles
- `visualized-page.css` for standalone Visualized-page-specific layout and overrides

### Routing

Only Frontend should be presented as an available visualizer until another visualizer is actually implemented.

## Validation commands

At minimum after meaningful implementation work:

```bash
npm run lint
npm test
npm run build
```

When relevant:

```bash
npm run test:coverage
npm run test:e2e
npm run preview
```

If these scripts do not exist yet, create the testing infrastructure as part of the appropriate foundation/testing task rather than pretending validation occurred.

Do not claim validation that was not run.

## Git safety

The repository may contain intentional uncommitted work.

Before editing:
- inspect `git status`
- inspect the relevant files
- do not reset, restore, discard, or overwrite unrelated user changes

Do not merge to `main` unless explicitly asked.

Prefer logical commits describing one coherent unit of work.

## Review expectations

Before declaring substantial work complete, review for:
- unrelated changes
- stale comments
- duplicated logic
- architecture drift
- naming inconsistencies
- accessibility regressions
- CSS regressions
- resize regressions
- persistence mistakes
- missing tests
- unnecessary dependencies
- roadmap scope creep
