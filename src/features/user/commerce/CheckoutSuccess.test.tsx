import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutSuccess } from "./CheckoutSuccess";
import type { CartItem } from "@/types";

const cartItems: CartItem[] = [{ size: "500 ml", label: "Classic", price: 18, qty: 2 }];

describe("CheckoutSuccess", () => {
  it("summarises the placed order", () => {
    render(
      <CheckoutSuccess
        cartItems={cartItems}
        name="Test User"
        city="Mumbai"
        date="2024-02-01"
        count={2}
        total={36}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByText("Order Placed!")).toBeInTheDocument();
    // ₹36 appears as both the line total and the grand total.
    expect(screen.getAllByText("₹36").length).toBeGreaterThanOrEqual(1);
  });

  it("fires onDone", () => {
    const onDone = jest.fn();
    render(
      <CheckoutSuccess
        cartItems={cartItems}
        name="Test User"
        city="Mumbai"
        date=""
        count={2}
        total={36}
        onDone={onDone}
      />,
    );
    fireEvent.click(screen.getByText("Done"));
    expect(onDone).toHaveBeenCalled();
  });
});
