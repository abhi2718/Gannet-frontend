import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { ADMIN_SUMMARY, ORDER_STATUS_COUNTS } from "@/data/mock/admin";
import type { AdminSummary, OrderStatusCounts } from "@/types";

/**
 * Loads platform totals for the overview stat tiles (`GET /api/analytics/summary`).
 * Falls back to mock data if the request fails.
 */
export function useAdminSummary() {
  return useQuery({
    queryKey: queryKeys.adminSummary,
    queryFn: async (): Promise<AdminSummary> => {
      try {
        return await apiGet<AdminSummary>(endpoints.analytics.summary);
      } catch {
        return ADMIN_SUMMARY;
      }
    },
  });
}

/**
 * Loads the order-status breakdown for the overview chart
 * (`GET /api/analytics/order-status`). Falls back to mock data if the request fails.
 */
export function useAdminOrderStatus() {
  return useQuery({
    queryKey: queryKeys.adminOrderStatus,
    queryFn: async (): Promise<OrderStatusCounts> => {
      try {
        return await apiGet<OrderStatusCounts>(endpoints.analytics.orderStatus);
      } catch {
        return ORDER_STATUS_COUNTS;
      }
    },
  });
}
