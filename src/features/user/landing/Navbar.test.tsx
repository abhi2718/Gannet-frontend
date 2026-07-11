import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";
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

function guest() {
  mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
}
function signedIn() {
  mockUseAuth.mockReturnValue({ user: demoCustomer, logout: mockLogout });
}

const baseProps = {
  scrolled: false,
  onBook: jest.fn(),
  onLogin: jest.fn(),
  cartCount: 0,
  onCartOpen: jest.fn(),
};

describe("Navbar", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogout.mockClear();
    guest();
  });

  it("shows the brand and navigation items", () => {
    render(<Navbar {...baseProps} />);
    expect(screen.getByText("GANNET")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("shows Login (and fires it) for a guest, plus the cart", () => {
    const onLogin = jest.fn();
    const onCartOpen = jest.fn();
    render(<Navbar {...baseProps} onLogin={onLogin} onCartOpen={onCartOpen} />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByLabelText("Open cart"));
    expect(onLogin).toHaveBeenCalled();
    expect(onCartOpen).toHaveBeenCalled();
  });

  it("renders the cart count badge when items are present", () => {
    render(<Navbar {...baseProps} cartCount={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("caps the badge at 9+", () => {
    render(<Navbar {...baseProps} cartCount={42} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("hides Login and shows the account menu when signed in", () => {
    signedIn();
    render(<Navbar {...baseProps} />);
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Account menu")).toBeInTheDocument();
  });

  it("shows Dashboard in the mobile menu and navigates to it", () => {
    signedIn();
    render(<Navbar {...baseProps} />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("navigates to the profile view from the account menu", () => {
    signedIn();
    render(<Navbar {...baseProps} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Profile"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard?view=profile");
  });
});
