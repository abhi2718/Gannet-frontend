import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./LoginPage";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("LoginPage", () => {
  beforeEach(() => mockPush.mockClear());

  it("defaults to the customer welcome heading", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome to GANNET")).toBeInTheDocument();
  });

  it("switches copy when the admin role is selected", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Admin"));
    expect(screen.getByText("Admin Sign In")).toBeInTheDocument();
  });

  it("validates the mobile number", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/Send OTP/));
    expect(screen.getByText(/valid 10-digit mobile number/)).toBeInTheDocument();
  });
});
