import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, type Role } from "./AuthContext";
import { RequireAuth } from "./RequireAuth";
import { setToken } from "@/lib/api/token";
import { demoCustomer, demoAdmin } from "@/test-utils/authTestUtils";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock("./authApi");
import * as authApi from "./authApi";
const mockedAuthApi = jest.mocked(authApi);

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
    jest.clearAllMocks();
  });

  it("redirects an unauthenticated visitor to /login", async () => {
    renderGuard("customer");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children when the role matches", async () => {
    setToken("t");
    mockedAuthApi.me.mockResolvedValue(demoCustomer);
    renderGuard("customer");
    expect(await screen.findByText("protected content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("sends a customer away from an admin-only route", async () => {
    setToken("t");
    mockedAuthApi.me.mockResolvedValue(demoCustomer);
    renderGuard("admin");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("sends an admin away from a customer-only route", async () => {
    setToken("t");
    mockedAuthApi.me.mockResolvedValue(demoAdmin);
    renderGuard("customer");
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/admin"));
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });
});
