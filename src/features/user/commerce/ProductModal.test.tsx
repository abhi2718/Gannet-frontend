import { render, screen, fireEvent } from "@testing-library/react";
import { ProductModal } from "./ProductModal";
import { PRODUCTS } from "@/data/products";

const product = PRODUCTS[1];

const baseProps = {
  product,
  onClose: jest.fn(),
  onAddToCart: jest.fn(),
  onBookNow: jest.fn(),
};

describe("ProductModal", () => {
  it("defaults the selected size to the opened product", () => {
    render(<ProductModal {...baseProps} />);
    expect(screen.getByAltText(`GANNET ${product.size}`)).toBeInTheDocument();
  });

  it("adds the selected size and quantity to the cart", () => {
    const onAddToCart = jest.fn();
    render(<ProductModal {...baseProps} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    fireEvent.click(screen.getByText(/Add to Cart/));
    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ size: product.size, qty: 2 }),
    );
  });

  it("books now and closes", () => {
    const onBookNow = jest.fn();
    const onClose = jest.fn();
    render(<ProductModal {...baseProps} onBookNow={onBookNow} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Book Now/));
    expect(onClose).toHaveBeenCalled();
    expect(onBookNow).toHaveBeenCalledWith(expect.objectContaining({ size: product.size }));
  });
});
