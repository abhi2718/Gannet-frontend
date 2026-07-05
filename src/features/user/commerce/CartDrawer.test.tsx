import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "./CartDrawer";
import type { CartItem } from "@/types";

const items: CartItem[] = [{ size: "500 ml", label: "Classic", price: 18, qty: 2 }];

const baseProps = {
  onClose: jest.fn(),
  onQtyChange: jest.fn(),
  onRemove: jest.fn(),
  onCheckout: jest.fn(),
};

describe("CartDrawer", () => {
  it("shows the empty state when there are no items", () => {
    render(<CartDrawer {...baseProps} items={[]} />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("renders the line total for items", () => {
    render(<CartDrawer {...baseProps} items={items} />);
    // ₹36 shows as both the line total and the footer total.
    expect(screen.getAllByText("₹36").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("GANNET 500 ml")).toBeInTheDocument();
  });

  it("increments quantity and removes items", () => {
    const onQtyChange = jest.fn();
    const onRemove = jest.fn();
    render(
      <CartDrawer {...baseProps} items={items} onQtyChange={onQtyChange} onRemove={onRemove} />,
    );
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    fireEvent.click(screen.getByLabelText("Remove 500 ml"));
    expect(onQtyChange).toHaveBeenCalledWith("500 ml", 3);
    expect(onRemove).toHaveBeenCalledWith("500 ml");
  });

  it("proceeds to checkout", () => {
    const onCheckout = jest.fn();
    render(<CartDrawer {...baseProps} items={items} onCheckout={onCheckout} />);
    fireEvent.click(screen.getByText(/Proceed to Checkout/));
    expect(onCheckout).toHaveBeenCalled();
  });
});
