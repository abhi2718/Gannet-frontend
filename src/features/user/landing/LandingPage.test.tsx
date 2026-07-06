import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/features/user/commerce/CartContext";
import { AuthProvider } from "@/features/user/auth/AuthContext";
import { LandingPage } from "./LandingPage";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

function renderLanding() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <LandingPage />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("LandingPage", () => {
  it("composes the landing sections", async () => {
    renderLanding();
    expect(screen.getByText("Choose Your Perfect Size")).toBeInTheDocument();
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("Built on Trust & Purity")).toBeInTheDocument();
    // Let the products query settle to its fallback so its state update is flushed.
    expect(await screen.findByText("250 ml")).toBeInTheDocument();
  });

  it("scrolls to the bottle picker when the hero 'Book Water Now' CTA is clicked", () => {
    // jsdom does not implement scrollIntoView; spy on it to observe the scroll.
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;
    renderLanding();
    fireEvent.click(screen.getByText(/Book Water Now/));
    expect(scrollSpy).toHaveBeenCalled();
    // The element scrolled into view is the "Choose Your Perfect Size" section.
    const target = scrollSpy.mock.instances[0] as HTMLElement;
    expect(target.id).toBe("products");
  });
});
