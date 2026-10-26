# Master Codex Handoff Prompt

Continue Visualizer Lab from the current repository state.

Current expected branch:
```text
feature/app-shell
```

The working tree may contain intentional uncommitted and untracked work. Never reset, discard, or restore unrelated changes.

## Read first

1. `AGENTS.md`
2. `docs/product/VISION.md`
3. `docs/product/USER_STORIES.md`
4. `docs/architecture/OVERVIEW.md`
5. `docs/architecture/DECISIONS.md`
6. `docs/development/LIFECYCLE.md`
7. `docs/development/GIT_WORKFLOW.md`
8. `docs/testing/STRATEGY.md`
9. `docs/releases/VERSIONING.md`
10. `docs/ROADMAP.md`
11. `docs/FOUNDATION_DEFINITION_OF_DONE.md`

Then inspect:
- `git status`
- `package.json`
- current source tree
- relevant source files
- current README/CHANGELOG

## Primary goal

Finish and stabilize the **Frontend Foundation** without starting later product phases.

## First task: audit

Before changing code, audit the current implementation against the Foundation Definition of Done.

Identify:
- complete items
- incomplete items
- likely bugs
- styling inconsistencies
- missing tests
- missing CI/release infrastructure
- documentation drift

Do not immediately rewrite the application.

## Testing decision

This repository is intended to be a reference-quality learning project.

If automated testing infrastructure is absent, determine the safest sequence:

A. finish/stabilize the shell first, checkpoint it, then create a dedicated `feature/testing-foundation` branch

or

B. add minimal testing now if it can be done without destabilizing current UI work

Do not skip testing entirely.

## Version control

Preserve `feature/app-shell`.

Do not merge to `main`.

Use logical commits only when explicitly authorized to commit.

Do not deploy until explicitly instructed.

## Scope exclusions

Do not start:
- CodeMirror
- real editor execution
- live editor-to-Preview wiring
- functional Templates
- Saved Work implementation
- export/import
- share links
- JavaScript visualizer
- Python visualizer
- cloud accounts/backend

## Validation

At minimum:
```bash
npm run lint
npm run build
```

If testing scripts exist or are added:
```bash
npm test
npm run test:coverage
npm run test:e2e
```

Smoke-test relevant routes/interactions.

## Review

Use an independent read-only reviewer pass following `codex/REVIEWER.md`.

If subagents are available, reviewer work is appropriate for an independent subagent.

Do not have multiple agents concurrently edit the same files.

## Completion report

Return:

### Foundation audit
### Implementation
### Testing
### Validation
### Review
### Version-control status
### Remaining milestone blockers

Do not continue automatically into the next roadmap phase.
