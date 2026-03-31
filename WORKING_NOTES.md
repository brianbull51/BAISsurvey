# Working Notes — Movie Preferences Survey

> **Internal document. Not public-facing. Update this file at the end of every working session.**

---

## How to Use This File (For AI Assistants)

1. Read this entire file before touching any code or making any suggestions.
2. Read `README.md` for public-facing context, setup instructions, and the Supabase SQL required to initialize the database.
3. Do not change the folder structure, routing conventions, or file naming without discussing it with the developer first.
4. Follow all conventions in the **Conventions** section exactly — naming, code style, commit messages, and component patterns.
5. Do not suggest anything listed under **What Was Tried and Rejected**. Those decisions are final for this project.
6. Ask before making any large structural changes (e.g., swapping the router, changing the state management approach, altering the Supabase schema, or reorganizing the monorepo).
7. This project was AI-assisted. Refactor conservatively — prefer targeted, isolated edits over broad rewrites.

---

## Current State

**Last Updated:** 2026-03-31

The app is fully functional in development on Replit. The survey form submits correctly to Supabase and the results page renders all three Recharts charts. A `staticwebapp.config.json` has been added for Azure Static Web App deployment. A `README.md` and this `WORKING_NOTES.md` exist at the repo root.

The Supabase table **must be created manually** before the app can save or read data (SQL in `README.md` and `replit.md`).

### What Is Working

- [x] Home page with "Take the Survey" and "View Results" CTAs
- [x] Survey form — all 4 questions with inline validation
- [x] Thank-you state after submission showing answer summary + link to results
- [x] Supabase insert on form submit (anonymous, no auth required)
- [x] Results page fetching all rows from Supabase
- [x] Three Recharts charts: watch frequency (vertical bar), preferences (horizontal bar, sorted), genres (horizontal bar, sorted)
- [x] Total response count displayed on results page
- [x] 404 not-found page with user-facing copy and home link
- [x] Footer on all pages: "Survey by Brian Bullon, BAIS:3300 - spring 2026"
- [x] `#8A3BDB` purple accent applied consistently across buttons, inputs, charts
- [x] `staticwebapp.config.json` in `public/` for Azure SPA routing fallback
- [x] Supabase credentials stored as encrypted Replit Secrets (not plaintext)
- [x] `vite.config.ts` uses safe defaults for `PORT` and `BASE_PATH`
- [x] `README.md` with full setup instructions including Supabase SQL

### What Is Partially Built

- [ ] No admin view to browse or export raw responses as CSV
- [ ] Charts do not auto-refresh; user must reload to see new submissions

### What Is Not Started

- [ ] Word cloud for favorite movie free-text responses
- [ ] Date range filter on results
- [ ] Duplicate submission prevention
- [ ] Multi-survey support

---

## Current Task

The app is complete for its original scope (BAIS:3300 spring 2026 classroom survey). The remaining work is deployment to Azure Static Web App. The `staticwebapp.config.json` routing config has been added; the developer needs to wire up the Azure SWA resource, GitHub Actions build pipeline, and application settings (env vars).

**Next step:** In Azure portal, create a Static Web App resource, connect the GitHub repo, and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Application Settings before triggering the first build.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19 | Standard UI library; familiar ecosystem |
| TypeScript | 5.9 | Type safety across form values, Supabase responses, chart data |
| Vite | 7 | Fast dev server; native ESM; simple static build output |
| Wouter | 3.3.5 | Lightweight SPA router (~1.5 KB); no React Router dependency overhead |
| Tailwind CSS | 4 | Utility-first; no separate stylesheet files to manage |
| Supabase JS | 2.100.1 | Direct DB client from the browser; no custom API server needed for a frontend-only app |
| Recharts | 2.15.2 | Composable React chart library; already in devDependencies |
| pnpm Workspaces | — | Monorepo tooling; this artifact shares the workspace with api-server and mockup-sandbox |

---

## Project Structure Notes

```
artifacts/movie-survey/
├── public/
│   └── staticwebapp.config.json   # Azure SWA SPA routing fallback — do not remove
├── src/
│   ├── App.tsx                    # Route definitions only — do not add logic here
│   ├── main.tsx                   # React DOM entry point
│   ├── index.css                  # Tailwind imports + base styles
│   ├── components/
│   │   ├── Footer.tsx             # Shared footer — must read: "Survey by Brian Bullon, BAIS:3300 - spring 2026" (no period)
│   │   └── ui/                    # Shadcn/Radix UI primitives — do not add @replit comments or inline annotations
│   ├── hooks/
│   │   └── use-mobile.tsx         # Responsive breakpoint hook
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client — reads from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
│   │   ├── types.ts               # ALL survey option constants live here — add/change options here only
│   │   └── utils.ts               # cn() Tailwind merge helper
│   └── pages/
│       ├── home.tsx               # Landing page
│       ├── survey.tsx             # Form + thank-you state (single component, two views)
│       ├── results.tsx            # Charts + total count
│       └── not-found.tsx          # 404 fallback
├── vite.config.ts                 # PORT defaults to 5173; BASE_PATH defaults to "/" — do not throw on missing env
└── package.json                   # @supabase/supabase-js is the only runtime dependency
```

