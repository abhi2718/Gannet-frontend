# Conventions & Rules

These are enforced (by ESLint/tsc/Husky) or required-by-convention. Follow them
strictly; if a change must break one, record the reason in a `history/` entry.

## 1. File size — ≤ 200 lines

Every file must be **≤ 200 lines** (`max-lines`, skips blanks/comments; tests,
`src/data/**`, and config are exempt). When a component approaches the limit,
**split by responsibility** — extract a subcomponent, a hook, or a helper module
— rather than reformatting. Precedent: `Navbar` → `NavUserMenu` +
`NavbarMobileMenu`; the shared `initials` helper → `src/lib/format/initials.ts`.

## 2. No unused variables

`@typescript-eslint/no-unused-vars` + `tsc`. Remove dead imports/vars; prefix an
intentionally-unused parameter with `_`.

## 3. Feature-folder layout (mandatory)

- UI lives under `src/features/<surface>/<feature>/` (`user`/`admin` →
  `landing`, `commerce`, `auth`, `dashboard`). A feature keeps its components,
  its data-access `*Api.ts`, and its tests together.
- Cross-surface, presentational-only components go in `src/components/shared/`.
- Data access, hooks, and utilities go under `src/lib/`.
- One component per file, `PascalCase`, with a colocated `*.test.tsx`.

## 4. Client vs Server Components

- The root `app/layout.tsx` stays a **Server Component** and renders the client
  `Providers` wrapper.
- Any component using state, effects, context, events, or browser APIs starts
  with `"use client"`.
- Read `window`/`localStorage` inside effects (or guard `typeof window`) so SSR
  and hydration stay consistent.

## 5. Server data — React Query only

- Components never call `fetch` directly. They consume a hook from
  `src/lib/query/hooks/`.
- Reads use `useQuery`; writes use `useMutation` and **invalidate** the affected
  query keys in `onSuccess`.
- Query keys are defined **once** in `src/lib/query/keys.ts` — never inline a raw
  key array in a hook.
- Query functions delegate to a data-access module (`*Api.ts`) or a colocated
  mapper; they don't embed `fetch`/mapping logic in the component.

## 6. API access & the envelope

- All requests go through `src/lib/api/client.ts` (`apiGet`/`apiPost`/`apiPatch`/
  `apiDelete`/`apiGetPaged`), which attaches the Bearer token and unwraps the
  `{ success, data }` envelope, throwing `ApiError(message, status)` on failure.
- Endpoint paths live in `src/lib/api/endpoints.ts` — add new paths there, don't
  hard-code URLs in features.
- Map the API's shape to the app's type in the `*Api.ts` layer (e.g.
  `toAuthUser`, `toAddress`), so components use clean domain types from
  `src/types`.

## 7. Auth & tokens

- `AuthContext` is the only source of auth truth (`user`, `status`, `login`,
  `register`, `logout`, `updateUser`). Read it via `useAuth()`.
- The JWT is stored only through `src/lib/api/token.ts` (`localStorage`).
- Guard protected subtrees with `RequireAuth role="customer|admin"`; never
  re-implement redirect logic in a page.
- **Email is not user-editable** — profile updates send only editable fields
  (username, phone).

## 8. Config

- The API base URL comes from `NEXT_PUBLIC_API_BASE_URL` (see `.env.example` /
  `.env.local`). Read env only where already centralised (the API client); don't
  scatter `process.env` reads through components.

## 9. Definition of Done (per change — required, in this order)

Before starting: read `ARCHITECTURE.md`, `FOLDER_STRUCTURE.md`, this file, and
skim the newest `history/` entries. Then, for every new/changed module:

1. **Implement** the change in the file identified via `FOLDER_STRUCTURE.md`,
   following the conventions above.
2. **Write/adjust unit tests** (Jest + React Testing Library) covering the
   applicable edge cases:
   - Renders the expected content / hook returns the expected shape.
   - Auth-conditional UI (mock `useAuth` for signed-in vs signed-out).
   - Loading / empty / error states for React Query-backed UI.
   - User interactions and navigation (mock `next/navigation`'s `useRouter`).
   - Guards & deep-links (`RequireAuth`, `?view=`).
   - Data-access wrappers: request shape sent + response mapping.
   - Persistence: localStorage round-trip + corrupt-data tolerance.
   - Mock the API/data-access layer (`jest.mock`) so tests don't hit the network;
     use `test-utils/renderWithClient` for a fresh React Query client.
3. **Run** `npm run lint`, `npx tsc --noEmit`, and `npm test` — all must pass.
4. **Ask the user to test it** and **wait for approval** (see `CLAUDE.md` STEP B).
5. **After approval:** add a `history/` entry, then update `ARCHITECTURE.md` /
   `FOLDER_STRUCTURE.md` if the design changed.

A change is **COMPLETE** only when lint + typecheck + tests pass, the user has
approved, and the docs are updated.

## 10. Documentation

- New/changed folders, components, hooks, routes, or conventions must be reflected
  in `ARCHITECTURE.md` and `FOLDER_STRUCTURE.md` in the same change.
- Every meaningful change gets a dated `history/` entry (see its `README.md`).
- Keep the `FOLDER_STRUCTURE.md` tree accurate when files are added/moved/removed.
