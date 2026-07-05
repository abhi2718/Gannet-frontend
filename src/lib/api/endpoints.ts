/**
 * Centralised Gannet API endpoint paths, relative to `NEXT_PUBLIC_API_BASE_URL`
 * (which already includes the `/api` mount, e.g. `http://localhost:4000/api`).
 */
export const endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
  },
  users: "/users",
  user: (id: string) => `/users/${id}`,
  products: "/products",
  product: (id: string) => `/products/${id}`,
  queries: "/queries",
  query: (id: string) => `/queries/${id}`,
  addresses: "/addresses",
  address: (id: string) => `/addresses/${id}`,
  orders: "/orders",
  myOrders: "/orders/my",
  order: (id: string) => `/orders/${id}`,
  orderStatus: (id: string) => `/orders/${id}/status`,
  analytics: {
    myOrders: "/analytics/my-orders",
    orderStatus: "/analytics/order-status",
    summary: "/analytics/summary",
    monthlyTrends: "/analytics/monthly-trends",
  },
  health: "/health",
} as const;
