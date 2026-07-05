import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OtpBoxes } from "./OtpBoxes";

function makeRefs() {
  const ref = createRef<(HTMLInputElement | null)[]>();
  // @ts-expect-error - initialising the mutable ref for the test
  ref.current = [null, null, null, null, null, null];
  return ref as React.MutableRefObject<(HTMLInputElement | null)[]>;
}

describe("OtpBoxes", () => {
  it("renders six inputs reflecting the otp values", () => {
    render(
      <OtpBoxes
        otp={["1", "2", "", "", "", ""]}
        refs={makeRefs()}
        onChange={() => {}}
        onKeyDown={() => {}}
      />,
    );
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    expect((inputs[0] as HTMLInputElement).value).toBe("1");
  });

  it("calls onChange with the box index and value", () => {
    const onChange = jest.fn();
    render(
      <OtpBoxes
        otp={["", "", "", "", "", ""]}
        refs={makeRefs()}
        onChange={onChange}
        onKeyDown={() => {}}
      />,
    );
    fireEvent.change(screen.getAllByRole("textbox")[2], { target: { value: "5" } });
    expect(onChange).toHaveBeenCalledWith(2, "5");
  });
});
