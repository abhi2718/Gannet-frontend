import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { UsersView } from "./UsersView";

jest.mock("@/lib/api/client");
import { apiDelete, apiPatch } from "@/lib/api/client";
const mockApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;
const mockApiPatch = apiPatch as jest.MockedFunction<typeof apiPatch>;

describe("UsersView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiDelete.mockResolvedValue(null);
    mockApiPatch.mockResolvedValue({});
  });

  it("shows a loader before the users resolve", () => {
    renderWithClient(<UsersView />);
    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("renders fetched users", async () => {
    renderWithClient(<UsersView />);
    expect(await screen.findByText("arjun.m@gmail.com")).toBeInTheDocument();
    // "All Users" is both the heading and a select option, so target the heading.
    expect(screen.getByRole("heading", { name: "All Users" })).toBeInTheDocument();
  });

  it("filters to inactive users", async () => {
    renderWithClient(<UsersView />);
    await screen.findByText("arjun.m@gmail.com");
    fireEvent.change(screen.getByLabelText("Filter by status"), { target: { value: "inactive" } });
    // Arjun Mehta is active, so his email drops out of the filtered list.
    expect(screen.queryByText("arjun.m@gmail.com")).not.toBeInTheDocument();
    expect(screen.getByText("meera.j@gmail.com")).toBeInTheDocument();
  });

  it("deletes a user only after confirming in the dialog", async () => {
    renderWithClient(<UsersView />);
    await screen.findByText("arjun.m@gmail.com");
    fireEvent.click(screen.getByLabelText("Delete Arjun Mehta"));
    expect(mockApiDelete).not.toHaveBeenCalled();
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByText("Delete"));
    await waitFor(() =>
      expect(mockApiDelete).toHaveBeenCalledWith(expect.stringContaining("/users/")),
    );
  });

  it("edits a user via the modal", async () => {
    renderWithClient(<UsersView />);
    await screen.findByText("arjun.m@gmail.com");
    fireEvent.click(screen.getByLabelText("Edit Arjun Mehta"));
    expect(await screen.findByLabelText("Name")).toHaveValue("Arjun Mehta");
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "inactive" } });
    fireEvent.click(screen.getByText("Save Changes"));
    await waitFor(() =>
      expect(mockApiPatch).toHaveBeenCalledWith(
        expect.stringContaining("/users/"),
        expect.objectContaining({ status: "inactive" }),
      ),
    );
  });
});
