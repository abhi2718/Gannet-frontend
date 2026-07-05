import { render, screen, fireEvent } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

describe("ContactSection", () => {
  it("renders the contact details", () => {
    render(<ContactSection />);
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("hello@gannetwater.com")).toBeInTheDocument();
  });

  it("shows a confirmation after submitting the form", () => {
    render(<ContactSection />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "Test User" },
    });
    fireEvent.click(screen.getByText(/Send Message/));
    expect(screen.getByText(/Message Sent!/)).toBeInTheDocument();
  });
});
