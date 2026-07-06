import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGet } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { CHART_DATA } from "@/data/mock/admin";
import type { ChartPoint } from "@/types";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Chart-ready series returned by `GET /api/analytics/monthly-trends`. */
export type ApiMonthlyTrends = {
  year: number;
  months: number[];
  bookings: number[];
  queries: number[];
};

export function toChartPoints(t: ApiMonthlyTrends): ChartPoint[] {
  return t.months.map((m, i) => ({
    month: MONTH_NAMES[m - 1] ?? String(m),
    orders: t.bookings[i] ?? 0,
    queries: t.queries[i] ?? 0,
  }));
}

/**
 * Loads monthly bookings-vs-queries analytics for the admin overview chart
 * (`GET /api/analytics/monthly-trends`). Falls back to mock data if the request
 * fails, so the dashboard still renders during local development without the API.
 */
export function useAdminChart() {
  return useQuery({
    queryKey: queryKeys.adminChart,
    queryFn: async (): Promise<ChartPoint[]> => {
      try {
        const trends = await apiGet<ApiMonthlyTrends>(endpoints.analytics.monthlyTrends);
        return toChartPoints(trends);
      } catch {
        return CHART_DATA;
      }
    },
  });
}
