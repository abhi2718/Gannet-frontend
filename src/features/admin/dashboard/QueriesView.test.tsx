import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { QueriesView } from "./QueriesView";

describe("QueriesView", () => {
  it("renders fetched queries", async () => {
    renderWithClient(<QueriesView />);
    expect(screen.getByText("All Queries")).toBeInTheDocument();
    expect(await screen.findByText("Rahul Verma")).toBeInTheDocument();
  });

  it("filters rows by the search term", async () => {
    renderWithClient(<QueriesView />);
    await screen.findByText("Rahul Verma");
    fireEvent.change(screen.getByPlaceholderText("Search queries..."), {
      target: { value: "Ananya" },
    });
    expect(screen.getByText("Ananya Singh")).toBeInTheDocument();
    expect(screen.queryByText("Rahul Verma")).not.toBeInTheDocument();
  });
});
