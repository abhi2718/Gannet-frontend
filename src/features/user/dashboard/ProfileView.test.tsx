import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { ProfileView } from "./ProfileView";
import { ProfileAddresses } from "./ProfileAddresses";
import { demoCustomer } from "@/test-utils/authTestUtils";

const mockUpdateUser = jest.fn();
jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => ({ user: demoCustomer, updateUser: mockUpdateUser }),
}));

jest.mock("@/features/user/auth/authApi", () => ({
  __esModule: true,
  updateProfile: jest.fn().mockResolvedValue({
    id: "seed-customer",
    username: "Arjun M",
    email: "arjun.m@gmail.com",
    phone: "9876543210",
    role: "customer",
  }),
}));

jest.mock("@/features/user/commerce/checkoutApi", () => {
  const home = {
    id: "a1",
    label: "Home",
    street: "7 Juhu Beach Road",
    pinCode: "400049",
    city: "Mumbai",
    state: "Maharashtra",
  };
  return {
    __esModule: true,
    fetchAddresses: jest.fn().mockResolvedValue([home]),
    createAddress: jest.fn().mockResolvedValue(home),
    updateAddress: jest.fn().mockResolvedValue(home),
    deleteAddress: jest.fn().mockResolvedValue(undefined),
    formatAddress: (a: { street: string; city: string }) => `${a.street}, ${a.city}`,
  };
});

import * as authApi from "@/features/user/auth/authApi";
import * as checkoutApi from "@/features/user/commerce/checkoutApi";

describe("ProfileView", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the profile and delivery addresses", () => {
    renderWithClient(<ProfileView />);
    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Delivery Addresses")).toBeInTheDocument();
  });

  it("shows the email as a read-only field", () => {
    renderWithClient(<ProfileView />);
    const email = screen.getByDisplayValue(demoCustomer.email) as HTMLInputElement;
    expect(email).toBeDisabled();
    expect(email).toHaveAttribute("readonly");
  });

  it("saves the profile and syncs the auth context", async () => {
    renderWithClient(<ProfileView />);
    fireEvent.click(screen.getByText(/Save Changes/));
    await waitFor(() => expect(authApi.updateProfile).toHaveBeenCalled());
    expect(mockUpdateUser).toHaveBeenCalled();
    expect(await screen.findByText(/Saved!/)).toBeInTheDocument();
  });
});

describe("ProfileAddresses", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lists the saved addresses from the API", async () => {
    renderWithClient(<ProfileAddresses />);
    expect(await screen.findByText("Home")).toBeInTheDocument();
  });

  it("creates a new address via the API", async () => {
    renderWithClient(<ProfileAddresses />);
    fireEvent.click(screen.getByText("+ Add Address"));
    fireEvent.change(screen.getByPlaceholderText("Home / Office"), { target: { value: "Cabin" } });
    fireEvent.change(screen.getByPlaceholderText("Building, street, area"), {
      target: { value: "5 Hill Rd" },
    });
    fireEvent.change(screen.getByPlaceholderText("400001"), { target: { value: "560001" } });
    fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Pune" } });
    fireEvent.change(screen.getByPlaceholderText("State"), { target: { value: "Maharashtra" } });
    fireEvent.change(screen.getByPlaceholderText("Near…"), { target: { value: "Near Park" } });
    fireEvent.click(screen.getByText("Save Address"));
    await waitFor(() =>
      expect(checkoutApi.createAddress).toHaveBeenCalledWith(
        expect.objectContaining({ label: "Cabin", street: "5 Hill Rd", city: "Pune" }),
      ),
    );
  });

  it("deletes an address via the API after confirming", async () => {
    renderWithClient(<ProfileAddresses />);
    fireEvent.click(await screen.findByLabelText("Delete address"));
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByText("Delete"));
    await waitFor(() => expect(checkoutApi.deleteAddress).toHaveBeenCalledWith("a1"));
  });
});
