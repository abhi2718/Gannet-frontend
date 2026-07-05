import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders a friendly label for a known status", () => {
    render(<StatusBadge status="out-for-delivery" />);
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
  });

  it("falls back to the raw status for an unknown value", () => {
    render(<StatusBadge status="frozen" />);
    expect(screen.getByText("frozen")).toBeInTheDocument();
  });
});
