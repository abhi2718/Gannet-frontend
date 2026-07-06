# Folder Structure & "Where do I change X?"

Use this map to find the most relevant file **before** editing. Keep the tree in
sync when you add or move files. Every `*.tsx`/`*.ts` component, hook, or module
generally has a colocated `*.test.tsx`/`*.test.ts` (omitted below for brevity).

## Tree

```
gannet-next/
├── CLAUDE.md                       # Read-first workflow & rules
├── README.md                       # Getting started, routes, scripts
├── architecture/                   # ← design docs (this folder)
│   ├── ARCHITECTURE.md             # System design & decisions
│   ├── FOLDER_STRUCTURE.md         # This file
│   ├── CONVENTIONS.md              # Rules, patterns, Definition of Done
│   └── history/                    # Append-only change log (one file per change)
│       ├── README.md               # Index (newest-first) + entry template
│       └── YYYY-MM-DD-<slug>.md    # One entry per meaningful change
├── src/
│   ├── app/                        # App Router: routes, layouts, providers
│   │   ├── layout.tsx              # Root layout (Server) → <Providers>
│   │   ├── providers.tsx           # QueryClientProvider + AuthProvider (Client)
│   │   ├── globals.css             # Tailwind + global styles
│   │   ├── (user)/
│   │   │   ├── layout.tsx          # Wraps the user surface in <CartProvider>
│   │   │   ├── page.tsx            # "/"  → LandingPage
│   │   │   ├── login/page.tsx      # "/login"
│   │   │   ├── register/page.tsx   # "/register"
│   │   │   └── dashboard/page.tsx  # "/dashboard" (RequireAuth customer)
│   │   └── (admin)/admin/
│   │       ├── layout.tsx          # (RequireAuth admin)
│   │       └── page.tsx            # "/admin" → admin Dashboard
│   ├── components/shared/          # Cross-surface presentational components
│   │   ├── GannetBirdIcon, HeroBottle, WaterBottle, FloatingDroplets,
│   │   │   SlideScene, FadeIn, Stars, StatusBadge, OtpBoxes …
│   ├── features/
│   │   ├── user/
│   │   │   ├── landing/            # Public storefront
│   │   │   │   ├── LandingPage.tsx        # Composes the sections
│   │   │   │   ├── Navbar.tsx             # Auth-aware top bar
│   │   │   │   ├── NavUserMenu.tsx        # Signed-in avatar dropdown (desktop)
│   │   │   │   ├── NavbarMobileMenu.tsx   # Mobile nav panel
│   │   │   │   ├── HeroSection, ProductSection, FeaturesSection,
│   │   │   │   │   BookingSection, TestimonialsSection, ContactSection,
│   │   │   │   │   ContactInfoPanel, Footer, InquiryPopup …
│   │   │   ├── auth/               # Login / register / session
│   │   │   │   ├── AuthContext.tsx        # user + status + login/register/logout/updateUser
│   │   │   │   ├── RequireAuth.tsx        # Role route guard
│   │   │   │   ├── authApi.ts             # login/register/me/updateProfile
│   │   │   │   ├── LoginPage, RegisterPage, LoginBrandingPanel, AuthField …
│   │   │   ├── commerce/           # Cart + checkout
│   │   │   │   ├── CartContext.tsx        # Cart state + drawer/checkout orchestration
│   │   │   │   ├── cartStorage.ts         # localStorage load/save for the cart
│   │   │   │   ├── CartDrawer, ProductModal …
│   │   │   │   ├── CheckoutModal.tsx      # Delivery details + place order
│   │   │   │   ├── AddressStep.tsx        # Saved-address selector + add-new
│   │   │   │   ├── CheckoutSuccess.tsx
│   │   │   │   └── checkoutApi.ts         # addresses + createOrder data access
│   │   │   └── dashboard/          # Customer dashboard
│   │   │       ├── UserDashboard.tsx      # Shell: header, avatar menu, view switch
│   │   │       ├── UserDashboardHome.tsx  # Welcome, stats, recent, saved address
│   │   │       ├── UserDashboardRecent.tsx, UserDashboardTracking.tsx
│   │   │       ├── ProfileView.tsx        # Editable profile (email read-only)
│   │   │       ├── ProfileAddresses.tsx   # Address list + add/edit/delete
│   │   │       ├── OrderHistoryView.tsx, OrderStatusPopup.tsx
│   │   └── admin/dashboard/        # Admin dashboard (overview, orders, users, queries)
│   │       ├── Dashboard.tsx, DashboardOverview.tsx, OverviewCharts.tsx,
│   │       │   OverviewRecentQueries.tsx, OrdersView.tsx, UsersView.tsx, QueriesView.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # fetch wrapper (envelope, Bearer, ApiError)
│   │   │   ├── endpoints.ts         # Central endpoint paths
│   │   │   └── token.ts             # JWT localStorage get/set/clear
│   │   ├── query/
│   │   │   ├── keys.ts              # React Query key factory
│   │   │   └── hooks/               # One hook (family) per resource
│   │   │       ├── useProducts, useUserOrders, useAddresses (list/create/update/delete/order),
│   │   │       │   useProfile (updateProfile), useAdminOrders/Users/Queries/Analytics/Chart,
│   │   │       │   useQueryMutations …
│   │   ├── format/initials.ts       # Avatar initials helper (shared)
│   │   ├── orders/summary.ts        # Order line summarising helpers
│   │   └── hooks/useOtpInput.ts     # Shared UI hook
│   ├── data/                        # Static + mock data (max-lines exempt)
│   │   ├── content.ts, products.ts, mock/user.ts, mock/admin.ts
│   ├── types/index.ts               # Shared TS types (CartItem, Address, UserOrder …)
│   └── test-utils/                  # renderWithClient, authTestUtils
├── jest.config.js · jest.setup.ts   # Jest (jsdom) config + polyfills
├── .eslintrc.json                   # max-lines 200 (tests/data exempt)
├── next.config.mjs · tsconfig.json · postcss.config.mjs
└── .husky/pre-commit · .lintstagedrc.json
```

