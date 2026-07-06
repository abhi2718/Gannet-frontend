/** Stable React Query key factory shared across hooks. */
export const queryKeys = {
  products: ["products"] as const,
  userOrders: ["user", "orders"] as const,
  adminQueries: ["admin", "queries"] as const,
  adminOrders: ["admin", "orders"] as const,
  adminUsers: ["admin", "users"] as const,
  adminChart: ["admin", "chart"] as const,
  adminSummary: ["admin", "summary"] as const,
  adminOrderStatus: ["admin", "order-status"] as const,
};
