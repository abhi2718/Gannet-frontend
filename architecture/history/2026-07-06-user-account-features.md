# 2026-07-06 — Customer account features + docs system

- **What:** Two things — (A) the signed-in customer experience, wired to the real
  API, and (B) this front-end architecture/docs system.

  **(A) Account features (`gannet-next/src`):**

  - **Auth-aware navbar.** `landing/Navbar.tsx` now hides **Login** when signed in
    and renders a new **`landing/NavUserMenu.tsx`** avatar with a hover/click
    dropdown (Profile / Orders / Logout) that deep-links to `/dashboard?view=…`.
    Extracted the mobile panel to **`landing/NavbarMobileMenu.tsx`** (which also
    got the signed-in Profile/Orders/Logout items) to stay under 200 lines.
  - **Cart persistence.** New **`commerce/cartStorage.ts`** (load/save +
    corrupt-data guard); `commerce/CartContext.tsx` hydrates on mount and saves on
    change, so the cart survives a refresh. After an order, `handleOrderDone` now
    routes to `/dashboard`.
  - **Profile.** `dashboard/ProfileView.tsx` rewritten to use the signed-in user;
    name + phone editable, **email read-only**; saves via `PATCH /users/:id`
    (`authApi.updateProfile` + new **`lib/query/hooks/useProfile.ts`**), then syncs
    the auth context. Added **`updateUser`** to `auth/AuthContext.tsx`.
  - **Addresses.** `dashboard/ProfileAddresses.tsx` rewritten off hardcoded data
    onto the real API (list/add/edit/delete) via new `useUpdateAddress`/
    `useDeleteAddress` in `lib/query/hooks/useAddresses.ts` and
    `updateAddress`/`deleteAddress` in `commerce/checkoutApi.ts`.
  - **Dashboard.** `dashboard/UserDashboard.tsx` reads `?view=` to open a tab
    (profile / order-history) from the navbar deep-links; `UserDashboardHome.tsx`
    now shows the real username + the account's saved address instead of hardcoded
    values.
  - **Checkout popup** (select/add address, prefilled name → place order) was
    already implemented in `CheckoutModal` + `AddressStep`; left as is.
  - **Shared util.** Extracted `initials()` to **`lib/format/initials.ts`**
    (deduped from three components).

  **(B) Docs system (`gannet-next/`):** added `CLAUDE.md` (read-first workflow)
  and the `architecture/` folder — `ARCHITECTURE.md`, `FOLDER_STRUCTURE.md`,
  `CONVENTIONS.md`, and this `history/` folder (index + entries).

- **Why:** User request — when a customer is logged in, the home navbar should
  show an avatar menu (not Login) with Profile/Orders/Logout; the cart must
  survive a refresh; the profile must show real data and be editable (except
  email); addresses must be fetched and add/edit-able; checkout should let the
  user pick/fill an address; and after ordering the user lands on the dashboard
  with the latest order. Plus: establish the same architecture/history/CLAUDE
  workflow the backend already has.

- **Tests:** Updated `Navbar.test.tsx` (mock `useAuth`; guest Login vs signed-in
  avatar menu + Profile deep-link), `ProfileView.test.tsx` (real user, read-only
  email, save syncs auth; addresses list/create/delete), `UserDashboardHome.test.tsx`
  (mock auth + addresses; no-address prompt), `CartContext.test.tsx` (localStorage
  isolation + restore-on-mount), `useAddresses.test.tsx` (update/delete mutations),
  `AuthContext.test.tsx` (`updateUser` merge). Added `NavUserMenu.test.tsx` and
  `cartStorage.test.ts`. Result: **46 suites / 167 tests pass**, `npx tsc --noEmit`
  clean, `next lint` clean, `next build` succeeds.

- **Notes:** The frontend targets the real API at `NEXT_PUBLIC_API_BASE_URL`
  (`http://localhost:4000/api`); verified via build + suite (API mocked), not a
  live two-app run — start the `gannet` API + `npm run dev` to exercise end-to-end.
  **Backend follow-up (flagged, not changed):** `PATCH /api/users/:id` only
  requires authentication, not ownership/admin — consider an owner-or-admin guard
  and rejecting `userType`/`status` from customers.
