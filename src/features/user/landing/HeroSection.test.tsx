import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "./HeroSection";
import { SLIDES } from "@/data/content";

describe("HeroSection", () => {
  it("renders the first slide copy", () => {
    render(<HeroSection onBook={jest.fn()} />);
    expect(screen.getByText(SLIDES[0].tag)).toBeInTheDocument();
  });

  it("fires onBook from the primary CTA", () => {
    const onBook = jest.fn();
    render(<HeroSection onBook={onBook} />);
    fireEvent.click(screen.getByText(/Book Water Now/));
    expect(onBook).toHaveBeenCalled();
  });

  it("renders a dot control per slide", () => {
    render(<HeroSection onBook={jest.fn()} />);
    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText(`Go to slide ${SLIDES.length}`)).toBeInTheDocument();
  });
});
