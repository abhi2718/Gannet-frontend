import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { UsersView } from "./UsersView";

describe("UsersView", () => {
  it("renders fetched users", async () => {
    renderWithClient(<UsersView />);
    // "All Users" is both the heading and a select option, so target the heading.
    expect(screen.getByRole("heading", { name: "All Users" })).toBeInTheDocument();
    expect(await screen.findByText("arjun.m@gmail.com")).toBeInTheDocument();
  });

  it("filters to inactive users", async () => {
    renderWithClient(<UsersView />);
    await screen.findByText("arjun.m@gmail.com");
    fireEvent.change(screen.getByLabelText("Filter by status"), { target: { value: "inactive" } });
    // Arjun Mehta is active, so his email drops out of the filtered list.
    expect(screen.queryByText("arjun.m@gmail.com")).not.toBeInTheDocument();
    expect(screen.getByText("meera.j@gmail.com")).toBeInTheDocument();
  });
});
