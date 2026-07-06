import { render, screen, fireEvent } from "@testing-library/react";
import { OrderStatusPopup } from "./OrderStatusPopup";
import type { UserOrder } from "@/types";

const base: UserOrder = {
  id: "ORD-1",
  items: [{ size: "500 ml", qty: 12 }],
  size: "500 ml",
  qty: 12,
  date: "2024-01-18",
  delivery: "2024-01-19",
  address: "7 Juhu Beach Road, Mumbai",
  status: "out-for-delivery",
  total: 216,
};

describe("OrderStatusPopup", () => {
  it("renders the tracking steps for an active order", () => {
    render(<OrderStatusPopup order={base} onClose={jest.fn()} />);
    expect(screen.getByText("ORD-1")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("₹216")).toBeInTheDocument();
  });

  it("shows a cancelled state", () => {
    render(<OrderStatusPopup order={{ ...base, status: "cancelled" }} onClose={jest.fn()} />);
    expect(screen.getByText("Order Cancelled")).toBeInTheDocument();
  });

  it("closes from the Close button", () => {
    const onClose = jest.fn();
    render(<OrderStatusPopup order={base} onClose={onClose} />);
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
