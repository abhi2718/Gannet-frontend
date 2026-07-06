import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { summarizeSize, totalQty } from "@/lib/orders/summary";
import { MOCK_ORDERS } from "@/data/mock/admin";
import type { AdminOrder, OrderItem } from "@/types";

/** Delivery address as populated by the `GET /api/orders` aggregation. */
export type ApiAddress = {
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pinCode?: string;
};

/** A single product line as stored on the order (`items[]`). */
export type ApiOrderItem = {
  bottleSize: string;
  quantity: number;
  amount: number;
};

/** Order as returned by `GET /api/orders` (user and address joined in). */
export type ApiOrder = {
  _id?: string;
  id?: string;
  orderId?: string;
  customerName: string;
  customerPhone: string;
  items?: ApiOrderItem[];
  totalAmount?: number;
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

/** Normalise the API `items[]` into the app's `OrderItem[]`. */
export function toOrderItems(items: ApiOrderItem[] = []): OrderItem[] {
  return items.map((i) => ({ size: i.bottleSize, qty: i.quantity, amount: i.amount }));
}

export function toAdminOrder(o: ApiOrder): AdminOrder {
  const items = toOrderItems(o.items);
  return {
    id: o.orderId ?? o._id ?? o.id ?? "",
    customer: o.customerName,
    phone: o.customerPhone,
    address: formatAddress(o.address),
    items,
    size: summarizeSize(items),
    qty: totalQty(items),
    total: o.totalAmount ?? items.reduce((s, i) => s + i.qty * (i.amount ?? 0), 0),
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
