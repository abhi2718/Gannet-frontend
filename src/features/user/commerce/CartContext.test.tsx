import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import type { CartItem } from "@/types";

const item: CartItem = { size: "500 ml", label: "Classic", price: 18, qty: 1 };

function Harness() {
  const { cartItems, cartCount, addToCart, updateQty, removeFromCart } = useCart();
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="lines">{cartItems.length}</span>
      <button onClick={() => addToCart(item)}>add</button>
      <button onClick={() => updateQty("500 ml", 5)}>set5</button>
      <button onClick={() => removeFromCart("500 ml")}>remove</button>
    </div>
  );
}

function setup() {
  return render(
    <CartProvider>
      <Harness />
    </CartProvider>,
  );
}

describe("CartContext", () => {
  it("throws when useCart is used outside a provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Harness />)).toThrow(/useCart must be used within a CartProvider/);
    spy.mockRestore();
  });

  it("merges quantity when the same size is added twice", () => {
    setup();
    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("lines").textContent).toBe("1");
  });

  it("updates and removes quantities", () => {
    setup();
    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("set5"));
    expect(screen.getByTestId("count").textContent).toBe("5");
    fireEvent.click(screen.getByText("remove"));
    expect(screen.getByTestId("lines").textContent).toBe("0");
  });
});
