import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { AuthProvider } from "@/features/user/auth/AuthContext";
import { seedSession, demoAdmin } from "@/test-utils/authTestUtils";
import { Dashboard } from "./Dashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const renderDashboard = () =>
  renderWithClient(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>,
  );

describe("Dashboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedSession(demoAdmin);
  });

  it("shows the overview tab by default", () => {
    renderDashboard();
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
  });

  it("renders every sidebar section", () => {
    renderDashboard();
    for (const label of ["Dashboard", "Queries", "Orders", "Users"]) {
      // Some labels (e.g. "Queries") also appear in the overview tables.
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("switches the active tab from the sidebar", () => {
    renderDashboard();
    // The top-bar title reflects the active tab (rendered lowercase, capitalised via CSS).
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("overview");
    fireEvent.click(screen.getByText("Users"));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("users");
  });
});
