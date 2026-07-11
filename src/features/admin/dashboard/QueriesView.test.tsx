import { screen, fireEvent, waitFor, within } from "@testing-library/react";
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

  it("shows a loader before the queries resolve", () => {
    renderWithClient(<QueriesView />);
    expect(screen.getByText("Loading queries...")).toBeInTheDocument();
  });

  it("renders fetched queries (falls back to mock data without the API)", async () => {
    renderWithClient(<QueriesView />);
    expect(await screen.findByText("Rahul Verma")).toBeInTheDocument();
    expect(screen.getByText("All Queries")).toBeInTheDocument();
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

  it("deletes a query only after confirming in the dialog", async () => {
    renderWithClient(<QueriesView />);
    await screen.findByText("Rahul Verma");
    fireEvent.click(screen.getByLabelText("Delete Rahul Verma"));
    expect(mockApiDelete).not.toHaveBeenCalled();
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByText("Delete"));
    await waitFor(() =>
      expect(mockApiDelete).toHaveBeenCalledWith(expect.stringContaining("QRY-001")),
    );
  });
});
