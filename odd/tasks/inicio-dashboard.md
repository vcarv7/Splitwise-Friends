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

## Acceptance criteria

- Sidebar and Footer show the same app name, sourced from one constant.
- `dist` CSS contains `--color-brand: #008D4D`.
- All eight primitives exist and are importable through `@/components/ui/`.
- Build and lint clean.

## Checks

`pnpm build`, `node node_modules/eslint/bin/eslint.js .`

## Progress

Phase 0 and Phase 1 complete.

Verification observed:

- `pnpm build` → `✓ 2142 modules transformed. ✓ built in 353ms`
- `node node_modules/eslint/bin/eslint.js .` → exit 0, no output
- All eight primitives transform cleanly through the dev server (HTTP 200, no transform error)
- All seven new tokens present in `dist/assets/*.css`
- No raw hex outside `src/index.css`

## Next step

Phase 2: mock data module plus `useDashboardData` hook.
