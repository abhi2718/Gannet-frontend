import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { MOCK_ORDERS } from "@/data/mock/admin";
import type { AdminOrder } from "@/types";

/**
 * Loads all orders for the admin dashboard.
 * Real endpoint: `return apiGet<AdminOrder[]>(endpoints.admin.orders);`
 */
export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: async (): Promise<AdminOrder[]> => MOCK_ORDERS,
  });
}
