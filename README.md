# Visualizer Lab

A learning-focused React application for exploring code visually. The current
milestone is Frontend Foundation: a workspace shell with a Sidebar, placeholder
Editor, isolated sample Preview, layout controls and a standalone Visualized view.

Only Frontend is available in the selector. Editing/execution, functional
Templates, Saved Work and other language visualizers are later roadmap work.
CSS/JavaScript switches currently update control state; they do not modify the
sample document.

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
review and approval. No deployment workflow is configured. Existing SPA recovery
assumes a domain-root host and requires production verification; GitHub project
subpath hosting needs additional configuration. See [versioning](docs/releases/VERSIONING.md).
