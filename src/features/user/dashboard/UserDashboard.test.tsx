import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { UserDashboard } from "./UserDashboard";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      username: "Arjun Mehta",
      email: "arjun.m@gmail.com",
      phone: "9876543210",
      role: "customer",
    },
    status: "authenticated",
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <CartProvider>
        <UserDashboard />
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe("UserDashboard", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders the signed-in customer's identity in the header", () => {
    renderDashboard();
    expect(screen.getAllByText("Arjun Mehta").length).toBeGreaterThan(0);
  });

  it("switches to the order history view from the nav", () => {
    renderDashboard();
    fireEvent.click(screen.getByText("My Orders"));
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });

  it("sends the customer to the storefront bottle picker from the header Book Water button", () => {
    renderDashboard();
    fireEvent.click(screen.getByRole("button", { name: "Book Water" }));
    expect(mockPush).toHaveBeenCalledWith("/#products");
  });

  it("sends the customer to the storefront from the welcome 'Book Water Now' CTA", () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/Book Water Now/));
    expect(mockPush).toHaveBeenCalledWith("/#products");
  });
});
