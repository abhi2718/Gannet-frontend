import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileView } from "./ProfileView";
import { ProfileAddresses } from "./ProfileAddresses";

describe("ProfileView", () => {
  it("renders the profile and delivery addresses", () => {
    render(<ProfileView />);
    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Delivery Addresses")).toBeInTheDocument();
  });

  it("confirms a profile save", () => {
    render(<ProfileView />);
    fireEvent.click(screen.getByText(/Save Changes/));
    expect(screen.getByText(/Saved!/)).toBeInTheDocument();
  });
});

describe("ProfileAddresses", () => {
  it("adds a new address to the list", () => {
    render(<ProfileAddresses />);
    fireEvent.click(screen.getByText("+ Add Address"));
    fireEvent.change(screen.getByPlaceholderText("Home / Office"), { target: { value: "Cabin" } });
    fireEvent.change(screen.getByPlaceholderText("Building, street, area"), {
      target: { value: "5 Hill Rd" },
    });
    fireEvent.click(screen.getByText("Save Address"));
    expect(screen.getByText("Cabin")).toBeInTheDocument();
  });
});
