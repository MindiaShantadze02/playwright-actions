# Playwright + GitHub Actions Practice Tasks

5 tasks from simple to upper moderate. They build on the repo as it is: `@smoke` / `@regression` tags, the `api` / `chromium` / `firefox` / `webkit` projects, the auth `setup` project, and `env.ts`.

Mark items `[x]` as they're done, and add notes under **Progress notes** at the bottom of each task.

## Task 1 — Basic smoke workflow (simple)

**Goal:** Run smoke tests automatically on push to `main`.

- [x] Workflow lives in `.github/workflows/` (not `.github/actions/`, which is for composite actions; see Task 5)
- [x] `actions/checkout` → `actions/setup-node` (with `cache: npm`) → `npm ci`
- [x] Install only the browser you need: `npx playwright install --with-deps chromium`
- [x] Run smoke tests: `--grep @smoke --project=chromium --project=api`
- [x] `workflow_dispatch` so it can be run by hand from the Actions tab
- [x] `timeout-minutes` on the job (the default is 6 hours)
- [ ] ~~`pull_request` trigger~~ (left out on purpose)
- [x] A green run on GitHub

**Done when:** a push shows a green run, and a manual run from the Actions tab works.
**Learn:** triggers, runners, setup steps, why `npm ci` is used instead of `npm install`.

**Progress notes**
- Fixed: `timeout-minutes` was directly under `jobs:` (treated as a job name), `cache: npm` was on a `run:` step, and `lts/22` isn't a valid version, so it's now `22`.

## Task 2 — Secrets, variables and reports (simple to moderate)

**Goal:** Stop depending on a local `.env`, and keep the HTML report from every run.

- [x] `STANDARD_USER` and `PASSWORD` in repo **Secrets**; `BASE_URL` in repo **Variables** (`vars.BASE_URL`)
- [x] Pass them via `env:` on the **test step only**, not the whole job, so `npm ci` and install scripts can't read them
- [x] Upload `playwright-report/` with `actions/upload-artifact`, `if: ${{ !cancelled() }}`, `retention-days: 7`
- [x] `video: 'on'` removed from the config (it made the artifacts huge)
- [x] Confirm `BASE_URL` exists under the **Variables** tab (an empty value makes `env.ts` throw)
- [x] Push a deliberately failing `@smoke` test, then download the report and open the trace from the retry
- [x] Revert `tests/api/auth.spec.ts`: restore the `401` **and** the `['@api', '@regression']` tags

**Done when:** a failing run still produces a downloadable report with a trace, and no credentials are in the repo.
**Learn:** secrets compared with variables, `if:` conditions, artifacts, debugging failures from CI traces.

**Progress notes**
- The first failing test was tagged `@regression` only, so the smoke run would have skipped it. It's now tagged `@smoke` for the experiment.
- `workers` in CI is set to 4, matching the 4 CPUs on `ubuntu-latest`.
- 2026-10-02: the failing run uploaded the report as expected; the test was reverted (`401`, `@regression`). **Tasks 1 and 2 complete.**

## Task 3 — Browser matrix and a separate API job (moderate)

**Goal:** Run the end-to-end tests on all 3 browsers in parallel, with the API tests as their own job.

- [ ] Job `api`: `npm run test:api`, with no browser install
- [ ] Job `e2e`: `strategy.matrix.project: [chromium, firefox, webkit]`, running `npx playwright test --project=${{ matrix.project }}`
- [ ] Install only the matrix browser in each job
- [ ] `fail-fast: false` so one browser failing doesn't cancel the others
- [ ] Unique artifact names: `report-${{ matrix.project }}`
- [ ] Optional: `needs: api` so the end-to-end tests only run if the API tests pass

**Done when:** the Actions graph shows `api`, then 3 parallel browser jobs.
**Learn:** matrix builds, job dependencies, unique artifact names.

## Task 4 — Scheduled regression runs and smarter triggers (moderate to upper moderate)

**Goal:** Split the work into a fast check on pull requests and a full nightly regression run.

- [ ] `pr.yml`: on `pull_request`, run smoke plus API tests, with a `concurrency` group and `cancel-in-progress: true`
- [ ] `nightly.yml`: on `schedule` (e.g. `0 2 * * *`) plus `workflow_dispatch`
- [ ] `workflow_dispatch` inputs to choose the tag (`smoke` / `regression`) and the browser; run `--grep @${{ inputs.tag }}`
- [ ] `paths-ignore: ['**.md']` so editing docs doesn't trigger test runs
- [ ] Cache Playwright browsers with `actions/cache`, keyed on the Playwright version in `package-lock.json`

**Done when:** you can start a run by hand with your chosen inputs, and editing a `.md` file triggers nothing.
**Learn:** cron syntax, `workflow_dispatch` inputs, concurrency, path filters, caching.

## Task 5 — Sharding, merged reports and a reusable action (upper moderate)

**Goal:** Scale the setup the way a real team would.

- [ ] Shard the Chromium regression run over 3 machines: `--shard=${{ matrix.shard }}/3`
- [ ] Use the `blob` reporter when `process.env.CI` is set (in `playwright.config.ts`)
- [ ] `merge-reports` job: `needs: e2e`, `if: ${{ !cancelled() }}`, download `pattern: blob-*` with `merge-multiple: true`, then run `npx playwright merge-reports --reporter html ./all-blob-reports`
- [ ] Move the repeated setup steps into a composite action at `.github/actions/setup-playwright/action.yml` with a `browser` input; every workflow calls it with `uses: ./.github/actions/setup-playwright`
- [ ] Bonus: publish the merged report to GitHub Pages
- [ ] Bonus: write a pass/fail summary to `$GITHUB_STEP_SUMMARY`

**Done when:** 3 shard jobs feed 1 merged HTML report, and no workflow repeats the setup steps.
**Learn:** sharding, blob reports, composite actions, how jobs pass artifacts to each other.

**Note:** each matrix or shard job is a separate machine, so each one runs the `setup` (login) project again. That's expected; just make sure the credentials secret is available in every job.

## Backlog / nitpicks

- [ ] Bump `actions/upload-artifact@v4` to the same major version as `checkout` / `setup-node`
- [ ] Remove trailing whitespace at the end of `smoke-test.yml`
