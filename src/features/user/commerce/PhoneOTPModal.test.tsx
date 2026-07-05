import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneOTPModal } from "./PhoneOTPModal";

// The OTP entry + verification logic is covered by the useOtpInput and OtpBoxes
// unit tests. Here we cover the modal's own behaviour that does not depend on the
// AnimatePresence step transition (which does not settle in jsdom).
describe("PhoneOTPModal", () => {
  it("renders the phone entry step", () => {
    render(<PhoneOTPModal onClose={jest.fn()} onSuccess={jest.fn()} />);
    expect(screen.getByText("Enter Mobile Number")).toBeInTheDocument();
  });

  it("validates the phone number before sending an OTP", () => {
    render(<PhoneOTPModal onClose={jest.fn()} onSuccess={jest.fn()} />);
    fireEvent.click(screen.getByText("Send OTP"));
    expect(screen.getByText(/valid 10-digit mobile number/)).toBeInTheDocument();
  });

  it("only keeps digits in the phone field", () => {
    render(<PhoneOTPModal onClose={jest.fn()} onSuccess={jest.fn()} />);
    const input = screen.getByPlaceholderText("XXXXX XXXXX") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "99a88b7776" } });
    expect(input.value).toBe("99887776");
  });

  it("closes from the close button", () => {
    const onClose = jest.fn();
    render(<PhoneOTPModal onClose={onClose} onSuccess={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