## Where do I change X?

| I want to…                            | Change here                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Add a page / route                    | New `src/app/(user                                                              | admin)/<path>/page.tsx` (+ a feature component to render) |
| Change what's on the landing page     | `features/user/landing/` (the relevant `*Section` + `LandingPage.tsx`)          |
| Change the top navbar / account menu  | `features/user/landing/Navbar.tsx`, `NavUserMenu.tsx`, `NavbarMobileMenu.tsx`   |
| Change auth/session behaviour         | `features/user/auth/AuthContext.tsx` (+ `authApi.ts`, `RequireAuth.tsx`)        |
| Change login/register UI              | `features/user/auth/LoginPage.tsx` / `RegisterPage.tsx`                         |
| Change cart behaviour or persistence  | `features/user/commerce/CartContext.tsx` / `cartStorage.ts`                     |
| Change checkout / address selection   | `features/user/commerce/CheckoutModal.tsx`, `AddressStep.tsx`, `checkoutApi.ts` |
| Change the customer dashboard         | `features/user/dashboard/UserDashboard*.tsx`                                    |
| Change profile edit / addresses       | `features/user/dashboard/ProfileView.tsx` / `ProfileAddresses.tsx`              |
| Change the admin dashboard            | `features/admin/dashboard/*`                                                    |
| Add/adjust a server-data hook         | `src/lib/query/hooks/<useX>.ts` (+ a key in `keys.ts`)                          |
| Add/adjust an API call                | The feature's `*Api.ts` or the hook's mapper, via `src/lib/api/client.ts`       |
| Add/rename an endpoint path           | `src/lib/api/endpoints.ts`                                                      |
| Change token storage                  | `src/lib/api/token.ts`                                                          |
| Add a shared, surface-agnostic visual | `src/components/shared/`                                                        |
| Add a shared helper/util              | `src/lib/<area>/` (e.g. `lib/format/`, `lib/orders/`)                           |
| Add/adjust a shared type              | `src/types/index.ts`                                                            |
| Change mock/fallback data             | `src/data/`                                                                     |
| Change the provider stack             | `src/app/providers.tsx` (global) or a group `layout.tsx`                        |

## Naming conventions (quick reference)

- Components: `PascalCase.tsx`, one component per file; colocated `PascalCase.test.tsx`.
- Hooks: `useThing.ts` under `src/lib/query/hooks/` (server data) or `src/lib/hooks/` (UI).
- Data access: `<feature>Api.ts` exposing plain async functions over the API client.
- Feature folders: `features/<surface>/<feature>/` (`user`/`admin` → `landing`,
  `commerce`, `auth`, `dashboard`).
- Query keys: defined once in `src/lib/query/keys.ts`.

Full rules in [`CONVENTIONS.md`](CONVENTIONS.md).