### Non-obvious decisions

- **`types.ts` is the single source of truth for all survey options.** `FREQUENCY_OPTIONS`, `GENRE_OPTIONS`, and `PREFERENCE_OPTIONS` are `as const` arrays. Both the form and the results aggregations read from the same constants — do not hardcode option strings anywhere else.
- **`survey.tsx` manages both the form and the thank-you state** via a single `submitted` boolean. This avoids a separate route and preserves the submitted values for the recap display.
- **`Link` from wouter renders its own `<a>` tag.** Never wrap a `<Link>` in an `<a>` — it creates nested anchors and a React hydration error. Apply `className` directly to `<Link>`.
- **All UI accent styling uses inline `style={{ color: "#8A3BDB" }}`** rather than a custom Tailwind color token, to avoid conflicts with the scaffolded design system variables.

### Files that must not be changed without discussion

- `src/lib/types.ts` — changing option arrays changes both the form and the aggregated results; coordinate with the Supabase data already collected
- `src/lib/supabase.ts` — env var names must stay `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `public/staticwebapp.config.json` — required for Azure SWA; removing it breaks all direct URL navigation
- `vite.config.ts` — `outDir` must stay `dist/public`; Azure SWA build config depends on this

---

## Data / Database

**Provider:** Supabase (PostgreSQL)  
**Authentication:** None — all reads and writes are anonymous via Row-Level Security policies.

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `uuid` | Yes | Auto-generated via `gen_random_uuid()` |
| `created_at` | `timestamptz` | Yes | Auto-set to `now()` on insert |
| `favorite_movie` | `text` | Yes | Free-text; no normalization applied |
| `watch_frequency` | `text` | Yes | Must match one of `FREQUENCY_OPTIONS` — not enforced at DB level |
| `favorite_genre` | `text` | Yes | Must match one of `GENRE_OPTIONS` — not enforced at DB level |
| `preferences` | `text[]` | Yes | Array of values from `PREFERENCE_OPTIONS`; min 1 element enforced in form only |

**RLS policies in effect:**
- Public `INSERT` — `WITH CHECK (true)`
- Public `SELECT` — `USING (true)`

The full `CREATE TABLE` and policy SQL is in `README.md` and `replit.md`.

---

## Conventions

### Naming

- Files: `kebab-case.tsx` for pages and components
- Components: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `FREQUENCY_OPTIONS`)
- Interfaces: `PascalCase` prefixed with nothing (no `I` prefix)
- Supabase env vars: `VITE_` prefix required for Vite to expose them to the browser

### Code Style

- TypeScript strict mode enabled
- No `any` — use typed Supabase responses via interfaces in `types.ts`
- Inline `style` props for the `#8A3BDB` accent color (not a Tailwind class)
- `useId()` for all form element `id`/`htmlFor` pairs to avoid conflicts
- `aria-*` attributes on all interactive and status elements
- No default exports from `lib/` files; named exports only

### Framework Patterns

- Wouter `<Link>` receives `className` directly — never nest inside `<a>`
- Form validation runs on submit; errors clear field-by-field on change
- Supabase calls are in `try/catch`; errors surface in UI via `role="alert"` elements
- Charts use `ResponsiveContainer` wrapping all Recharts components

### Git Commit Style

Conventional commits:
```
feat: add CSV export to results page
fix: clear frequency error on radio change
chore: update README with deployment notes
```

---

## Decisions and Tradeoffs

- **No custom API server.** The frontend talks directly to Supabase. This is intentional for a classroom project with no auth requirements. Do not suggest adding an Express proxy.
- **Supabase anon key in client bundle.** `VITE_*` env vars are bundled into JS and visible in the browser. This is standard for Supabase public/anon key usage and is safe because RLS policies control what operations are allowed.
- **No login or session tracking.** The survey is anonymous by design. Duplicate submissions are allowed and expected.
- **wouter over React Router.** Chosen for minimal bundle size. The app has only three routes; there is no need for React Router's full feature set.
- **`dist/public` as build output dir.** Required by `artifact.toml` and Azure SWA config. Matches Replit's monorepo conventions.
- **Option constants in `types.ts`, not a database table.** Survey options are fixed for the semester. A database-driven option list would add unnecessary complexity.
- **No auto-refresh on results page.** Polling or WebSocket updates would add complexity with minimal classroom value. Reload-to-refresh is acceptable.

---

## What Was Tried and Rejected

