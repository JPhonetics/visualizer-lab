# Visualizer Lab

A learning-focused React application for exploring code visually. Foundation,
testing, the real Frontend editor and Live Preview are merged. Local Projects
is the active milestone.

Each language keeps its text and undo history while switching tabs or collapsing
the Editor. Current Work now saves locally and restores after refresh. Named saved copies
can be opened, renamed, searched, updated with Save, and deleted. Preview renders
HTML, CSS and JavaScript after a short pause, with CSS/JS switches and Reload.
Standalone Preview receives a fixed in-memory snapshot. Functional Templates
and other visualizers remain later work. Projects stay in this browser and can
be lost when site data is cleared; saving failures appear in the Sidebar.

See [Local Projects acceptance and browser review](docs/milestones/LOCAL_PROJECTS.md).

## Development

Use Node.js 24 and npm. Install locked dependencies with `npm ci`, then run
`npm run dev`. Open `/frontend` or `/frontend/visualized`.

Validation commands:

```bash
npm run lint
npm run build
npm run preview
```

## Testing

```bash
npm test
npm run test:watch
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run test:e2e:pages
```

Use `npx playwright install --with-deps chromium` on a Linux machine that needs
browser system libraries. E2E builds the app and starts its own production preview
on port 4178; that port must be free. Unit/component tests use jsdom; E2E uses real
Chromium. Coverage HTML is in `coverage/index.html`; browser reports are in
`playwright-report/index.html`. Generated reports are ignored by Git.

Pull-request CI runs lint, coverage tests and production-build E2E with Node 24.
The workflow validates only; it does not merge or deploy. See the
[testing strategy](docs/testing/STRATEGY.md) for coverage boundaries and the
[audit and sequence](docs/FOUNDATION_AUDIT.md) for remaining gates.

## Architecture and persistence

Preview document, controls, viewport, iframe and measurement are separate modules.
Layout drags update visually through animation frames and persist at drag end.
Theme and layout preferences persist; editor tab and workspace Preview controls
are transient. Standalone Preview can initialize settings from its query string.

See [architecture](docs/architecture/OVERVIEW.md),
[testing strategy](docs/testing/STRATEGY.md), [roadmap](docs/ROADMAP.md) and
[Definition of Done](docs/FOUNDATION_DEFINITION_OF_DONE.md).

## Release and deployment

The package remains at 0.0.0; Frontend Foundation targets 0.1.0 after validation,
review and approval. GitHub Pages preparation targets the owned custom domain
`visualizerlab.dev`, including clean `/frontend/` paths, static route entries
and an app-aware 404. Normal
local development still uses `/frontend`.

Build with `npm run build:pages`, then `npm run preview:pages` to inspect
`http://127.0.0.1:4179/`. Publishing is a separate approved manual
workflow from main, not an automatic result of merging. The Foundation site has been published; editor and Live Preview changes require
a separately approved deployment. HTTPS certificate validation and enforcement
were verified October 28, 2026. See [deployment setup and verification](docs/development/DEPLOYMENT.md),
[step-by-step owner guide](docs/development/PAGES_SETUP_GUIDE.md),
and [versioning](docs/releases/VERSIONING.md).
