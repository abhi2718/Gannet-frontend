import {
  loadCart,
  saveCart,
  loadPendingCheckout,
  savePendingCheckout,
} from "./cartStorage";
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

describe("pending checkout storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("returns null when no checkout is pending", () => {
    expect(loadPendingCheckout()).toBeNull();
  });

  it("round-trips a pending checkout", () => {
    savePendingCheckout([item]);
    expect(loadPendingCheckout()).toEqual([item]);
  });

  it("clears the pending checkout when saved with null or an empty list", () => {
    savePendingCheckout([item]);
    savePendingCheckout(null);
    expect(loadPendingCheckout()).toBeNull();
    savePendingCheckout([item]);
    savePendingCheckout([]);
    expect(loadPendingCheckout()).toBeNull();
  });

  it("ignores a corrupt or non-array pending value", () => {
    window.localStorage.setItem("gannet.pendingCheckout", "{bad");
    expect(loadPendingCheckout()).toBeNull();
    window.localStorage.setItem("gannet.pendingCheckout", JSON.stringify([{ size: "x" }]));
    expect(loadPendingCheckout()).toBeNull();
  });
});
