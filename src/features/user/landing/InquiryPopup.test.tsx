import { render, screen, fireEvent } from "@testing-library/react";
import { InquiryPopup } from "./InquiryPopup";

describe("InquiryPopup", () => {
  it("renders the inquiry form", () => {
    render(<InquiryPopup onClose={jest.fn()} />);
    expect(screen.getByText("Need Fresh Natural Drinking Water?")).toBeInTheDocument();
  });

  it("shows a success state after submitting", () => {
    render(<InquiryPopup onClose={jest.fn()} />);
    fireEvent.click(screen.getByText(/Submit Inquiry/));
    expect(screen.getByText("Inquiry Received!")).toBeInTheDocument();
  });

  it("closes from the Maybe Later button", () => {
    const onClose = jest.fn();
    render(<InquiryPopup onClose={onClose} />);
    fireEvent.click(screen.getByText("Maybe Later"));
    expect(onClose).toHaveBeenCalled();
  });
});
