import { render, screen, fireEvent } from "@testing-library/react";
import { LoginRoleSelector } from "./LoginRoleSelector";
import { LoginBrandingPanel } from "./LoginBrandingPanel";

describe("LoginRoleSelector", () => {
  it("renders both roles", () => {
    render(<LoginRoleSelector role="customer" onSelect={jest.fn()} />);
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("reports the chosen role", () => {
    const onSelect = jest.fn();
    render(<LoginRoleSelector role="customer" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Admin"));
    expect(onSelect).toHaveBeenCalledWith("admin");
  });
});

describe("LoginBrandingPanel", () => {
  it("fires onBack from the back link", () => {
    const onBack = jest.fn();
    render(<LoginBrandingPanel onBack={onBack} />);
    fireEvent.click(screen.getByText(/Back to site/));
    expect(onBack).toHaveBeenCalled();
  });
});
