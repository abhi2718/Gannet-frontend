import { render, screen, fireEvent } from "@testing-library/react";
import { LoginBrandingPanel } from "./LoginBrandingPanel";

describe("LoginBrandingPanel", () => {
  it("fires onBack from the back link", () => {
    const onBack = jest.fn();
    render(<LoginBrandingPanel onBack={onBack} />);
    fireEvent.click(screen.getByText(/Back to site/));
    expect(onBack).toHaveBeenCalled();
  });
});
