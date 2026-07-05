import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { RegisterPage } from "./RegisterPage";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

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
  });

  it("renders every sign-up field", () => {
    renderRegister();
    for (const label of ["Full Name", "Phone Number", "Email", "Password", "Confirm Password"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("rejects a short phone number", () => {
    renderRegister();
    fillValidForm();
    fill("Phone Number", "12345");
    submitForm();
    expect(screen.getByText("Enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("flags mismatched passwords", () => {
    renderRegister();
    fillValidForm();
    fill("Confirm Password", "secret2");
    submitForm();
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("blocks an already-registered email", () => {
    renderRegister();
    fillValidForm();
    fill("Email", "admin@gannet.com");
    submitForm();
    return waitFor(() =>
      expect(screen.getByText("An account with this email already exists.")).toBeInTheDocument(),
    );
  });

  it("creates an account and routes to the dashboard", async () => {
    renderRegister();
    fillValidForm();
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
  });
});
