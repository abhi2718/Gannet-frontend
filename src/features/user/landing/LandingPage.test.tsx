import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { AuthProvider } from "@/features/user/auth/AuthContext";
import { LandingPage } from "./LandingPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

describe("LandingPage", () => {
  it("composes the landing sections", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <AuthProvider>
          <CartProvider>
            <LandingPage />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByText("Choose Your Perfect Size")).toBeInTheDocument();
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("Built on Trust & Purity")).toBeInTheDocument();
    // Let the products query settle to its fallback so its state update is flushed.
    expect(await screen.findByText("250 ml")).toBeInTheDocument();
  });
});
