import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { Dashboard } from "./Dashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "a",
      username: "Admin",
      email: "admin@gannet.com",
      phone: "9999999999",
      role: "admin",
    },
    status: "authenticated",
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Dashboard", () => {
  it("shows the overview tab by default", () => {
    renderWithClient(<Dashboard />);
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
  });

  it("renders every sidebar section", () => {
    renderWithClient(<Dashboard />);
    for (const label of ["Dashboard", "Queries", "Orders", "Users"]) {
      // Some labels (e.g. "Queries") also appear in the overview tables.
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("switches the active tab from the sidebar", () => {
    renderWithClient(<Dashboard />);
    // The top-bar title reflects the active tab (rendered lowercase, capitalised via CSS).
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("overview");
    fireEvent.click(screen.getByText("Users"));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("users");
  });
});
