import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { QueriesView } from "./QueriesView";

jest.mock("@/lib/api/client");
import { apiPatch, apiDelete } from "@/lib/api/client";
const mockApiPatch = apiPatch as jest.MockedFunction<typeof apiPatch>;
const mockApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe("QueriesView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiPatch.mockResolvedValue({});
    mockApiDelete.mockResolvedValue({});
  });

  it("renders fetched queries (falls back to mock data without the API)", async () => {
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

  it("updates a query's status via the API", async () => {
    renderWithClient(<QueriesView />);
    await screen.findByText("Rahul Verma");
    fireEvent.change(screen.getByLabelText("Status for Rahul Verma"), {
      target: { value: "contacted" },
    });
    await waitFor(() =>
      expect(mockApiPatch).toHaveBeenCalledWith(expect.stringContaining("QRY-001"), {
        status: "contacted",
      }),
    );
  });

  it("deletes a query after a confirm click", async () => {
    renderWithClient(<QueriesView />);
    await screen.findByText("Rahul Verma");
    const del = screen.getByLabelText("Delete Rahul Verma");
    fireEvent.click(del); // first click arms the confirm
    fireEvent.click(del); // second click deletes
    await waitFor(() =>
      expect(mockApiDelete).toHaveBeenCalledWith(expect.stringContaining("QRY-001")),
    );
  });
});
