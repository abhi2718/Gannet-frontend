import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { CHART_DATA } from "@/data/mock/admin";
import type { ChartPoint } from "@/types";

/**
 * Loads monthly orders-vs-queries analytics for the admin overview chart.
 * Real endpoint: `return apiGet<ChartPoint[]>(endpoints.admin.chart);`
 */
export function useAdminChart() {
  return useQuery({
    queryKey: queryKeys.adminChart,
    queryFn: async (): Promise<ChartPoint[]> => CHART_DATA,
  });
}
