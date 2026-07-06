import { render, screen, fireEvent } from "@testing-library/react";
import { NavUserMenu } from "./NavUserMenu";
import { demoCustomer } from "@/test-utils/authTestUtils";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

const mockUseAuth = jest.fn();
const mockLogout = jest.fn();
jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("NavUserMenu", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogout.mockClear();
    mockUseAuth.mockReturnValue({ user: demoCustomer, logout: mockLogout });
  });

  it("renders nothing when signed out", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
    const { container } = render(<NavUserMenu scrolled={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the menu and deep-links to Profile and Orders", () => {
    render(<NavUserMenu scrolled />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Profile"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard?view=profile");

    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Orders"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard?view=order-history");
  });

  it("logs out and returns home", () => {
    render(<NavUserMenu scrolled={false} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
