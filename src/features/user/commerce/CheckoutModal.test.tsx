import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { CheckoutModal } from "./CheckoutModal";
import * as checkoutApi from "./checkoutApi";
import type { Address, CartItem } from "@/types";

jest.mock("./checkoutApi", () => ({
  __esModule: true,
  fetchAddresses: jest.fn(),
  createAddress: jest.fn(),
  createOrder: jest.fn(),
  formatAddress: (a: Address) => `${a.street}, ${a.city}`,
}));

const cartItems: CartItem[] = [
  { size: "500 ml", label: "Classic", price: 18, qty: 2 },
  { size: "1 Litre", label: "Family", price: 32, qty: 1 },
];

const savedAddress: Address = {
  id: "a1",
  label: "Home",
  street: "1 Road",
  pinCode: "400001",
  city: "Mumbai",
  state: "MH",
};

function open(overrides: Partial<Record<string, unknown>> = {}) {
  return renderWithClient(
    <CheckoutModal
      cartItems={cartItems}
      userName="Test User"
      userPhone="9998887776"
      onClose={jest.fn()}
      onDone={jest.fn()}
      {...overrides}
    />,
  );
}

describe("CheckoutModal", () => {
  beforeEach(() => {
    (checkoutApi.fetchAddresses as jest.Mock).mockResolvedValue([savedAddress]);
    (checkoutApi.createOrder as jest.Mock).mockResolvedValue({ orderId: "ORD-1" });
  });

  it("shows the signed-in phone and the order total", () => {
    open();
    expect(screen.getByText(/9998887776/)).toBeInTheDocument();
    // 18*2 + 32*1 = 68
    expect(screen.getAllByText("₹68").length).toBeGreaterThan(0);
  });

  it("places the order with all cart items once an address is selected", async () => {
    open();
    // The saved address loads and is auto-selected.
    await screen.findByText("Home");
    fireEvent.click(screen.getByText(/Place Order/));

    await waitFor(() => expect(screen.getByText("Order Placed!")).toBeInTheDocument());
    expect(checkoutApi.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Test User",
        customerPhone: "9998887776",
        addressId: "a1",
        cartItems,
      }),
    );
  });

  it("surfaces an error when placing the order fails", async () => {
    (checkoutApi.createOrder as jest.Mock).mockRejectedValue(new Error("Server down"));
    open();
    await screen.findByText("Home");
    fireEvent.click(screen.getByText(/Place Order/));
    expect(await screen.findByText("Server down")).toBeInTheDocument();
  });
});
