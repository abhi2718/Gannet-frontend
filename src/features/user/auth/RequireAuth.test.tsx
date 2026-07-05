import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, type Role } from "./AuthContext";
import { RequireAuth } from "./RequireAuth";
import { seedSession, demoCustomer, demoAdmin } from "@/test-utils/authTestUtils";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

function renderGuard(role: Role) {
  return render(
    <AuthProvider>
      <RequireAuth role={role}>
        <div>protected content</div>
      </RequireAuth>
    </AuthProvider>,
  );
}

describe("RequireAuth", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockReplace.mockClear();
  });

  it("redirects an unauthenticated visitor to /login", async () => {
    renderGuard("customer");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children when the role matches", async () => {
    seedSession(demoCustomer);
    renderGuard("customer");
    await waitFor(() => expect(screen.getByText("protected content")).toBeInTheDocument());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("sends a customer away from an admin-only route", async () => {
    seedSession(demoCustomer);
    renderGuard("admin");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("sends an admin away from a customer-only route", async () => {
    seedSession(demoAdmin);
    renderGuard("customer");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/admin"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });
});
