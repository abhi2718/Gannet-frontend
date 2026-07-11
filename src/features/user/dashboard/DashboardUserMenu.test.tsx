import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardUserMenu } from "./DashboardUserMenu";
import { demoCustomer } from "@/test-utils/authTestUtils";

jest.mock("@/features/user/auth/AuthContext", () => ({
  useAuth: () => ({ user: demoCustomer }),
}));

describe("DashboardUserMenu", () => {
  it("navigates to a view from the dropdown", () => {
    const onNavigate = jest.fn();
    render(<DashboardUserMenu onHome={jest.fn()} onNavigate={onNavigate} onLogout={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Profile"));
    expect(onNavigate).toHaveBeenCalledWith("profile");
  });

  it("navigates to the dashboard home view from the Dashboard item", () => {
    const onNavigate = jest.fn();
    render(<DashboardUserMenu onHome={jest.fn()} onNavigate={onNavigate} onLogout={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Dashboard"));
    expect(onNavigate).toHaveBeenCalledWith("home");
  });

  it("goes home from the Home item", () => {
    const onHome = jest.fn();
    render(<DashboardUserMenu onHome={onHome} onNavigate={jest.fn()} onLogout={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Home"));
    expect(onHome).toHaveBeenCalled();
  });

  it("fires onLogout from the dropdown", () => {
    const onLogout = jest.fn();
    render(<DashboardUserMenu onHome={jest.fn()} onNavigate={jest.fn()} onLogout={onLogout} />);
    fireEvent.click(screen.getByLabelText("Account menu"));
    fireEvent.click(screen.getByText("Logout"));
    expect(onLogout).toHaveBeenCalled();
  });
});
