import { toUser, type ApiUser } from "./useAdminUsers";
import { toAdminOrder, formatAddress, type ApiOrder } from "./useAdminOrders";
import { toChartPoints, type ApiMonthlyTrends } from "./useAdminChart";

describe("toUser", () => {
  it("maps an API user (with order count + cities) to the dashboard shape", () => {
    const api: ApiUser = {
      _id: "u1",
      username: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "+12025550123",
      status: "active",
      createdAt: "2026-01-15T09:00:00.000Z",
      orderCount: 4,
      cities: ["Mumbai", "Delhi"],
    };
    expect(toUser(api)).toEqual({
      id: "u1",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+12025550123",
      city: "Mumbai, Delhi",
      joined: "2026-01-15",
      orders: 4,
      status: "active",
    });
  });

  it("defaults missing order count / cities gracefully", () => {
    const api: ApiUser = {
      id: "u2",
      username: "No Orders",
      email: "n@example.com",
      phoneNumber: "123",
      status: "inactive",
    };
    const user = toUser(api);
    expect(user.orders).toBe(0);
    expect(user.city).toBe("");
    expect(user.joined).toBe("");
  });
});

describe("formatAddress", () => {
  it("flattens a populated address object", () => {
    expect(
      formatAddress({
        street: "221B Baker Street",
        city: "London",
        state: "Greater London",
        pinCode: "110011",
      }),
    ).toBe("221B Baker Street, London, Greater London, 110011");
  });

  it("passes a plain string through and handles null", () => {
    expect(formatAddress("45 MG Road")).toBe("45 MG Road");
    expect(formatAddress(null)).toBe("");
  });
});

describe("toAdminOrder", () => {
  it("maps an API order and hyphenates its status", () => {
    const api: ApiOrder = {
      _id: "o1",
      orderId: "ORD-9001",
      customerName: "Priya Sharma",
      customerPhone: "+919784532100",
      bottleSize: "500 ml",
      quantity: 24,
      amount: 1200,
      status: "out for delivery",
      createdAt: "2026-02-01T10:00:00.000Z",
      address: { street: "45 MG Road", city: "Delhi", state: "Delhi", pinCode: "110001" },
    };
    expect(toAdminOrder(api)).toEqual({
      id: "ORD-9001",
      customer: "Priya Sharma",
      phone: "+919784532100",
      address: "45 MG Road, Delhi, Delhi, 110001",
      size: "500 ml",
      qty: 24,
      date: "2026-02-01",
      status: "out-for-delivery",
    });
  });
});

describe("toChartPoints", () => {
  it("aligns month numbers to short names with zero-filled series", () => {
    const trends: ApiMonthlyTrends = {
      year: 2026,
      months: [1, 2, 3],
      bookings: [5, 0, 8],
      queries: [2, 4, 0],
    };
    expect(toChartPoints(trends)).toEqual([
      { month: "Jan", orders: 5, queries: 2 },
      { month: "Feb", orders: 0, queries: 4 },
      { month: "Mar", orders: 8, queries: 0 },
    ]);
  });
});
