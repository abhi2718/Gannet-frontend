import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { ProfileAddresses } from "./ProfileAddresses";

jest.mock("@/features/user/commerce/checkoutApi", () => ({
  ...jest.requireActual("@/features/user/commerce/checkoutApi"),
  fetchAddresses: jest.fn(),
  deleteAddress: jest.fn(),
}));
import { fetchAddresses, deleteAddress } from "@/features/user/commerce/checkoutApi";

const ADDRESSES = [
  { id: "A1", label: "Home", street: "1 Road", pinCode: "400001", city: "Mumbai", state: "MH" },
];

describe("ProfileAddresses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchAddresses as jest.Mock).mockResolvedValue(ADDRESSES);
    (deleteAddress as jest.Mock).mockResolvedValue(undefined);
  });

  it("asks before deleting and does nothing on cancel", async () => {
    renderWithClient(<ProfileAddresses />);
    await screen.findByText("Home");
    fireEvent.click(screen.getByLabelText("Delete address"));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    fireEvent.click(within(dialog).getByText("Cancel"));
    expect(deleteAddress).not.toHaveBeenCalled();
  });

  it("deletes the address after confirming", async () => {
    renderWithClient(<ProfileAddresses />);
    await screen.findByText("Home");
    fireEvent.click(screen.getByLabelText("Delete address"));
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByText("Delete"));
    await waitFor(() => expect(deleteAddress).toHaveBeenCalledWith("A1"));
  });
});
