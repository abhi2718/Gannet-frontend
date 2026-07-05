import { render, screen, fireEvent } from "@testing-library/react";
import { ProductSection } from "./ProductSection";
import { PRODUCTS, BOTTLE_PRICES } from "@/data/products";

describe("ProductSection", () => {
  it("renders a card for every product size", () => {
    render(<ProductSection onAddToCart={jest.fn()} onBookNow={jest.fn()} />);
    for (const p of PRODUCTS) {
      expect(screen.getByText(p.size)).toBeInTheDocument();
    }
  });

  it("adds the first product to the cart with its price", () => {
    const onAddToCart = jest.fn();
    render(<ProductSection onAddToCart={onAddToCart} onBookNow={jest.fn()} />);
    fireEvent.click(screen.getAllByText("Cart")[0]);
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        size: PRODUCTS[0].size,
        price: BOTTLE_PRICES[PRODUCTS[0].size],
        qty: 1,
      }),
    );
  });

  it("opens the product modal from Book Now", () => {
    render(<ProductSection onAddToCart={jest.fn()} onBookNow={jest.fn()} />);
    fireEvent.click(screen.getAllByText("Book Now")[0]);
    expect(screen.getByText("Select Size")).toBeInTheDocument();
  });
});
