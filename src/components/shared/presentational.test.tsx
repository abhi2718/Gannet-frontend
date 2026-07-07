import { render, screen } from "@testing-library/react";
import { FadeIn } from "./FadeIn";
import { WaterBottle } from "./WaterBottle";
import { HeroBottle } from "./HeroBottle";
import { SlideScene } from "./SlideScene";
import { FloatingDroplets } from "./FloatingDroplets";
import { GannetBirdIcon } from "./GannetBirdIcon";

describe("presentational shared components", () => {
  it("FadeIn renders its children", () => {
    render(
      <FadeIn>
        <span>hydrate</span>
      </FadeIn>,
    );
    expect(screen.getByText("hydrate")).toBeInTheDocument();
  });

  it("WaterBottle renders an accessible bottle image", () => {
    render(<WaterBottle size="500 ml" />);
    expect(screen.getByAltText(/GANNET 500 ml/)).toBeInTheDocument();
  });

  it("HeroBottle renders the hero image", () => {
    render(<HeroBottle />);
    expect(screen.getByAltText(/GANNET Premium Natural Water Bottle/)).toBeInTheDocument();
  });

  it("SlideScene renders a background for each theme", () => {
    const { container: deep } = render(<SlideScene theme="deep" />);
    const { container: ocean } = render(<SlideScene theme="ocean" />);
    const { container: sky } = render(<SlideScene theme="sky" />);
    expect(deep.firstChild).toBeTruthy();
    expect(ocean.firstChild).toBeTruthy();
    expect(sky.firstChild).toBeTruthy();
  });

  it("FloatingDroplets and GannetBirdIcon render without crashing", () => {
    const { container: drops } = render(<FloatingDroplets />);
    const { container: bird } = render(<GannetBirdIcon />);
    expect(drops.querySelectorAll("div").length).toBeGreaterThan(0);
    expect(bird.querySelector("img")).toBeTruthy();
  });
});
