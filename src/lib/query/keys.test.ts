import { queryKeys } from "./keys";

describe("queryKeys", () => {
  it("namespaces admin keys under 'admin'", () => {
    expect(queryKeys.adminOrders[0]).toBe("admin");
    expect(queryKeys.adminQueries[0]).toBe("admin");
    expect(queryKeys.adminUsers[0]).toBe("admin");
  });

  it("keeps every key array unique", () => {
    const serialised = Object.values(queryKeys).map((k) => JSON.stringify(k));
    expect(new Set(serialised).size).toBe(serialised.length);
  });
});
