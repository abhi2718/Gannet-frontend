# GANNET — Next.js

The GANNET water-brand app, migrated from a single-file Vite/React app into a
modular **Next.js 14 (App Router)** project.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the dev server                      |
| `npm run build`         | Production build                          |
| `npm run start`         | Serve the production build                |
| `npm run lint`          | ESLint (incl. the 200-line-per-file rule) |
| `npm test`              | Jest + React Testing Library              |
| `npm run test:watch`    | Jest in watch mode                        |
| `npm run test:coverage` | Jest with a coverage report               |

## Routes

App Router **route groups** keep the two interfaces cleanly separated:

- **`(user)`** — the end-user surface
  - `/` landing / e-commerce
  - `/login` role-aware phone + OTP login
  - `/dashboard` customer dashboard (profile, orders, tracking)
- **`(admin)`** — the admin surface
  - `/admin` management dashboard (overview, queries, orders, users)

## Structure

```
src/
├── app/                    # routes, layouts, providers, globals.css
├── components/shared/      # cross-surface presentational components
├── features/
│   ├── user/               # END-USER interface (landing, commerce, auth, dashboard)
│   └── admin/              # ADMIN interface (dashboard)
├── data/                   # static + mock data (until the real API is wired)
├── lib/
│   ├── api/                # fetch client + endpoint paths
│   ├── hooks/              # shared hooks (e.g. useOtpInput)
│   └── query/              # React Query keys + data hooks
└── types/                  # shared TypeScript types
```

## Data layer (React Query)

Data is fetched through React Query hooks in `src/lib/query/hooks`. They
currently resolve the mock data in `src/data`. When the real API is ready:

1. Set `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`).
2. Fill in the paths in `src/lib/api/endpoints.ts`.
3. In each hook, swap the mock return for the `apiGet` call shown in its doc comment
   (e.g. `return apiGet<AdminOrder[]>(endpoints.admin.orders);`).

## Conventions

- **Every file is ≤ 200 lines of code**, enforced by the ESLint `max-lines` rule
  (static data in `src/data/**`, tests, and config files are exempt).
- **Husky + lint-staged** run `eslint --fix` and `prettier --write` on staged
  files at commit time (`.husky/pre-commit`).
- Interactive components are Client Components (`"use client"`); the root layout
  stays a Server Component and renders the client `Providers` wrapper.

## Notes

- The demo OTP is `123456`.
- The legacy Vite app remains in the repository root for reference and can be
  removed once this project is verified.
