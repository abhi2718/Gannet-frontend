import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import type { CartItem } from "@/types";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

const mockUseAuth = jest.fn();
jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const item: CartItem = { size: "500 ml", label: "Classic", price: 18, qty: 1 };
const customer = {
  id: "1",
  username: "Arjun Mehta",
  email: "arjun.m@gmail.com",
  phone: "9876543210",
  role: "customer" as const,
};

function guest() {
  mockUseAuth.mockReturnValue({
    user: null,
    status: "unauthenticated",
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });
}

function signedIn() {
  mockUseAuth.mockReturnValue({
    user: customer,
    status: "authenticated",
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });
}

function Harness() {
  const { cartItems, cartCount, addToCart, updateQty, removeFromCart, bookNow } = useCart();
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="lines">{cartItems.length}</span>
      <button onClick={() => addToCart(item)}>add</button>
      <button onClick={() => updateQty("500 ml", 5)}>set5</button>
      <button onClick={() => removeFromCart("500 ml")}>remove</button>
      <button onClick={() => bookNow(item)}>book</button>
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
  beforeEach(() => {
    mockPush.mockClear();
    guest();
  });

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

  it("sends a guest to the login page instead of checking out", () => {
    setup(); // guest by default
    fireEvent.click(screen.getByText("book"));
    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Delivery Details")).not.toBeInTheDocument();
  });

  it("checks out a signed-in customer with their account phone and no OTP", () => {
    signedIn();
    setup();
    fireEvent.click(screen.getByText("book"));
    expect(screen.getByText("Delivery Details")).toBeInTheDocument();
    expect(screen.getByText(/9876543210/)).toBeInTheDocument();
    // The phone + OTP verification step no longer appears at checkout.
    expect(screen.queryByText("Enter Mobile Number")).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalledWith("/login");
  });
});
