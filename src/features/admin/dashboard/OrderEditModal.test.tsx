import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { OrderEditModal } from "./OrderEditModal";
import type { AdminOrder } from "@/types";

jest.mock("@/lib/api/client");
import { apiPatch } from "@/lib/api/client";
const mockApiPatch = apiPatch as jest.MockedFunction<typeof apiPatch>;

const ORDER: AdminOrder = {
  id: "ORD-9",
  customer: "Jane",
  phone: "9876543210",
  address: "1 Road",
  items: [{ size: "500 ml", qty: 2, amount: 18 }],
  size: "500 ml",
  qty: 2,
  total: 36,
  date: "2026-01-01",
  status: "pending",
};

describe("OrderEditModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiPatch.mockResolvedValue({});
  });

  it("prefills the order's current details", () => {
    renderWithClient(<OrderEditModal order={ORDER} onClose={() => {}} />);
    expect(screen.getByLabelText("Customer Name")).toHaveValue("Jane");
    expect(screen.getByLabelText("Phone")).toHaveValue("9876543210");
  });

  it("saves the update, converting the status to the API's spaced form", async () => {
    const onClose = jest.fn();
    renderWithClient(<OrderEditModal order={ORDER} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Customer Name"), { target: { value: "Janet" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "out-for-delivery" } });
    fireEvent.click(screen.getByText("Save Changes"));
    await waitFor(() =>
      expect(mockApiPatch).toHaveBeenCalledWith("/orders/ORD-9", {
        customerName: "Janet",
        customerPhone: "9876543210",
        status: "out for delivery",
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("blocks saving and shows the error under the customer field when cleared", async () => {
    renderWithClient(<OrderEditModal order={ORDER} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("Customer Name"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Save Changes"));
    expect(await screen.findByText(/Please enter your name/)).toBeInTheDocument();
    expect(mockApiPatch).not.toHaveBeenCalled();
  });

  it("blocks saving when the phone is not a valid 10-digit number", async () => {
    renderWithClient(<OrderEditModal order={ORDER} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "12345" } });
    fireEvent.click(screen.getByText("Save Changes"));
    expect(await screen.findByText("Please enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(mockApiPatch).not.toHaveBeenCalled();
  });
});
