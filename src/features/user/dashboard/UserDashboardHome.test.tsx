import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { UserDashboardHome } from "./UserDashboardHome";

describe("UserDashboardHome", () => {
  it("renders the welcome banner and stats once loaded", async () => {
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
});