- **Nested `<a>` inside wouter `<Link>`.** Causes a React hydration error ("In HTML, `<a>` cannot be a descendant of `<a>`"). Fixed by applying `className` directly to `<Link>`. Do not suggest wrapping `<Link>` in `<a>` again.
- **Throwing on missing `PORT`/`BASE_PATH` in `vite.config.ts`.** This broke `pnpm build` in CI and non-Replit environments. Replaced with safe defaults (`5173` / `"/"`). Do not restore the `throw` behavior.
- **Storing Supabase credentials in `[userenv.shared]` in `.replit`.** This committed plaintext credentials to the repo config. Migrated to encrypted Replit Secrets. Do not write credentials back to `.replit`.
- **Trailing period in footer copy.** The exact required string is `Survey by Brian Bullon, BAIS:3300 - spring 2026` — no period. Do not add a period.
- **`@replit` inline comments in `badge.tsx` and `button.tsx`.** These were scaffolding artifacts inconsistent with surrounding code style. Removed. Do not re-introduce inline `@replit` comment annotations in UI components.

---

## Known Issues and Workarounds

### Free-text movie names are not normalized

**Problem:** "The Dark Knight", "dark knight", and "the dark knight" are stored as three distinct strings. The results page has no word cloud or normalization layer.  
**Workaround:** None currently. The raw free-text is stored as-is and not displayed on the results page.  
**Do not remove** the `favorite_movie` field — it is one of the four required survey questions.

### Results page does not auto-refresh

**Problem:** New submissions are not visible without a page reload.  
**Workaround:** User reloads the page manually. This is acceptable for classroom use.  
**Do not remove** the manual fetch in `useEffect` on mount.

### No duplicate submission prevention

**Problem:** A user can submit the survey multiple times in the same session or across sessions.  
**Workaround:** None. Anonymous design means no session-based guard is possible without auth.

---

## Browser / Environment Compatibility

### Front-end

- Developed and tested in Chrome (latest) via Replit's preview pane
- Expected support: all modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions)
- Uses `has-[:checked]` CSS pseudo-class for radio/checkbox card highlight — not supported in Firefox < 121; functional fallback is plain border
- No IE11 support; not a requirement

### Back-end / Build Environment

- **Runtime:** None — frontend-only static app
- **Build:** Node.js 24, pnpm 9+
- **Dev platform:** Replit (Linux/NixOS container, Node 24)
- **Target deploy platform:** Azure Static Web Apps
- **Required env vars at build time:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Open Questions

- Should movie free-text responses be displayed anywhere (e.g., a word cloud or a scrollable list of submissions)?
- Is a CSV export needed before the semester ends, or will the instructor query Supabase directly?
- Should the survey close (stop accepting submissions) after a certain date, or remain open indefinitely?
- Should a `LIMIT` be added to the Supabase SELECT query on the results page to cap load time if the class is large?

---

## Session Log

### 2026-03-31

**Accomplished:**
- Built complete React+Vite survey app: Home, Survey (form + thank-you), Results (3 charts), 404 page
- Wired Supabase JS client with anonymous insert and select; RLS policies documented
- Fixed nested `<Link>/<a>` hydration error across all pages
- Migrated Supabase credentials from `.replit` plaintext to encrypted Replit Secrets
- Fixed `vite.config.ts` to use safe defaults instead of throwing on missing env vars
- Corrected footer copy (removed trailing period)
- Cleaned `@replit` annotation comments from `badge.tsx` and `button.tsx`
- Added `staticwebapp.config.json` to `public/` for Azure SPA routing fallback
- Generated `README.md` (public, 15 sections) and this `WORKING_NOTES.md` (internal)

**Left incomplete:**
- Azure SWA deployment not yet wired (no GitHub Actions workflow, no Azure resource created)
- Supabase table not yet created (SQL provided but must be run manually in Supabase SQL Editor)

**Decisions made:**
- Deploy target is Azure Static Web Apps, not Replit deployment
- Output dir stays `dist/public`; Azure build settings must reference `artifacts/movie-survey/dist/public` from repo root

**Next step:**
- Create Azure Static Web App resource, connect GitHub repo, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Application Settings, and trigger first build

---

## Useful References

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vite Environment Variables](https://vite.dev/guide/env-and-mode)
- [Wouter README](https://github.com/molefrog/wouter#readme) — specifically the `Link` rendering behavior
- [Recharts API](https://recharts.org/en-US/api)
- [Azure Static Web Apps — Build Configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Azure SWA — Application Settings (env vars)](https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings)
- [Azure SWA — `staticwebapp.config.json` routing](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- **AI tools used:** Claude (Anthropic) via Replit Agent — used to scaffold all source files, debug routing/hydration errors, generate README and WORKING_NOTES, advise on Azure deployment config
