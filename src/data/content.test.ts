import { NAV, SLIDES, FEATURES, STEPS, TESTIMONIALS } from "./content";

describe("content data", () => {
  it("provides navigation entries", () => {
    expect(NAV).toContain("Home");
    expect(NAV).toContain("Contact");
  });

  it("provides at least one hero slide with required copy", () => {
    expect(SLIDES.length).toBeGreaterThan(0);
    for (const s of SLIDES) {
      expect(s.h1).toBeTruthy();
      expect(s.bg).toMatch(/^https?:\/\//);
    }
  });

  it("provides eight feature tiles each with an icon", () => {
    expect(FEATURES).toHaveLength(8);
    for (const f of FEATURES) {
      expect(f.icon).toBeTruthy();
    }
  });

  it("provides four how-it-works steps", () => {
    expect(STEPS).toHaveLength(4);
  });

  it("rates every testimonial between 1 and 5", () => {
    for (const t of TESTIMONIALS) {
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
    }
  });
});
