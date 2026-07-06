import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { UserEditModal } from "./UserEditModal";
import type { User } from "@/types";

jest.mock("@/lib/api/client");
import { apiPatch } from "@/lib/api/client";
const mockApiPatch = apiPatch as jest.MockedFunction<typeof apiPatch>;

const USER: User = {
  id: "u9",
  name: "Jane Doe",
  email: "jane@example.com",
  city: "Mumbai",
  phone: "9876543210",
  joined: "2026-01-01",
  orders: 3,
  status: "active",
};

describe("UserEditModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiPatch.mockResolvedValue({});
  });

  it("prefills the user's current details", () => {
    renderWithClient(<UserEditModal user={USER} onClose={() => {}} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Phone")).toHaveValue("9876543210");
  });

  it("saves the update via PATCH /users/:id", async () => {
    const onClose = jest.fn();
    renderWithClient(<UserEditModal user={USER} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Janet" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "inactive" } });
    fireEvent.click(screen.getByText("Save Changes"));
    await waitFor(() =>
      expect(mockApiPatch).toHaveBeenCalledWith("/users/u9", {
        username: "Janet",
        email: "jane@example.com",
        phoneNumber: "9876543210",
        status: "inactive",
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("blocks saving when a required field is cleared", async () => {
    renderWithClient(<UserEditModal user={USER} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad-email" } });
    fireEvent.click(screen.getByText("Save Changes"));
    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(mockApiPatch).not.toHaveBeenCalled();
  });
});
