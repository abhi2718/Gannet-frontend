import { render, screen, fireEvent } from "@testing-library/react";
import { FeaturesSection } from "./FeaturesSection";
import { BookingSection } from "./BookingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { Footer } from "./Footer";

describe("FeaturesSection", () => {
  it("renders the feature grid", () => {
    render(<FeaturesSection />);
    expect(screen.getByText("Naturally Sourced")).toBeInTheDocument();
    expect(screen.getByText("Fast Home Delivery")).toBeInTheDocument();
  });
});

describe("BookingSection", () => {
  it("fires onBook from the CTA", () => {
    const onBook = jest.fn();
    render(<BookingSection onBook={onBook} />);
    fireEvent.click(screen.getByText(/Start Booking Now/));
    expect(onBook).toHaveBeenCalled();
  });
});

describe("TestimonialsSection", () => {
  it("renders the first testimonial", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Loved by Thousands")).toBeInTheDocument();
    expect(screen.getAllByText("Arjun Mehta").length).toBeGreaterThan(0);
  });
});

describe("Footer", () => {
  it("fires onLogin from the admin login link", () => {
    const onLogin = jest.fn();
    render(<Footer onLogin={onLogin} />);
    fireEvent.click(screen.getByText("Admin Login"));
    expect(onLogin).toHaveBeenCalled();
  });
});
