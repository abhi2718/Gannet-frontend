import { render, screen } from "@testing-library/react";
import { BrandLockup } from "./BrandLockup";

describe("BrandLockup", () => {
  it("renders the company name, wordmark, and tagline", () => {
    render(<BrandLockup />);
    expect(screen.getByText("Atul Vitrified Company")).toBeInTheDocument();
    expect(screen.getByText("GANNET")).toBeInTheDocument();
    expect(screen.getByText("PURE · REFRESHING · NATURAL")).toBeInTheDocument();
  });

  it("applies the requested colors", () => {
    render(<BrandLockup wordmarkColor="#0D6EFD" />);
    expect(screen.getByText("GANNET")).toHaveStyle({ color: "#0D6EFD" });
  });
});
