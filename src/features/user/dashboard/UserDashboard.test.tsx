import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { AuthProvider } from "@/features/user/auth/AuthContext";
import { seedSession, demoCustomer } from "@/test-utils/authTestUtils";
import { UserDashboard } from "./UserDashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <UserDashboard />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("UserDashboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedSession(demoCustomer);
  });

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
