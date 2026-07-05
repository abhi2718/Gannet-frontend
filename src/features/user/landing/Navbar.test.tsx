import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";

const baseProps = {
  scrolled: false,
  onBook: jest.fn(),
  onLogin: jest.fn(),
  cartCount: 0,
  onCartOpen: jest.fn(),
};

describe("Navbar", () => {
  it("shows the brand and navigation items", () => {
    render(<Navbar {...baseProps} />);
    expect(screen.getByText("GANNET")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("fires onLogin and onCartOpen", () => {
    const onLogin = jest.fn();
    const onCartOpen = jest.fn();
    render(<Navbar {...baseProps} onLogin={onLogin} onCartOpen={onCartOpen} />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByLabelText("Open cart"));
    expect(onLogin).toHaveBeenCalled();
    expect(onCartOpen).toHaveBeenCalled();
  });

  it("renders the cart count badge when items are present", () => {
    render(<Navbar {...baseProps} cartCount={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("caps the badge at 9+", () => {
    render(<Navbar {...baseProps} cartCount={42} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });
});
