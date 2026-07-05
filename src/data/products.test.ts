import { PRODUCTS, BOTTLE_PRICES } from "./products";

describe("products data", () => {
  it("exposes four bottle sizes", () => {
    expect(PRODUCTS).toHaveLength(4);
  });

  it("has a price for every product size", () => {
    for (const p of PRODUCTS) {
      expect(BOTTLE_PRICES[p.size]).toBeGreaterThan(0);
    }
  });

  it("gives every product a label and description", () => {
    for (const p of PRODUCTS) {
      expect(p.label).toBeTruthy();
      expect(p.desc).toBeTruthy();
    }
  });
});
