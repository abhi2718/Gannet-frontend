/**
 * Centralised API endpoint paths. These are placeholders relative to
 * `NEXT_PUBLIC_API_BASE_URL`; update them once the backend contract is known.
 */
export const endpoints = {
  products: "/products",
  userOrders: "/me/orders",
  admin: {
    queries: "/admin/queries",
    orders: "/admin/orders",
    users: "/admin/users",
    chart: "/admin/analytics/monthly",
  },
} as const;
