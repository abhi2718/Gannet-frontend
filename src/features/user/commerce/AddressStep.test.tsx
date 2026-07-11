import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { AddressStep } from "./AddressStep";
import * as checkoutApi from "./checkoutApi";
import type { Address } from "@/types";

jest.mock("./checkoutApi", () => ({
  __esModule: true,
  fetchAddresses: jest.fn(),
  createAddress: jest.fn(),
  createOrder: jest.fn(),
  formatAddress: (a: Address) => `${a.street}, ${a.city}`,
}));

const home: Address = {
  id: "a1",
  label: "Home",
  street: "7 Juhu Rd",
  pinCode: "400049",
  city: "Mumbai",
  state: "MH",
};
const office: Address = {
  id: "a2",
  label: "Office",
  street: "42 Nariman",
  pinCode: "400021",
  city: "Mumbai",
  state: "MH",
};

describe("AddressStep", () => {
  beforeEach(() => {
    (checkoutApi.fetchAddresses as jest.Mock).mockResolvedValue([home, office]);
  });

  it("lists saved addresses and auto-selects the first", async () => {
    const onSelect = jest.fn();
    renderWithClient(<AddressStep selectedId={null} onSelect={onSelect} />);

    expect(await screen.findByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Office")).toBeInTheDocument();
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(home));
  });

  it("selects another saved address on click", async () => {
    const onSelect = jest.fn();
    renderWithClient(<AddressStep selectedId="a1" onSelect={onSelect} />);
    fireEvent.click(await screen.findByText("Office"));
    expect(onSelect).toHaveBeenCalledWith(office);
  });

  it("saves a new address and selects it", async () => {
    const created: Address = {
      id: "a3",
      label: "Hostel",
      street: "9 College Rd",
      pinCode: "560001",
      city: "Bangalore",
      state: "KA",
    };
    (checkoutApi.createAddress as jest.Mock).mockResolvedValue(created);

    const onSelect = jest.fn();
    renderWithClient(<AddressStep selectedId="a1" onSelect={onSelect} />);
    await screen.findByText("Home");

    fireEvent.click(screen.getByText(/Add new/));
    fireEvent.change(screen.getByLabelText("Label"), { target: { value: "Hostel" } });
    fireEvent.change(screen.getByLabelText("Street Address"), {
      target: { value: "9 College Rd" },
    });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Bangalore" } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Karnataka" } });
    fireEvent.change(screen.getByLabelText("PIN Code"), { target: { value: "560001" } });
    fireEvent.change(screen.getByLabelText("Landmark"), { target: { value: "Near Park" } });
    fireEvent.click(screen.getByText("Save Address"));

    await waitFor(() => expect(checkoutApi.createAddress).toHaveBeenCalled());
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(created));
  });
});
