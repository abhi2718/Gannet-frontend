import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "./useProducts";
import { useAdminOrders } from "./useAdminOrders";
import { useAdminQueries } from "./useAdminQueries";
import { useAdminUsers } from "./useAdminUsers";
import { useAdminChart } from "./useAdminChart";
import { PRODUCTS } from "@/data/products";
import { MOCK_ORDERS, MOCK_QUERIES, MOCK_USERS, CHART_DATA } from "@/data/mock/admin";

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("query hooks resolve their mock data", () => {
  it("useProducts", async () => {
    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(PRODUCTS);
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
});
