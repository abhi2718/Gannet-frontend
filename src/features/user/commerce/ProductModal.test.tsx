import { render, screen, fireEvent } from "@testing-library/react";
import { ProductModal } from "./ProductModal";
import type { CatalogProduct } from "@/types";

const product: CatalogProduct = {
  id: "p1",
  name: "500 ml",
  price: 18,
  description: "Our best-selling size.",
  image: "/bottle.png",
  tag: "Classic",
};

const baseProps = {
  product,
  onClose: jest.fn(),
  onAddToCart: jest.fn(),
  onBookNow: jest.fn(),
};

describe("ProductModal", () => {
  it("shows the opened product", () => {
    render(<ProductModal {...baseProps} />);
    expect(screen.getByAltText(`GANNET ${product.name}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
  });

  it("adds the chosen quantity to the cart", () => {
    const onAddToCart = jest.fn();
    render(<ProductModal {...baseProps} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    fireEvent.click(screen.getByText(/Add to Cart/));
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ size: product.name, price: product.price, qty: 2 }),
    );
  });

  it("books now and closes", () => {
    const onBookNow = jest.fn();
    const onClose = jest.fn();
    render(<ProductModal {...baseProps} onBookNow={onBookNow} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Book Now/));
    expect(onClose).toHaveBeenCalled();
    expect(onBookNow).toHaveBeenCalledWith(expect.objectContaining({ size: product.name }));
  });
});
