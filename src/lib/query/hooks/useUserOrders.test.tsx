import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserOrders } from "./useUserOrders";
import { USER_ORDERS } from "@/data/mock/user";
import { apiGetPaged } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiGetPaged: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useUserOrders", () => {
  it("maps a multi-item API order to the dashboard shape", async () => {
    (apiGetPaged as jest.Mock).mockResolvedValue({
      data: [
        {
          orderId: "ORD-1",
          items: [
            { bottleSize: "500 ml", quantity: 12, amount: 18 },
            { bottleSize: "1 Litre", quantity: 6, amount: 32 },
          ],
          totalAmount: 408,
          status: "out for delivery",
          createdAt: "2026-02-01T00:00:00.000Z",
          estimatedDelivery: "2026-02-08T00:00:00.000Z",
          address: "1 Road, Mumbai",
        },
      ],
      count: 1,
      pagination: null,
    });

    const { result } = renderHook(() => useUserOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const o = result.current.data![0];
    expect(o.items).toHaveLength(2);
    expect(o.size).toBe("500 ml +1 more");
    expect(o.qty).toBe(18);
    expect(o.total).toBe(408);
    expect(o.delivery).toBe("2026-02-08");
    // API spaces → UI hyphens.
    expect(o.status).toBe("out-for-delivery");
  });

  it("falls back to the mock order history when the API fails", async () => {
    (apiGetPaged as jest.Mock).mockRejectedValue(new Error("no api"));
    const { result } = renderHook(() => useUserOrders(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(USER_ORDERS);
  });
});
