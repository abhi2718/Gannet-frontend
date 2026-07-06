import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddresses, useCreateAddress, useCreateOrder } from "./useAddresses";
import * as checkoutApi from "@/features/user/commerce/checkoutApi";
import type { Address } from "@/types";

jest.mock("@/features/user/commerce/checkoutApi", () => ({
  __esModule: true,
  fetchAddresses: jest.fn(),
  createAddress: jest.fn(),
  createOrder: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const addr: Address = {
  id: "a1",
  label: "Home",
  street: "1 Road",
  pinCode: "400001",
  city: "Mumbai",
  state: "MH",
};

describe("useAddresses hooks", () => {
  it("loads the saved addresses", async () => {
    (checkoutApi.fetchAddresses as jest.Mock).mockResolvedValue([addr]);
    const { result } = renderHook(() => useAddresses(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([addr]);
  });

  it("saves a new address via the create mutation", async () => {
    (checkoutApi.createAddress as jest.Mock).mockResolvedValue(addr);
    const { result } = renderHook(() => useCreateAddress(), { wrapper });
    const saved = await result.current.mutateAsync({
      label: "Home",
      street: "1 Road",
      pinCode: "400001",
      city: "Mumbai",
      state: "MH",
    });
    expect(saved).toEqual(addr);
    expect(checkoutApi.createAddress).toHaveBeenCalled();
  });

  it("places an order via the create-order mutation", async () => {
    (checkoutApi.createOrder as jest.Mock).mockResolvedValue({ orderId: "ORD-1" });
    const { result } = renderHook(() => useCreateOrder(), { wrapper });
    await result.current.mutateAsync({
      customerName: "Jane",
      customerPhone: "+12025550123",
      cartItems: [{ size: "500 ml", label: "Classic", price: 18, qty: 2 }],
      addressId: "a1",
    });
    expect(checkoutApi.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({ addressId: "a1" }),
    );
  });
});
