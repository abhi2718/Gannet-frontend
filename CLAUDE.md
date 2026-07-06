# CLAUDE.md — Read this first

This file is loaded automatically. **Before writing or changing any code, follow
the workflow below.** It exists so that every future change stays consistent with
the existing design instead of re-inventing it. This is the front-end
(`gannet-next`, Next.js) counterpart of the backend's `gannet/CLAUDE.md`.

## STEP A — Before generating ANY module (read first, always)

Never write code before doing this. For every task:

1. **Read the architecture & all rules.** Open
   [`architecture/ARCHITECTURE.md`](architecture/ARCHITECTURE.md) (system design),
   [`architecture/FOLDER_STRUCTURE.md`](architecture/FOLDER_STRUCTURE.md) (where
   things live + the "Where do I change X?" map), and
   [`architecture/CONVENTIONS.md`](architecture/CONVENTIONS.md) (the rules).
   Understand the App-Router route groups, the feature-folder layout, the React
   Query data layer, the API client envelope, auth/token handling, and the
   ≤200-line rule **before** touching source.
2. **Locate the right file.** Use `FOLDER_STRUCTURE.md`'s "Where do I change X?"
   map to find the most relevant existing file(s) — do not invent a new pattern
   when an existing one fits.
3. **Check history.** Skim the newest entries in
   [`architecture/history/`](architecture/history/) for past decisions and
   similar changes, and follow that precedent.

## STEP B — The workflow (in this exact order)

For every implementation:

1. **Read** `ARCHITECTURE.md` (start with its overview), then use
   `FOLDER_STRUCTURE.md` to decide **which file/module** must be created or
   changed.
2. **Do the rectification** — implement the change in that file, following
   `CONVENTIONS.md` (feature folders, Client vs Server components, React Query
   hooks, ≤200 lines, no unused vars).
3. **Write/adjust the unit tests** for the changed module (see the checklist
   below) and **run the checks:** `npm run lint`, `npx tsc --noEmit`, and
   `npm test`. All must pass.
4. **Ask the user to test it.** Report what changed and how to exercise it, then
   **stop and wait** for the user's approval. Do **not** log history or finalise
   the architecture docs before approval.
5. **After the user approves:**
   - **Add a history entry** — a new dated file in `architecture/history/`
     (see its `README.md` for the template) and link it at the top of the index.
   - **Update the architecture docs** — reflect any new route/component/hook/
     convention/folder in `ARCHITECTURE.md` and `FOLDER_STRUCTURE.md` (skip only
     if the design is genuinely unchanged).

A change is **COMPLETE** only when lint + typecheck + all tests pass, the user
has approved, and the history + architecture docs are updated.

### Edge-case checklist for unit tests (write every case that applies)

- **Happy path** — the component renders / the hook returns the expected shape.
- **Auth-conditional UI** — signed-in vs signed-out rendering (mock `useAuth`).
- **Loading / empty / error states** for anything backed by a React Query hook.
- **User interactions** — clicks, form submits, navigation (`useRouter` mocked).
- **Guards & redirects** — `RequireAuth` role handling; deep-links.
- **Data-access wrappers** (`*Api.ts`) — request shape sent, response mapped.
- **localStorage / persistence** — round-trip, corrupt data ignored.

## Non-negotiable rules (full detail in CONVENTIONS.md)

- **≤ 200 lines per file.** Enforced by ESLint (`max-lines`, skips blanks/
  comments). Split before you exceed it (extract a subcomponent, a hook, or a
  helper module) — never by reformatting.
- **No unused variables.** Enforced by ESLint + `tsc`.
- **Feature-folder layout:** UI lives under `src/features/<surface>/<feature>/`;
  cross-surface presentational pieces under `src/components/shared/`; data access
  under `src/lib/`.
- **Interactive components are Client Components** (`"use client"`). The root
  layout stays a Server Component and renders the client `Providers` wrapper.
- **All server data flows through React Query hooks** in `src/lib/query/hooks/`,
  which call the fetch client in `src/lib/api/`. No raw `fetch` in components.
- **The JWT lives in `localStorage`** via `src/lib/api/token.ts`; the API client
  attaches it. Auth state is exposed by `AuthContext`.

## Commands

| Command            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the dev server (http://localhost:3000) |
| `npm test`         | Run Jest + React Testing Library             |
| `npm run lint`     | ESLint (also runs on pre-commit via Husky)   |
| `npx tsc --noEmit` | Type-check only                              |
| `npm run build`    | Production build                             |

A Husky pre-commit hook runs lint-staged (`eslint --fix` + `prettier`) on staged
files.
