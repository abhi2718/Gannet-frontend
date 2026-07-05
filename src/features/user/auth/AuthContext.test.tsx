import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth, type AuthContextValue, type AuthResult } from "./AuthContext";

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
  beforeEach(() => window.localStorage.clear());

  it("resolves to unauthenticated on a fresh store", () => {
    const get = setup();
    expect(get().status).toBe("unauthenticated");
    expect(get().user).toBeNull();
  });

  it("logs in the seeded admin and exposes the admin role", () => {
    const get = setup();
    let result: AuthResult | undefined;
    act(() => {
      result = get().login("admin@gannet.com", "admin123");
    });
    expect(result).toEqual({ ok: true, user: expect.objectContaining({ role: "admin" }) });
    expect(get().status).toBe("authenticated");
    expect(get().user?.role).toBe("admin");
  });

  it("matches the email case-insensitively", () => {
    const get = setup();
    let result: AuthResult | undefined;
    act(() => {
      result = get().login("ADMIN@Gannet.com", "admin123");
    });
    expect(result?.ok).toBe(true);
  });

  it("rejects a wrong password without signing in", () => {
    const get = setup();
    let result: AuthResult | undefined;
    act(() => {
      result = get().login("admin@gannet.com", "nope");
    });
    expect(result).toEqual({ ok: false, error: "Invalid email or password." });
    expect(get().status).toBe("unauthenticated");
  });

  it("registers a new customer and persists the session", () => {
    const get = setup();
    act(() => {
      get().register({
        username: "New User",
        email: "new@user.com",
        password: "secret1",
        phone: "1234509876",
      });
    });
    expect(get().user).toEqual(expect.objectContaining({ username: "New User", role: "customer" }));
    expect(window.localStorage.getItem("gannet.auth.session")).toContain("new@user.com");
  });

  it("prevents registering with an existing email", () => {
    const get = setup();
    let result: AuthResult | undefined;
    act(() => {
      result = get().register({
        username: "Dupe",
        email: "admin@gannet.com",
        password: "secret1",
        phone: "1234509876",
      });
    });
    expect(result).toEqual({ ok: false, error: "An account with this email already exists." });
  });

  it("logs out and clears the session", () => {
    const get = setup();
    act(() => {
      get().login("admin@gannet.com", "admin123");
    });
    act(() => {
      get().logout();
    });
    expect(get().status).toBe("unauthenticated");
    expect(get().user).toBeNull();
    expect(window.localStorage.getItem("gannet.auth.session")).toBeNull();
  });
});
