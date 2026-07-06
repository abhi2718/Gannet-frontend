import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { MOCK_ORDERS } from "@/data/mock/admin";
import type { AdminOrder } from "@/types";

/** Delivery address as populated by the `GET /api/orders` aggregation. */
export type ApiAddress = {
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pinCode?: string;
};

/** Order as returned by `GET /api/orders` (user and address joined in). */
export type ApiOrder = {
  _id?: string;
  id?: string;
  orderId?: string;
  customerName: string;
  customerPhone: string;
  bottleSize: string;
  quantity: number;
  amount?: number;
  status: string;
  createdAt?: string;
  address?: ApiAddress | string | null;
};

/** Flattens a populated address (or passes a plain string through). */
export function formatAddress(address: ApiOrder["address"]): string {
  if (!address) return "";
  if (typeof address === "string") return address;
  return [address.street, address.city, address.state, address.pinCode].filter(Boolean).join(", ");
}

export function toAdminOrder(o: ApiOrder): AdminOrder {
  return {
    id: o.orderId ?? o._id ?? o.id ?? "",
    customer: o.customerName,
    phone: o.customerPhone,
    address: formatAddress(o.address),
    size: o.bottleSize,
    qty: o.quantity,
    date: o.createdAt ? o.createdAt.slice(0, 10) : "",
    // API uses spaces ("out for delivery"); the UI keys statuses with hyphens.
    status: o.status.replace(/\s+/g, "-"),
  };
}

/**
 * Loads all orders for the admin dashboard (`GET /api/orders`). Falls back to
 * mock data if the request fails, so the dashboard still renders during local
 * development without the API.
 */
export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: async (): Promise<AdminOrder[]> => {
      try {
        const { data } = await apiGetPaged<ApiOrder>(`${endpoints.orders}?limit=100`);
        return data.map(toAdminOrder);
      } catch {
        return MOCK_ORDERS;
      }
    },
  });
}
