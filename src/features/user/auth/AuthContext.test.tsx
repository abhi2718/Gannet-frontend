import { render, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth, type AuthContextValue, type AuthResult } from "./AuthContext";
import { ApiError } from "@/lib/api/client";
import { setToken, getToken } from "@/lib/api/token";
import { demoAdmin, demoCustomer } from "@/test-utils/authTestUtils";

jest.mock("./authApi");
import * as authApi from "./authApi";
const mockedAuthApi = jest.mocked(authApi);

/** Render the provider and expose its live context value to the test. */
function setup() {
  let ctx = {} as AuthContextValue;
  function Capture() {
    ctx = useAuth();
    return null;
  }
  render(
    <AuthProvider>
      <Capture />
    </AuthProvider>,
  );
  return () => ctx;
}

describe("AuthContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("is unauthenticated without a stored token", async () => {
    const get = setup();
    await waitFor(() => expect(get().status).toBe("unauthenticated"));
    expect(get().user).toBeNull();
    expect(mockedAuthApi.me).not.toHaveBeenCalled();
  });

  it("restores the session from a stored token via /auth/me", async () => {
    setToken("jwt");
    mockedAuthApi.me.mockResolvedValue(demoAdmin);
    const get = setup();
    await waitFor(() => expect(get().status).toBe("authenticated"));
    expect(get().user?.role).toBe("admin");
  });

  it("clears a stale token when /auth/me fails", async () => {
    setToken("stale");
    mockedAuthApi.me.mockRejectedValue(new ApiError("User for this token no longer exists", 401));
    const get = setup();
    await waitFor(() => expect(get().status).toBe("unauthenticated"));
    expect(getToken()).toBeNull();
  });

  it("logs in, stores the token and exposes the user", async () => {
    mockedAuthApi.login.mockResolvedValue({ user: demoCustomer, token: "jwt-abc" });
    const get = setup();
    await waitFor(() => expect(get().status).toBe("unauthenticated"));
    let result: AuthResult | undefined;
    await act(async () => {
      result = await get().login("arjun.m@gmail.com", "secret123");
    });
    expect(result).toEqual({ ok: true, user: demoCustomer });
    expect(getToken()).toBe("jwt-abc");
    expect(get().user?.email).toBe("arjun.m@gmail.com");
  });

  it("returns the API error message on a failed login", async () => {
    mockedAuthApi.login.mockRejectedValue(new ApiError("Invalid email or password", 401));
    const get = setup();
    await waitFor(() => expect(get().status).toBe("unauthenticated"));
    let result: AuthResult | undefined;
    await act(async () => {
      result = await get().login("x@y.com", "nope123");
    });
    expect(result).toEqual({ ok: false, error: "Invalid email or password" });
    expect(get().status).toBe("unauthenticated");
  });

  it("registers and authenticates the new user", async () => {
    mockedAuthApi.register.mockResolvedValue({ user: demoCustomer, token: "jwt-reg" });
    const get = setup();
    await waitFor(() => expect(get().status).toBe("unauthenticated"));
    await act(async () => {
      await get().register({
        username: "Arjun Mehta",
        email: "arjun.m@gmail.com",
        password: "secret123",
        phone: "9876543210",
      });
    });
    expect(get().status).toBe("authenticated");
    expect(getToken()).toBe("jwt-reg");
  });

  it("merges profile changes into the signed-in user via updateUser", async () => {
    mockedAuthApi.login.mockResolvedValue({ user: demoCustomer, token: "jwt" });
    const get = setup();
    await act(async () => {
      await get().login("a@b.com", "secret123");
    });
    act(() => {
      get().updateUser({ username: "New Name", phone: "111" });
    });
    expect(get().user?.username).toBe("New Name");
    expect(get().user?.phone).toBe("111");
    // Unchanged fields (e.g. email) are preserved.
    expect(get().user?.email).toBe(demoCustomer.email);
  });

  it("logs out and clears the token", async () => {
    mockedAuthApi.login.mockResolvedValue({ user: demoCustomer, token: "jwt" });
    const get = setup();
    await act(async () => {
      await get().login("a@b.com", "secret123");
    });
    act(() => {
      get().logout();
    });
    expect(get().status).toBe("unauthenticated");
    expect(get().user).toBeNull();
    expect(getToken()).toBeNull();
  });
});
