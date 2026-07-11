import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { OrdersView } from "./OrdersView";

jest.mock("@/lib/api/client");
import { apiDelete, apiPatch } from "@/lib/api/client";
const mockApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;
const mockApiPatch = apiPatch as jest.MockedFunction<typeof apiPatch>;

describe("OrdersView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiDelete.mockResolvedValue(null);
    mockApiPatch.mockResolvedValue({});
  });

  it("shows a loader before the orders resolve", () => {
    renderWithClient(<OrdersView />);
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("renders fetched orders", async () => {
    renderWithClient(<OrdersView />);
    expect(await screen.findByText("ORD-2401")).toBeInTheDocument();
    expect(screen.getByText("All Orders")).toBeInTheDocument();
  });

  it("shows an empty state when the search matches nothing", async () => {
    renderWithClient(<OrdersView />);
    await screen.findByText("ORD-2401");
    fireEvent.change(screen.getByPlaceholderText("Search orders..."), {
      target: { value: "zzzz" },
    });
    expect(screen.getByText("No orders match your search.")).toBeInTheDocument();
  });

  it("paginates and reveals later rows on page 2", async () => {
    renderWithClient(<OrdersView />);
    await screen.findByText("ORD-2401");
    // 10 mock orders at 8 per page → ORD-2409 lives on the second page.
    expect(screen.queryByText("ORD-2409")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Page 2"));
    expect(await screen.findByText("ORD-2409")).toBeInTheDocument();
  });

  it("deletes an order only after confirming in the dialog", async () => {
    renderWithClient(<OrdersView />);
    await screen.findByText("ORD-2401");
    fireEvent.click(screen.getByLabelText("Delete ORD-2401"));
    // The confirm dialog is shown but nothing has been deleted yet.
    expect(mockApiDelete).not.toHaveBeenCalled();
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByText("Delete"));
    await waitFor(() => expect(mockApiDelete).toHaveBeenCalledWith("/orders/ORD-2401"));
  });

  it("edits an order via the modal", async () => {
    renderWithClient(<OrdersView />);
    await screen.findByText("ORD-2401");
    fireEvent.click(screen.getByLabelText("Edit ORD-2401"));
    fireEvent.change(await screen.findByLabelText("Status"), { target: { value: "delivered" } });
    fireEvent.click(screen.getByText("Save Changes"));
    await waitFor(() =>
      expect(mockApiPatch).toHaveBeenCalledWith(
        "/orders/ORD-2401",
        expect.objectContaining({ status: "delivered" }),
      ),
    );
  });
});
