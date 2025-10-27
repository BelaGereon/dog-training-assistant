# Dog Training Assistant

Dog Training Assistant is a local-first progressive web app that helps handlers schedule and log training sessions, capture reps, and keep progress in sync across devices when offline.

## Getting started

1. Install the current Node.js LTS release.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server.

## Tests

- `npm run test` runs the Vitest suite.
- `npm run e2e` runs the Playwright end-to-end tests.
  See the CI section below for what runs in GitHub Actions and how to troubleshoot.

## CI

This repo runs GitHub Actions to verify changes automatically. The workflow is defined in `.github/workflows/tests.yml`.

- What runs
  - Unit tests via `vitest` (`npm run test`).
  - End-to-end tests via `@playwright/test` (`npm run e2e`).
  - Playwright browser binaries are installed before E2E (`npx playwright install --with-deps`).
- When it runs
  - On pull requests (opened, synchronized, or reopened).
  - On pushes to `main`.
  - One workflow per ref at a time (in‑progress runs for the same branch are canceled).
- Where/how it runs
  - Runner: `ubuntu-latest`.
  - Working directory: `app/` for all steps.
  - Node.js: version `22` (via `actions/setup-node`).
  - Dependencies installed with `npm ci` and npm cache keyed by `app/package-lock.json`.
- Artifacts
  - On failure, the Playwright HTML report from `app/playwright-report/` is uploaded as an artifact named `playwright-report`.

### Reproduce locally

Run the same steps the workflow uses:

1. `cd app`
2. Install deps cleanly: `npm ci`.
3. Install Playwright browsers: `npx playwright install --with-deps`.
4. Run unit tests: `npm run test`.
5. Run E2E tests: `npm run e2e`.

Helpful local commands:

- `npx playwright show-report` to open the latest Playwright HTML report.

### Debugging CI failures

- Check the failing job’s logs in the Actions tab for which step failed (unit vs E2E).
- For E2E failures, download the `playwright-report` artifact and open `index.html` to inspect traces, screenshots, and logs.
- Re-run locally with the same Node version (22) and from `app/` to avoid path/version mismatches.
- If tests are flaky, re-run the workflow; concurrency is enabled so older in‑flight runs for the same branch may be canceled.

### Gotchas

- Node version: CI uses Node 22. If you use a different local version, subtle failures can occur. Prefer aligning via `nvm use 22`.
- Working directory: all CI commands run from `app/`. Mirror this locally (`cd app`) before running scripts.
- Playwright browsers: make sure to install them locally (`npx playwright install --with-deps`) before running E2E.
- OS differences: CI runs on Linux (`ubuntu-latest`). If you’re on Windows/macOS, consider testing in WSL or a container if you hit path/permission issues.
- Clean installs: CI uses `npm ci`. If you’ve used `npm install` locally and see differences, try `npm ci` to match CI behavior.

## Tech stack

- React + TypeScript + Vite
- Dexie for IndexedDB persistence
- Vitest + React Testing Library
- Playwright
- vite-plugin-pwa

## Docs

See `/docs/project-context.md` for product context and additional planning notes.

## License

MIT
