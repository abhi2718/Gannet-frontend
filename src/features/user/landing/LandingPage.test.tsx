import { render, screen } from "@testing-library/react";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { AuthProvider } from "@/features/user/auth/AuthContext";
import { LandingPage } from "./LandingPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

describe("LandingPage", () => {
  it("composes the landing sections", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <LandingPage />
        </CartProvider>
      </AuthProvider>,
    );
    expect(screen.getByText("Choose Your Perfect Size")).toBeInTheDocument();
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("Built on Trust & Purity")).toBeInTheDocument();
  });
});
