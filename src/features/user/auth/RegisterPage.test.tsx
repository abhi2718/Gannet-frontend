import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { RegisterPage } from "./RegisterPage";
import { ApiError } from "@/lib/api/client";
import { demoCustomer } from "@/test-utils/authTestUtils";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

jest.mock("./authApi");
import * as authApi from "./authApi";
const mockedAuthApi = jest.mocked(authApi);

function renderRegister() {
  return render(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>,
  );
}

const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const submitForm = () =>
  fireEvent.submit(screen.getByRole("button", { name: /Create Account/ }).closest("form")!);

function fillValidForm() {
  fill("Full Name", "New User");
  fill("Phone Number", "9876543210");
  fill("Email", "new@user.com");
  fill("Password", "secret1");
  fill("Confirm Password", "secret1");
}

describe("RegisterPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockReplace.mockClear();
    jest.clearAllMocks();
  });

  it("renders every sign-up field", () => {
    renderRegister();
    for (const label of ["Full Name", "Phone Number", "Email", "Password", "Confirm Password"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("rejects a short phone number before calling the API", () => {
    renderRegister();
    fillValidForm();
    fill("Phone Number", "12345");
    submitForm();
    expect(screen.getByText("Enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(mockedAuthApi.register).not.toHaveBeenCalled();
  });

  it("flags mismatched passwords before calling the API", () => {
    renderRegister();
    fillValidForm();
    fill("Confirm Password", "secret2");
    submitForm();
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(mockedAuthApi.register).not.toHaveBeenCalled();
  });

  it("surfaces the API error for an already-registered email", async () => {
    mockedAuthApi.register.mockRejectedValue(new ApiError("Email is already registered", 409));
    renderRegister();
    fillValidForm();
    submitForm();
    await waitFor(() =>
      expect(screen.getByText("Email is already registered")).toBeInTheDocument(),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("registers and routes to the dashboard", async () => {
    mockedAuthApi.register.mockResolvedValue({ user: demoCustomer, token: "t" });
    renderRegister();
    fillValidForm();
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(mockedAuthApi.register).toHaveBeenCalledWith(
      expect.objectContaining({ username: "New User", phone: "9876543210", email: "new@user.com" }),
    );
  });
});
