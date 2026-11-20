# Feature: Inicio dashboard

## Objective

Build the Inicio page from the reference design so it stops being a placeholder, starting
with the shared foundation: an app-name constant, the real design palette, and the reusable
UI primitives every dashboard card depends on.

## Problem

`InicioPage` renders two lines of text. The design in `diseño_web/Dashboard web.png` shows a
full dashboard (balance, monthly spend, groups, recent activity, upcoming settlements).
The app name is duplicated and inconsistent: Sidebar says "Splitwise Casa", Footer says
"Splitwise Friends", and `package.json` says `splitwise-friends`. The brand green currently
in `@theme` (`#1cc274`) does not match the design (`#008D4D`), so every surface is off-palette.

## Scope

In scope: `src/constants/app.js`, `@theme` tokens in `src/index.css`, eight primitives in
`src/components/ui/`, and the APP_NAME wiring in Sidebar and Footer.

Out of scope (later phases): the six dashboard cards, mock data, page grid, and the
`/nuevo-gasto` and `/liquidar` routes.

## Constraints

- No raw hex outside `src/index.css`.
- Cross-folder imports use the `@/` alias; same-folder imports stay relative.
- Primitives are presentational only: no data fetching, no business logic.
- `eslint .` must exit 0 and `pnpm build` must succeed.

## Tasks

- [x] T1 — Create `src/constants/app.js` exporting `APP_NAME`.
- [x] T2 — Sidebar logo renders `APP_NAME` instead of a literal.
- [x] T3 — Footer renders `© {year} {APP_NAME}`.
- [x] T4 — Replace `@theme` block with the palette sampled from the design.
- [x] T5 — `Button.jsx` with primary / outline / ghost variants.
- [x] T6 — `Card.jsx` white rounded container.
- [x] T7 — `CardHeader.jsx` title + subtitle + action slot.
- [x] T8 — `Money.jsx` es-ES / EUR formatting with optional sign and tone.
- [x] T9 — `Chip.jsx` success / warn / neutral tones.
- [x] T10 — `IconBadge.jsx` tinted icon container.
- [x] T11 — `ProgressBar.jsx` accessible progress bar.
- [x] T12 — `Avatar.jsx` initials circle.
- [x] T13 — `data/inicio.mock.js` fixture with the shapes the cards consume.
- [x] T14 — `hooks/useDashboardData.js` exposing `{ data, loading, error }`.
- [x] T15 — Fixture counts match the design labels (2 active groups, 2 pending settlements).
- [x] T16 — `DashboardIntro` with hour-based greeting and both actions.
- [x] T17 — `BalanceSummaryCard` solid-brand hero.
- [x] T18 — `MonthlySpendCard` with trend and progress.
- [x] T19 — `GroupsOverviewCard` with icon registry and create-group action.
- [x] T20 — `RecentActivityCard` table with a stacked mobile variant.
- [x] T21 — `UpcomingSettlementsCard` with the overflow fix.
- [x] T22 — Page grid: 2fr/1fr balance row, activity below, right rail.
- [x] T23 — Actions wired; `nuevo-gasto` and `liquidar` placeholder routes added.

## Acceptance criteria

- Sidebar and Footer show the same app name, sourced from one constant.
- `dist` CSS contains `--color-brand: #008D4D`.
- All eight primitives exist and are importable through `@/components/ui/`.
- Build and lint clean.

## Checks

`pnpm build`, `node node_modules/eslint/bin/eslint.js .`

## Progress

Phase 0 and Phase 1 complete. Commit `34623bc`.

Verification observed:

- `pnpm build` → `✓ 2142 modules transformed. ✓ built in 353ms`
- `node node_modules/eslint/bin/eslint.js .` → exit 0, no output
- All eight primitives transform cleanly through the dev server (HTTP 200, no transform error)
- All seven new tokens present in `dist/assets/*.css`
- No raw hex outside `src/index.css`

Phase 2 complete. Commit `77132da`. Route: direct inline (data authoring against a
fixture already specified by the design; no research or exploration needed).

Verification observed:

- Both new modules transform through the dev server (HTTP 200, no transform error)
- `node node_modules/eslint/bin/eslint.js .` → exit 0, no output
- `groups.length === 2` and `settlements.length === 2`, matching "2 grupos activos" and
  "Tienes 2 pagos pendientes de revisar." in the design

## Next step

Phase 3-5 complete. Commit `ea17389`.

Verification observed:

- `pnpm build` → `✓ 2160 modules transformed. ✓ built in 411ms` (up from 2142: the cards are
  now imported by the page, so the production build compiles them for real instead of tree-shaking them)
- `node node_modules/eslint/bin/eslint.js .` → exit 0, no output
- All eleven new modules transform through a freshly restarted dev server (HTTP 200)

Deviations worth knowing:

- `BalanceSummaryCard` renders a plain `div`, not `Card`. Tailwind emits `bg-white` after
  `bg-brand`, so overriding would require an `!important` escape hatch. The hero surface is
  its own thing; that is not a white card.
- Icons render through `createElement` because the React Compiler static-components lint rule
  rejects a registry lookup used as a JSX tag. Data still stores strings.
- The dev server must be restarted after adding new Tailwind utilities; an old process served a
  stale utility set that dropped `md:block` and friends.

## Remaining

- Sidebar and Header still hardcode the user ("Laura Rodríguez", "LR"). They should consume the
  same user data the dashboard already receives.
- Group rows navigate to `/grupos` instead of a real `/grupos/:id` detail page.
