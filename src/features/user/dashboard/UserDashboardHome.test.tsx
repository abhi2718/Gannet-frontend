import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { UserDashboardHome } from "./UserDashboardHome";
import { demoCustomer } from "@/test-utils/authTestUtils";

jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => ({ user: demoCustomer }),
}));

jest.mock("@/features/user/commerce/checkoutApi", () => ({
  __esModule: true,
  fetchAddresses: jest.fn().mockResolvedValue([]),
  formatAddress: (a: { street: string }) => a.street,
}));

describe("UserDashboardHome", () => {
  it("renders the signed-in customer's name and stats once loaded", async () => {
    renderWithClient(<UserDashboardHome onBook={jest.fn()} onNavigate={jest.fn()} />);
    expect(screen.getByText("Arjun Mehta")).toBeInTheDocument();
    expect(await screen.findByText("Total Orders")).toBeInTheDocument();
  });

  it("fires onBook from the welcome CTA", () => {
    const onBook = jest.fn();
    renderWithClient(<UserDashboardHome onBook={onBook} onNavigate={jest.fn()} />);
    fireEvent.click(screen.getByText(/Book Water Now/));
    expect(onBook).toHaveBeenCalled();
  });

  it("navigates to the order history from the recent bookings link", async () => {
    const onNavigate = jest.fn();
    renderWithClient(<UserDashboardHome onBook={jest.fn()} onNavigate={onNavigate} />);
    fireEvent.click(await screen.findByText("View all →"));
    expect(onNavigate).toHaveBeenCalledWith("order-history");
  });

  it("prompts to add an address when none are saved", async () => {
    const onNavigate = jest.fn();
    renderWithClient(<UserDashboardHome onBook={jest.fn()} onNavigate={onNavigate} />);
    expect(await screen.findByText(/No saved address yet/)).toBeInTheDocument();
  });
});
