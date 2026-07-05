"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken } from "@/lib/api/token";
import { ApiError } from "@/lib/api/client";
import * as authApi from "./authApi";

/** The two access levels in the app. Drives route protection. */
export type Role = "customer" | "admin";

/** The authenticated user as exposed to the app. */
export type AuthUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: Role;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  phone: string;
};

export type AuthResult = { ok: true; user: AuthUser } | { ok: false; error: string };

/** `loading` until the token has been validated, so guards don't flash a redirect. */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Access the current auth state and actions. Must be inside an `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "Unable to reach the server. Please try again.";
}

/**
 * Authentication backed by the Gannet REST API. The JWT is stored via the token
 * helper; on mount an existing token is validated against `/auth/me` so the
 * session is restored (and a stale token cleared).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!getToken()) {
      setStatus("unauthenticated");
      return;
    }
    let active = true;
    authApi
      .me()
      .then((u) => {
        if (!active) return;
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!active) return;
        clearToken();
        setUser(null);
        setStatus("unauthenticated");
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { user: u, token } = await authApi.login(email, password);
      setToken(token);
      setUser(u);
      setStatus("authenticated");
      return { ok: true, user: u };
    } catch (e) {
      return { ok: false, error: errorMessage(e) };
    }
  }, []);

  const register = useCallback(async (input: RegisterInput): Promise<AuthResult> => {
    try {
      const { user: u, token } = await authApi.register(input);
      setToken(token);
      setUser(u);
      setStatus("authenticated");
      return { ok: true, user: u };
    } catch (e) {
      return { ok: false, error: errorMessage(e) };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
