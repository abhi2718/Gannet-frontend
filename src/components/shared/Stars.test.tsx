import { render } from "@testing-library/react";
import { Stars } from "./Stars";

describe("Stars", () => {
  it("renders the requested number of star icons", () => {
    const { container } = render(<Stars n={4} />);
    expect(container.querySelectorAll("svg")).toHaveLength(4);
  });

  it("renders nothing for zero", () => {
    const { container } = render(<Stars n={0} />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });
});
