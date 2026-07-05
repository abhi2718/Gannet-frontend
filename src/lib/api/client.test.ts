import { apiGet, apiPost } from "./client";

describe("api client", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("performs a GET and returns parsed JSON", async () => {
    const json = { ok: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => json,
    }) as unknown as typeof fetch;

    await expect(apiGet("/things")).resolves.toEqual(json);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/things"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("serialises the body on POST", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await apiPost("/things", { a: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/things"),
      expect.objectContaining({ method: "POST", body: JSON.stringify({ a: 1 }) }),
    );
  });

  it("throws on a non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    }) as unknown as typeof fetch;

    await expect(apiGet("/boom")).rejects.toThrow(/500/);
  });
});
