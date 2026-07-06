import { render, screen, fireEvent } from "@testing-library/react";
import { UserDashboardRecent } from "./UserDashboardRecent";
import type { UserOrder } from "@/types";

const ORDER: UserOrder = {
  id: "ORD-1",
  items: [{ size: "500 ml", qty: 2 }],
  size: "500 ml",
  qty: 2,
  date: "2026-01-01",
  delivery: "2026-01-05",
  address: "1 Road, Mumbai",
  status: "delivered",
  total: 40,
};

describe("UserDashboardRecent", () => {
  it("lists recent orders when the customer has some", () => {
    render(<UserDashboardRecent orders={[ORDER]} onViewAll={jest.fn()} onBook={jest.fn()} />);
    expect(screen.getByText("2× GANNET 500 ml")).toBeInTheDocument();
    expect(screen.queryByText("No bookings yet")).not.toBeInTheDocument();
  });

  it("shows an empty state and a book CTA when there are no orders", () => {
    const onBook = jest.fn();
    render(<UserDashboardRecent orders={[]} onViewAll={jest.fn()} onBook={onBook} />);
    expect(screen.getByText("No bookings yet")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Book Your First Water/));
    expect(onBook).toHaveBeenCalled();
  });
});
