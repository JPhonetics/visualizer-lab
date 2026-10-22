# Visualizer Lab — Testing Strategy

## Goal

The repository should become a useful reference for:
- unit testing
- React component testing
- integration testing
- end-to-end testing
- regression testing

## Recommended tools

### Unit / component / integration
- Vitest
- React Testing Library
- `@testing-library/jest-dom`
- `@testing-library/user-event`

### End-to-end
- Playwright

## Test levels

### Unit tests
Best for utilities, preview document generation, state helpers, hooks with meaningful logic, and future serialization/export helpers.

### Component tests
Best for TopBar dropdown, Editor tabs, Preview controls, Theme control, Sidebar interactions, and collapsed panel controls.

### Integration tests
Best for AppShell layout state, persistence behavior, route-level behavior, and Preview-control interactions.

### End-to-end tests
Best for critical flows such as loading `/frontend`, collapsing panels, device changes, opening Visualized, refreshing direct routes, and later editing/saving/exporting.

## Regression tests

When fixing a bug:
1. reproduce it
2. add a failing test when practical
3. implement the fix
4. confirm the test passes

## Coverage

Coverage is a signal, not the goal.

## Initial testing milestone

Before the project becomes a strong reference implementation, establish:
- Vitest
- React Testing Library
- meaningful unit/component tests
- Playwright
- at least one E2E smoke path
- CI running lint/tests/build
