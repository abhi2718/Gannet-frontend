import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { UserDashboard } from "./UserDashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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
  it("renders the customer identity in the header", () => {
    renderDashboard();
    expect(screen.getAllByText("Arjun Mehta").length).toBeGreaterThan(0);
  });

  it("switches to the order history view from the nav", () => {
    renderDashboard();
    fireEvent.click(screen.getByText("My Orders"));
    expect(screen.getByText("Order History")).toBeInTheDocument();
  });
});
