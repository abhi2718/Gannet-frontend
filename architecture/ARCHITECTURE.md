# GANNET (front-end) — Architecture

The GANNET water-brand web app: a **Next.js 14 (App Router)** single codebase
serving two surfaces — the customer storefront/landing + dashboard, and the admin
dashboard. It talks to the Gannet REST API (the sibling `gannet` repo). The design
favours small, single-responsibility files (**≤ 200 lines**) grouped by feature.

## Tech stack

| Concern      | Choice                                                    |
| ------------ | --------------------------------------------------------- |
| Framework    | Next.js 14 (App Router), React 18                         |
| Language     | TypeScript (strict)                                       |
| Server state | TanStack React Query 5                                    |
| Client state | React Context (`AuthContext`, `CartContext`)              |
| Styling      | Tailwind (v4 PostCSS) + inline styles                     |
| Animation    | `motion` (Framer Motion)                                  |
| Icons        | `lucide-react`                                            |
| Charts       | `recharts` (admin)                                        |
| Auth         | JWT bearer token in `localStorage`                        |
| Tests        | Jest + React Testing Library (jsdom)                      |
| Lint / hooks | ESLint (`next lint`, max-lines 200) + Husky + lint-staged |

## Route groups (App Router)

`src/app` uses **route groups** to keep the two interfaces cleanly separated
while sharing the root layout + providers:

- **`(user)`** — the end-user surface. Wrapped by `(user)/layout.tsx` in the
  `CartProvider`.
  - `/` — landing / e-commerce (`features/user/landing/LandingPage`)
  - `/login`, `/register` — auth pages (`features/user/auth`)
  - `/dashboard` — customer dashboard, guarded by `RequireAuth role="customer"`.
    A single-page shell (`UserDashboard`) that switches between `home`,
    `profile`, and `order-history` views. Deep-linkable via `?view=` (used by the
    landing navbar's avatar menu).
- **`(admin)`** — the admin surface.
  - `/admin` — management dashboard, guarded by `RequireAuth role="admin"`.

```
app/layout.tsx (Server)  ──►  <Providers>  (QueryClientProvider + AuthProvider)
  │
  ├─ (user)/layout.tsx (Client)  ──►  <CartProvider>  ──►  landing / login / dashboard
  └─ (admin)/admin/layout.tsx    ──►  admin dashboard
```

## Layers (data flow)

```
Component (Client)
  │  calls a hook
  ▼
src/lib/query/hooks/*      (React Query: useQuery / useMutation, query keys)
  │  calls a data-access fn
  ▼
feature *Api.ts / src/lib/api/client.ts   (fetch wrapper: attaches Bearer token,
  │                                          unwraps the { success, data } envelope)
  ▼
Gannet REST API  (NEXT_PUBLIC_API_BASE_URL, e.g. http://localhost:4000/api)
```

- **Components never call `fetch` directly.** They consume a React Query hook.
- **Hooks** (`src/lib/query/hooks/`) own caching, keys (`src/lib/query/keys.ts`),
  and invalidation. Query functions delegate to a data-access module.
- **Data access** is either a feature-local `*Api.ts` (e.g.
  `features/user/auth/authApi.ts`, `features/user/commerce/checkoutApi.ts`) or a
  hook-local mapper, and always goes through the shared **API client**
  (`src/lib/api/client.ts`).

## API client & envelope

`src/lib/api/client.ts` wraps `fetch`:

- Prepends `NEXT_PUBLIC_API_BASE_URL` (already includes the `/api` mount).
- Attaches `Authorization: Bearer <token>` from `src/lib/api/token.ts`.
- Normalises the API envelope: success → `{ success: true, data, count?,
pagination? }`; failure → throws an `ApiError(message, status)`.
- Exposes `apiGet`, `apiPost`, `apiPatch`, `apiDelete`, and `apiGetPaged` (list +
  pagination metadata). Endpoint paths live centrally in
  `src/lib/api/endpoints.ts`.

Some hooks (e.g. `useUserOrders`, `useProducts`) **fall back to mock data**
(`src/data/mock/*`, `src/data/*`) when the request fails, so the UI still renders
during local development without the API running.

## Authentication

`features/user/auth/AuthContext.tsx` is the single source of auth truth:

- Holds `user` + `status` (`loading` | `authenticated` | `unauthenticated`).
- On mount, if a token exists it validates it against `GET /auth/me` and restores
  (or clears) the session — so guards don't flash a redirect.
- Exposes `login`, `register`, `logout`, and **`updateUser(patch)`** (merges
  changed profile fields into the in-memory user after a profile save).
- The JWT is persisted in `localStorage` (`src/lib/api/token.ts`), so the session
  survives a refresh.
- `RequireAuth` (`features/user/auth/RequireAuth.tsx`) guards a subtree by role,
  redirecting unauthenticated users to `/login` and mismatched roles to their own
  dashboard.

## Customer account features

- **Navbar (landing).** `Navbar` is auth-aware: signed-out shows **Login**;
  signed-in shows the **`NavUserMenu`** avatar with a hover/click dropdown
  (Profile / Orders / Logout) that deep-links to `/dashboard?view=…`. The mobile
  panel (`NavbarMobileMenu`) mirrors this.
- **Cart persistence.** `CartContext` hydrates from and saves to `localStorage`
  via `features/user/commerce/cartStorage.ts`, so the cart survives a refresh.
  After an order is placed, the user is routed to `/dashboard`.
- **Profile.** `ProfileView` shows the signed-in user; name + phone are editable
  and saved via `PATCH /users/:id` (`useUpdateProfile` → `authApi.updateProfile`),
  then synced into `AuthContext` with `updateUser`. **Email is read-only.**
- **Addresses.** `ProfileAddresses` lists the account's addresses and supports
  add / edit / delete through the address hooks (`useAddresses`,
  `useCreateAddress`, `useUpdateAddress`, `useDeleteAddress`) over
  `GET/POST/PATCH/DELETE /addresses`.
- **Checkout.** `CheckoutModal` + `AddressStep` prefill the name, fetch saved
  addresses to select from (or add one inline), then place the order via
  `useCreateOrder`.

## Key design decisions

- **Feature-first structure.** Code is grouped by product surface + feature
  (`features/user/landing`, `features/user/commerce`, `features/user/dashboard`,
  `features/user/auth`, `features/admin/dashboard`) rather than by technical type,
  so a feature's UI, its data access, and its tests sit together.
- **Server state ≠ client state.** React Query owns anything from the API; React
  Context owns cross-tree UI state (auth session, cart). They don't overlap.
- **Small files, split by responsibility.** When a component approaches 200 lines
  it is split (e.g. `Navbar` → `NavUserMenu` + `NavbarMobileMenu`; shared
  `initials` extracted to `lib/format/`).
- **Mock fallback.** Hooks degrade to mock data on API failure so the app is
  demoable offline; wiring the real API is a one-line swap per hook.
- **Presentational vs feature components.** Reusable, surface-agnostic visuals
  live in `components/shared/`; anything tied to a feature lives under that
  feature.
