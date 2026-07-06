import { loadCart, saveCart } from "./cartStorage";
import type { CartItem } from "@/types";

const item: CartItem = { size: "500 ml", label: "Classic", price: 18, qty: 2 };

describe("cartStorage", () => {
  beforeEach(() => window.localStorage.clear());

  it("returns an empty cart when nothing is stored", () => {
    expect(loadCart()).toEqual([]);
  });

  it("round-trips a saved cart", () => {
    saveCart([item]);
    expect(loadCart()).toEqual([item]);
  });

  it("ignores corrupt stored JSON", () => {
    window.localStorage.setItem("gannet.cart", "{not json");
    expect(loadCart()).toEqual([]);
  });

  it("filters out malformed cart lines", () => {
    window.localStorage.setItem("gannet.cart", JSON.stringify([item, { size: "x" }, 5]));
    expect(loadCart()).toEqual([item]);
  });

  it("returns an empty cart when the stored value is not an array", () => {
    window.localStorage.setItem("gannet.cart", JSON.stringify({ size: "500 ml" }));
    expect(loadCart()).toEqual([]);
  });
});
