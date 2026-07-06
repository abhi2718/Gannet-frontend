import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts, FALLBACK_CATALOG } from "./useProducts";
import { useAdminOrders } from "./useAdminOrders";
import { useAdminQueries } from "./useAdminQueries";
import { useAdminUsers } from "./useAdminUsers";
import { useAdminChart } from "./useAdminChart";
import { useAdminSummary, useAdminOrderStatus } from "./useAdminAnalytics";
import {
  MOCK_ORDERS,
  MOCK_QUERIES,
  MOCK_USERS,
  CHART_DATA,
  ADMIN_SUMMARY,
  ORDER_STATUS_COUNTS,
} from "@/data/mock/admin";

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("query hooks resolve their mock data", () => {
  it("useProducts falls back to the static catalogue when the API is unavailable", async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(FALLBACK_CATALOG);
  });

  it("useAdminOrders", async () => {
    const { result } = renderHook(() => useAdminOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(MOCK_ORDERS);
  });

  it("useAdminQueries", async () => {
    const { result } = renderHook(() => useAdminQueries(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(MOCK_QUERIES);
  });

  it("useAdminUsers", async () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(MOCK_USERS);
  });

  it("useAdminChart", async () => {
    const { result } = renderHook(() => useAdminChart(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(CHART_DATA);
  });

  it("useAdminSummary", async () => {
    const { result } = renderHook(() => useAdminSummary(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ADMIN_SUMMARY);
  });

  it("useAdminOrderStatus", async () => {
    const { result } = renderHook(() => useAdminOrderStatus(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ORDER_STATUS_COUNTS);
  });
});
