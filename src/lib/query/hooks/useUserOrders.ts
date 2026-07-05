import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { USER_ORDERS } from "@/data/mock/user";
import type { UserOrder } from "@/types";

/**
 * Loads the signed-in customer's order history.
 * Real endpoint: `return apiGet<UserOrder[]>(endpoints.userOrders);`
 */
export function useUserOrders() {
  return useQuery({
    queryKey: queryKeys.userOrders,
    queryFn: async (): Promise<UserOrder[]> => USER_ORDERS,
  });
}
