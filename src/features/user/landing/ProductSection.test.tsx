import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { ProductSection } from "./ProductSection";
import { PRODUCTS, BOTTLE_PRICES } from "@/data/products";

// With no API reachable in tests, useProducts resolves the static fallback,
// whose card titles are the bottle sizes.
describe("ProductSection", () => {
  it("renders a card for every fallback product", async () => {
    renderWithClient(<ProductSection onAddToCart={jest.fn()} onBookNow={jest.fn()} />);
    for (const p of PRODUCTS) {
      expect(await screen.findByText(p.size)).toBeInTheDocument();
    }
  });

  it("adds the first product to the cart with its price", async () => {
    const onAddToCart = jest.fn();
    renderWithClient(<ProductSection onAddToCart={onAddToCart} onBookNow={jest.fn()} />);
    const cartButtons = await screen.findAllByText("Cart");
    fireEvent.click(cartButtons[0]);
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        size: PRODUCTS[0].size,
        price: BOTTLE_PRICES[PRODUCTS[0].size],
        qty: 1,
      }),
    );
  });

  it("opens the product modal from Book Now", async () => {
    renderWithClient(<ProductSection onAddToCart={jest.fn()} onBookNow={jest.fn()} />);
    const bookButtons = await screen.findAllByText("Book Now");
    fireEvent.click(bookButtons[0]);
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });
});
