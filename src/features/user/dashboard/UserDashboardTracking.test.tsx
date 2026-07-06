import { render, screen } from "@testing-library/react";
import { UserDashboardTracking } from "./UserDashboardTracking";
import { TRACK_STEPS } from "@/data/mock/user";
import type { UserOrder } from "@/types";

const order: UserOrder = {
  id: "ORD-9",
  items: [{ size: "1 Litre", qty: 6 }],
  size: "1 Litre",
  qty: 6,
  date: "2024-01-17",
  delivery: "2024-01-20",
  address: "7 Juhu Beach Road, Mumbai",
  status: "confirmed",
  total: 330,
};

describe("UserDashboardTracking", () => {
  it("renders the order id, item, and every tracking step", () => {
    render(<UserDashboardTracking order={order} />);
    expect(screen.getByText("ORD-9")).toBeInTheDocument();
    expect(screen.getByText("6× GANNET 1 Litre")).toBeInTheDocument();
    for (const step of TRACK_STEPS) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });
});
