# Visualizer Lab — Git Workflow

## Branches

`main`
- stable
- reviewed
- deployable

Feature branches:
```text
feature/<short-name>
```

Fix branches:
```text
fix/<short-name>
```

## Current branch

```text
feature/app-shell
```

## Commit style

Preferred pattern:
```text
type: short description
```

Useful types:
- `feat`
- `fix`
- `test`
- `refactor`
- `style`
- `docs`
- `chore`
- `build`
- `ci`

Examples:
```text
feat: add standalone visualized route
test: cover preview control defaults
fix: align collapsed rail header
refactor: extract preview size hook
docs: add architecture decision record
ci: add pull request validation
```

## Merge policy

Before merging:
- CI passes
- lint passes
- tests pass
- build passes
- review passes
- smoke test passes

Choose squash or regular merge based on which leaves the clearest educational history.
