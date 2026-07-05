import { MOCK_QUERIES, MOCK_ORDERS, MOCK_USERS, CHART_DATA } from "./admin";

describe("admin mock data", () => {
  it("has unique query ids", () => {
    const ids = MOCK_QUERIES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique order ids and positive quantities", () => {
    const ids = MOCK_ORDERS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const o of MOCK_ORDERS) expect(o.qty).toBeGreaterThan(0);
  });

  it("labels every user active or inactive", () => {
    for (const u of MOCK_USERS) {
      expect(["active", "inactive"]).toContain(u.status);
    }
  });

  it("provides monthly chart points with orders and queries", () => {
    expect(CHART_DATA.length).toBeGreaterThan(0);
    for (const point of CHART_DATA) {
      expect(point.orders).toBeGreaterThanOrEqual(0);
      expect(point.queries).toBeGreaterThanOrEqual(0);
    }
  });
});
