import { USER_ORDERS, TRACK_STEPS, statusToStep, ORDERS_PER_PAGE } from "./user";

describe("user mock data", () => {
  it("maps every order status to a track step", () => {
    for (const o of USER_ORDERS) {
      expect(statusToStep[o.status]).toBeDefined();
    }
  });

  it("defines four tracking steps", () => {
    expect(TRACK_STEPS).toHaveLength(4);
  });

  it("cancelled maps to -1 and delivered to the final step", () => {
    expect(statusToStep.cancelled).toBe(-1);
    expect(statusToStep.delivered).toBe(TRACK_STEPS.length - 1);
  });

  it("paginates in positive page sizes", () => {
    expect(ORDERS_PER_PAGE).toBeGreaterThan(0);
  });
});
