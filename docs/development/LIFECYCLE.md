# Visualizer Lab — Development Lifecycle

Visualizer Lab should demonstrate the complete software-development lifecycle in a lightweight, repeatable way.

## 1. Product requirement
Define the problem, user need, scope, out-of-scope behavior, and acceptance criteria.

## 2. Design
Decide whether the feature needs a wireframe, interaction notes, architecture change, new state ownership, persistence, routing, dependency, security consideration, or accessibility consideration.

## 3. Architecture
For meaningful architecture changes, document the decision and add an ADR-style entry when the choice is important or difficult to reverse.

## 4. Branch
Create a feature branch from stable `main`.

Examples:
```text
feature/app-shell
feature/testing-foundation
feature/codemirror
feature/live-preview
feature/saved-work
feature/javascript-visualizer
fix/preview-resize-regression
```

## 5. Implement
Make the smallest coherent change that satisfies the requirement.

## 6. Test
Testing is part of implementation.

Use the appropriate level:
```text
unit → component → integration → end-to-end
```

## 7. Self-review
Review the diff before asking another reviewer.

## 8. Automated validation
Run the relevant lint, tests, coverage, build, and E2E checks.

## 9. Independent review
Use a second Codex/reviewer pass or human review.

## 10. Commit
Use logical commits.

## 11. Pull request / merge review
Confirm acceptance criteria, tests, review findings, smoke testing, documentation, and deployment impact.

## 12. Merge
Merge to `main` only after approval. Keep `main` deployable.

## 13. Release
For meaningful milestones, update changelog, choose semantic version, create Git tag, and publish release notes.

## 14. Deploy
Use repeatable automation where possible. Production should deploy from stable `main`.

## 15. Verify production
Verify routes, major interactions, direct refresh, HTTPS, and custom domain.

## 16. Retrospective / learning pass
After a major phase, update architecture docs, expand learning notes, document lessons, clean obsolete comments, and record tradeoffs.
