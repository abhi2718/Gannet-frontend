import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutModal } from "./CheckoutModal";
import type { CartItem } from "@/types";

const cartItems: CartItem[] = [
  { size: "500 ml", label: "Classic", price: 18, qty: 2 },
  { size: "1 Litre", label: "Family", price: 32, qty: 1 },
];

describe("CheckoutModal", () => {
  it("shows the verified phone and order total", () => {
    render(
      <CheckoutModal
        cartItems={cartItems}
        userPhone="9998887776"
        onClose={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByText(/9998887776/)).toBeInTheDocument();
    expect(screen.getAllByText("₹68").length).toBeGreaterThan(0);
  });

  it("places the order and shows the success screen", () => {
    render(
      <CheckoutModal
        cartItems={cartItems}
        userPhone="9998887776"
        onClose={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("House no., street, area"), {
      target: { value: "1 Road" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Mumbai" } });
    fireEvent.click(screen.getByText(/Place Order/));
    expect(screen.getByText("Order Placed!")).toBeInTheDocument();
  });
});
