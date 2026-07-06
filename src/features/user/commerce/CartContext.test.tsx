import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider, useCart } from "./CartContext";
import type { CartItem } from "@/types";

// Checkout opens the CheckoutModal, which loads addresses via React Query; the
// fetch fails in jsdom (no API), which the address step handles gracefully.
jest.mock("./checkoutApi", () => ({
  __esModule: true,
  fetchAddresses: jest.fn().mockRejectedValue(new Error("no api")),
  createAddress: jest.fn(),
  createOrder: jest.fn(),
  formatAddress: () => "",
}));

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
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <CartProvider>
        <Harness />
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe("CartContext", () => {
  beforeEach(() => {
    mockPush.mockClear();
    window.localStorage.clear();
    guest();
  });

  it("throws when useCart is used outside a provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Harness />)).toThrow(/useCart must be used within a CartProvider/);
    spy.mockRestore();
  });

  it("restores a persisted cart on mount so it survives a refresh", async () => {
    window.localStorage.setItem(
      "gannet.cart",
      JSON.stringify([{ size: "500 ml", label: "Classic", price: 18, qty: 3 }]),
    );
    setup();
    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("3"));
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

  it("remembers the intended checkout when a guest is sent to log in", () => {
    setup(); // guest by default
    fireEvent.click(screen.getByText("book"));
    expect(window.localStorage.getItem("gannet.pendingCheckout")).not.toBeNull();
  });

  it("resumes the pending checkout once the guest has logged in", async () => {
    window.localStorage.setItem("gannet.pendingCheckout", JSON.stringify([item]));
    signedIn();
    setup();
    // The delivery/address popup opens automatically so the order can be finished.
    expect(await screen.findByText("Delivery Details")).toBeInTheDocument();
    // The pending marker is consumed so it doesn't re-open on the next login.
    expect(window.localStorage.getItem("gannet.pendingCheckout")).toBeNull();
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
