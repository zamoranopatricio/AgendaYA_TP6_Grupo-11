# AGENTS.md

## Scope
- This is an academic Ingeniería y Calidad de Software project for AgendaYA TP6.
- Work only on:
  - `M04 - Proceso de reserva/`
  - `M06 - Notificaciones/`
- Do not implement features outside these modules unless strictly necessary.
- The goal is a minimal frontend for automated testing, not a production app.

## Repo shape
- This is a small static frontend + tests repo for two modules: `M04 - Proceso de reserva/` and `M06 - Notificaciones/`.
- Each module keeps its own `frontend/`, `src/`, and `cypress/e2e/` files; do not assume root-level `frontend/`, `src/`, or `cypress/e2e/` are current.
- Important entrypoints:
  - M04 page: `M04 - Proceso de reserva/frontend/proceso_reserva.html`
  - M04 JS: `M04 - Proceso de reserva/src/proceso_reserva.js`
  - M06 page: `M06 - Notificaciones/frontend/plantillas.html`
  - M06 JS: `M06 - Notificaciones/src/plantillas.js` (`app.js` is not the current file)

## Stack
- HTML, CSS, and JavaScript only for the frontend.
- Cypress is used for E2E tests.
- Jest is currently configured for unit tests; Vitest may be acceptable only if explicitly introduced/required.

## Commands
- Install deps: `npm.cmd install` on Windows/PowerShell if `npm` is blocked by execution policy.
- Unit tests: `npm.cmd test -- --runInBand`
- Run one Jest file: `npx.cmd jest "M04 - Proceso de reserva/tests/proceso_reserva.test.js" --runInBand`
- Cypress requires a static server at `http://127.0.0.1:5501` from the repo root before running specs:
  - Start server: `python -m http.server 5501 --bind 127.0.0.1`
  - Run all E2E: `npm.cmd run cypress:run`
  - Run one spec: `npx.cmd cypress run --spec "M06 - Notificaciones/cypress/e2e/m06-plantillas.cy.js"`

## Frontend rules
- Every interactive element must have a `data-cy` attribute.
- Cypress selectors should use `data-cy` as the primary selector.
- Do not use CSS classes or visible text as the main Cypress selector.
- Keep HTML script paths relative (`../src/...`) so they work from module `frontend/` folders and avoid 404s with spaces in module names.

## Testing rules
- E2E tests should follow the Arrange / Act / Assert structure with comments:
  - `// Arrange`
  - `// Act`
  - `// Assert`
- Do not change application behavior only to make a test pass.
- Tests rely on `data-cy` selectors; prefer updating/adding those over brittle CSS/text selectors.

## Cypress quirks
- `cypress.config.js` sets `specPattern: '**/cypress/e2e/**/*.cy.js'` because specs live under module folders.
- `supportFile: false` is intentional; there is no root `cypress/support/e2e.js`.
- `cy.visit()` paths include module folder names with spaces, e.g. `/M04 - Proceso de reserva/frontend/proceso_reserva.html`.

## Code quirks
- `M04 - Proceso de reserva/src/proceso_reserva.js` is used by both browser and Jest; keep `module.exports` and `document` access guarded so Node tests do not fail.
