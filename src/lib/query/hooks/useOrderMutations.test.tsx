import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateOrder, useDeleteOrder } from "./useOrderMutations";
import { apiPatch, apiDelete } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiPatch: jest.fn(),
  apiDelete: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useOrderMutations", () => {
  beforeEach(() => jest.clearAllMocks());

  it("PATCHes /orders/:id with the edited fields", async () => {
    (apiPatch as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useUpdateOrder(), { wrapper });
    await result.current.mutateAsync({
      id: "ORD-1",
      input: { customerName: "Jane", status: "delivered" },
    });
    await waitFor(() =>
      expect(apiPatch).toHaveBeenCalledWith("/orders/ORD-1", {
        customerName: "Jane",
        status: "delivered",
      }),
    );
  });

  it("DELETEs /orders/:id", async () => {
    (apiDelete as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useDeleteOrder(), { wrapper });
    await result.current.mutateAsync("ORD-2");
    await waitFor(() => expect(apiDelete).toHaveBeenCalledWith("/orders/ORD-2"));
  });
});
