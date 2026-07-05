import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { OrderHistoryView } from "./OrderHistoryView";
import { USER_ORDERS } from "@/data/mock/user";

describe("OrderHistoryView", () => {
  it("renders the fetched orders", async () => {
    renderWithClient(<OrderHistoryView />);
    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(await screen.findByText(USER_ORDERS[0].id)).toBeInTheDocument();
  });

  it("opens the tracking popup for an order", async () => {
    renderWithClient(<OrderHistoryView />);
    const trackButtons = await screen.findAllByText("Track Status");
    fireEvent.click(trackButtons[0]);
    await waitFor(() => expect(screen.getByText("Order Status")).toBeInTheDocument());
  });
});
