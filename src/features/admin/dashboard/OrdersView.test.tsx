import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { OrdersView } from "./OrdersView";

describe("OrdersView", () => {
  it("renders fetched orders", async () => {
    renderWithClient(<OrdersView />);
    expect(screen.getByText("All Orders")).toBeInTheDocument();
    expect(await screen.findByText("ORD-2401")).toBeInTheDocument();
  });

  it("shows an empty state when the search matches nothing", async () => {
    renderWithClient(<OrdersView />);
    await screen.findByText("ORD-2401");
    fireEvent.change(screen.getByPlaceholderText("Search orders..."), {
      target: { value: "zzzz" },
    });
    expect(screen.getByText("No orders match your search.")).toBeInTheDocument();
  });
});
