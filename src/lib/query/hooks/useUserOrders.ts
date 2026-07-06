import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { summarizeSize, totalQty } from "@/lib/orders/summary";
import { formatAddress, toOrderItems, type ApiOrder } from "@/lib/query/hooks/useAdminOrders";
import { USER_ORDERS } from "@/data/mock/user";
import type { UserOrder } from "@/types";

/** Order as returned by `GET /api/orders/my` (address populated). */
type MyApiOrder = ApiOrder & { estimatedDelivery?: string };

function toUserOrder(o: MyApiOrder): UserOrder {
  const items = toOrderItems(o.items);
  return {
    id: o.orderId ?? o._id ?? o.id ?? "",
    items,
    size: summarizeSize(items),
    qty: totalQty(items),
    date: o.createdAt ? o.createdAt.slice(0, 10) : "",
    delivery: o.estimatedDelivery ? o.estimatedDelivery.slice(0, 10) : "",
    address: formatAddress(o.address),
    // API uses spaces ("out for delivery"); the UI keys statuses with hyphens.
    status: o.status.replace(/\s+/g, "-"),
    total: o.totalAmount ?? items.reduce((s, i) => s + i.qty * (i.amount ?? 0), 0),
  };
}

/**
 * Loads the signed-in customer's order history (`GET /api/orders/my`). Falls
 * back to the mock list if the request fails, so the dashboard still renders
 * during local development without the API.
 */
export function useUserOrders() {
  return useQuery({
    queryKey: queryKeys.userOrders,
    queryFn: async (): Promise<UserOrder[]> => {
      try {
        const { data } = await apiGetPaged<MyApiOrder>(`${endpoints.myOrders}?limit=100`);
        return data.map(toUserOrder);
      } catch {
        return USER_ORDERS;
      }
    },
  });
}
