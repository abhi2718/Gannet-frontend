import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { LoginPage } from "./LoginPage";
import { ApiError } from "@/lib/api/client";
import { demoAdmin, demoCustomer } from "@/test-utils/authTestUtils";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock("./authApi");
import * as authApi from "./authApi";
const mockedAuthApi = jest.mocked(authApi);

function renderLogin() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  );
}

const submitForm = () =>
  fireEvent.submit(screen.getByRole("button", { name: /Sign In/ }).closest("form")!);

describe("LoginPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockReplace.mockClear();
    jest.clearAllMocks();
  });

  it("renders the email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("validates the email format before calling the API", () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "whatever" } });
    submitForm();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(mockedAuthApi.login).not.toHaveBeenCalled();
  });

  it("shows the API error for invalid credentials", async () => {
    mockedAuthApi.login.mockRejectedValue(new ApiError("Invalid email or password", 401));
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gannet.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong1" } });
    submitForm();
    await waitFor(() => expect(screen.getByText("Invalid email or password")).toBeInTheDocument());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("routes an admin to /admin", async () => {
    mockedAuthApi.login.mockResolvedValue({ user: demoAdmin, token: "t" });
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gannet.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } });
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/admin"));
  });

  it("routes a customer to /dashboard", async () => {
    mockedAuthApi.login.mockResolvedValue({ user: demoCustomer, token: "t" });
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "arjun.m@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "customer123" } });
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
  });
});
