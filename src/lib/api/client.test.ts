import { apiGet, apiPost, apiGetPaged, ApiError } from "./client";
import { setToken, clearToken } from "./token";

function mockFetch(body: unknown, ok = true, status = 200) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe("api client", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    clearToken();
    jest.restoreAllMocks();
  });

  it("unwraps the data envelope on GET", async () => {
    mockFetch({ success: true, data: { id: "1" } });
    await expect(apiGet("/things")).resolves.toEqual({ id: "1" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/things"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("serialises the body on POST", async () => {
    mockFetch({ success: true, data: null });
    await apiPost("/things", { a: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/things"),
      expect.objectContaining({ method: "POST", body: JSON.stringify({ a: 1 }) }),
    );
  });

  it("attaches the Bearer token when one is stored", async () => {
    setToken("jwt-123");
    mockFetch({ success: true, data: null });
    await apiGet("/secure");
    const init = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(init.headers.Authorization).toBe("Bearer jwt-123");
  });

  it("throws an ApiError carrying the API message on failure", async () => {
    mockFetch({ success: false, message: "Invalid email or password" }, false, 401);
    await expect(apiGet("/boom")).rejects.toThrow("Invalid email or password");
  });

  it("returns rows and pagination for a paged GET", async () => {
    mockFetch({
      success: true,
      count: 2,
      data: [1, 2],
      pagination: {
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
    const res = await apiGetPaged<number>("/list");
    expect(res.data).toEqual([1, 2]);
    expect(res.pagination?.total).toBe(2);
    expect(res.count).toBe(2);
  });

  it("exposes the HTTP status on the thrown ApiError", async () => {
    mockFetch({ success: false, message: "Not Found" }, false, 404);
    await expect(apiGet("/missing")).rejects.toMatchObject({ status: 404 });
    await expect(apiGet("/missing")).rejects.toBeInstanceOf(ApiError);
  });
});
