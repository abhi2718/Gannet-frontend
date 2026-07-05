import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { LoginPage } from "./LoginPage";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

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
  });

  it("renders the email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("validates the email format", () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "whatever" } });
    submitForm();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects invalid credentials", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gannet.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    submitForm();
    await waitFor(() => expect(screen.getByText("Invalid email or password.")).toBeInTheDocument());
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("signs in the admin and routes to /admin", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@gannet.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } });
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/admin"));
  });

  it("signs in the customer and routes to /dashboard", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "arjun.m@gmail.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "customer123" } });
    submitForm();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
  });
});
