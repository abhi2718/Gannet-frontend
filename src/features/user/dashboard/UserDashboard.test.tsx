import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { UserDashboard } from "./UserDashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
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
  it("renders the signed-in customer's identity in the header", () => {
    renderDashboard();
    expect(screen.getAllByText("Arjun Mehta").length).toBeGreaterThan(0);
  });

  it("switches to the order history view from the nav", () => {
    renderDashboard();
    fireEvent.click(screen.getByText("My Orders"));
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });
});
