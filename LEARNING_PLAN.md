# Playwright Learning Plan — saucedemo.com

All 466 flashcards are mapped to 13 phases. Card numbers = row order in the deck (header excluded). Do each phase as: read cards → build the practice task → review cards again.

## Setup facts for saucedemo

- URL: https://www.saucedemo.com · password for every user: `secret_sauce`
- Users you'll use as test scenarios: `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`
- The site uses `data-test` attributes, so set `use: { testIdAttribute: 'data-test' }` to make `getByTestId()` work.

## Phase 1 — Setup & running tests

**Cards:** 1–29, 38–45, 453–457 (42)

- [ ] `npm init playwright@latest` (TypeScript), set `baseURL: 'https://www.saucedemo.com'`
- [ ] Write one test: log in as `standard_user`, land on `/inventory.html`
- [ ] Run it every way: headed, single project, single file, `-g`, `--last-failed`, `--ui`, `show-report`

**Done when:** you can run any subset of tests from the CLI without looking it up.

## Phase 2 — Locators, auto-waiting, assertions

**Cards:** 30–37, 429–434, 440–442, 465–466 (19)

- [ ] Login with `getByPlaceholder` / `getByRole`, then again with `getByTestId`
- [ ] Add "Sauce Labs Backpack" to cart by filtering: `getByTestId('inventory-item').filter({ hasText: 'Backpack' })`
- [ ] Assert cart badge count with `toHaveText`, locked-out error with `toBeVisible`
- [ ] Rewrite one assertion as a soft assertion

**Done when:** no `waitForTimeout`, no manual `isVisible()` checks. (Cypress note: no `cy.wait`, everything is awaited.)

## Phase 3 — Debugging & codegen

**Cards:** 46–71, 435–439, 443–452 (41)

- [ ] `npx playwright codegen saucedemo.com` — record a full checkout, compare its locators to yours
- [ ] Break a test on purpose; debug it with `--debug`, then UI Mode, then `--trace on` + Trace Viewer

**Done when:** you can find why a test failed from a trace alone.

## Phase 4 — Organizing tests (hooks, annotations, tags)

**Cards:** 72–93 (22)

- [ ] `test.describe` blocks: Login, Inventory, Cart, Checkout; login in `beforeEach`
- [ ] Tag `@smoke` / `@regression`, run with `--grep` and `--grep-invert`
- [ ] `performance_glitch_user` → `test.slow()`; a known `error_user` bug → `test.fail()`; `problem_user` sorting → `test.fixme()`
- [ ] Add a custom annotation with an issue URL

## Phase 5 — Config & artifacts

**Cards:** 94–122, 139–161 (52)

- [ ] Tune `retries`, `workers`, `forbidOnly`, `timeout`, `expect.timeout`, `actionTimeout`
- [ ] Try each `trace` / `video` / `screenshot` mode, fail a test with `retries: 2`, check what's kept in `test-results`
- [ ] Note: `webServer` doesn't apply here (saucedemo is hosted) — just learn the cards

## Phase 6 — Fixtures (+ Page Object Model)

**Cards:** 195–244 (50)

- [ ] Create `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` classes
- [ ] Expose them as fixtures via `test.extend()`; add a `loggedInPage` fixture
- [ ] Add an auto fixture that attaches a screenshot on failure (`testInfo.status !== testInfo.expectedStatus`)
- [ ] Try a worker-scoped fixture and `mergeTests()`

**Done when:** tests read like `await inventoryPage.addToCart('Backpack')`. (Cypress note: fixtures replace custom commands + `beforeEach`.)

## Phase 7 — Auth, setup projects & projects

**Cards:** 245–271, 340–365, 422–423 (55)

- [ ] `auth.setup.ts` logs in once and saves `storageState` (saucedemo keeps the session in a cookie)
- [ ] chromium project depends on setup and uses the saved state → tests start on `/inventory.html`
- [ ] Add a teardown project; try `--no-deps`
- [ ] Build the same with `globalSetup` once, to see the difference

(Cypress note: this replaces `cy.session`.)

## Phase 8 — Use options & emulation

**Cards:** 123–138, 162–194 (49)

- [ ] Add iPhone 13 and Pixel 5 projects; check the menu/layout on mobile
- [ ] Override `viewport`, `locale`, `colorScheme` with `test.use()` at file and describe level
- [ ] Try `offline: true` and `javaScriptEnabled: false` and assert what happens

## Phase 9 — Data-driven tests & environments

**Cards:** 317–339 (23)

- [ ] Parameterize login over all users with `forEach` (unique titles)
- [ ] Checkout form data from a CSV with `csv-parse`
- [ ] Move the password to `.env` with `dotenv`
- [ ] Parameterized project: a `user` option set per project

## Phase 10 — Parallelism

**Cards:** 272–316, 463–464 (47)

- [ ] Compare run times: default vs `fullyParallel` vs `workers: 1`
- [ ] Put the checkout flow in serial mode, then refactor it back to isolated tests
- [ ] Try a test lock, `maxFailures`, and log `workerIndex` / `parallelIndex`

## Phase 11 — Best practices, mocking, visual testing

**Cards:** 419–421, 424–428 (8)

- [ ] `page.route()` to abort product images, and to fulfil one request with fake data
- [ ] `toHaveScreenshot()` on inventory with `standard_user`, then run as `visual_user` to see a diff (tune `maxDiffPixels`)

## Phase 12 — Reporters

**Cards:** 366–396 (31)

- [ ] Try `list`, `line`, `dot`, `html`, `json`, `junit`
- [ ] Write a small custom reporter (`onBegin`, `onTestEnd`, `onEnd`) printing pass/fail counts

## Phase 13 — CI & sharding

**Cards:** 397–418, 458–462 (27)

- [ ] GitHub Actions: install only chromium, run `tsc --noEmit`, add `no-floating-promises` ESLint rule
- [ ] Shard with a matrix (`fail-fast: false`), blob reporter, `merge-reports` job with `if: !cancelled()`

**Done when:** a PR triggers sharded runs and produces one merged HTML report.

Step-by-step practice tasks for this phase: [CI_CD_TASKS.md](CI_CD_TASKS.md)

## Not covered well by saucedemo

API testing (`request` fixture) and `webServer` — no backend/API to hit. The deck barely covers them, but for interviews consider a quick side exercise against a public API (e.g. restful-booker).
