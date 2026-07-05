"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** The two access levels in the app. Drives route protection. */
export type Role = "customer" | "admin";

/** The authenticated user as exposed to the app (never includes the password). */
export type AuthUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: Role;
};

/** How an account is persisted in the mock store (includes the password). */
type StoredAccount = AuthUser & { password: string };

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  phone: string;
};

export type AuthResult = { ok: true; user: AuthUser } | { ok: false; error: string };

/** `loading` until the browser store is read, so guards don't flash a redirect. */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  logout: () => void;
};

const ACCOUNTS_KEY = "gannet.auth.accounts";
const SESSION_KEY = "gannet.auth.session";

/**
 * Demo accounts seeded on first load so both roles can be exercised without a
 * backend. `admin@gannet.com` unlocks the admin dashboard; the customer account
 * mirrors the identity used across the customer dashboard mock data.
 */
const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: "seed-admin",
    username: "Admin",
    email: "admin@gannet.com",
    phone: "9999999999",
    role: "admin",
    password: "admin123",
  },
  {
    id: "seed-customer",
    username: "Arjun Mehta",
    email: "arjun.m@gmail.com",
    phone: "9876543210",
    role: "customer",
    password: "customer123",
  },
];

/** Project a stored account down to the fields safe to expose to the app. */
function stripPassword(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    phone: account.phone,
    role: account.role,
  };
}

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return SEED_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
      return SEED_ACCOUNTS;
    }
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return SEED_ACCOUNTS;
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* storage unavailable — the mock store is best-effort */
  }
}

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Access the current auth state and actions. Must be inside an `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * Client-side mock authentication. Persists registered accounts and the active
 * session in `localStorage`.
 *
 * NOTE: this is a front-end-only stand-in — passwords are kept in plain text and
 * there is no server verification. Replace with a real backend (e.g. an
 * httpOnly-cookie session) before shipping to production.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    readAccounts(); // seed the store on first run
    const session = readSession();
    setUser(session);
    setStatus(session ? "authenticated" : "unauthenticated");
  }, []);

  const login = useCallback((email: string, password: string): AuthResult => {
    const normalized = email.trim().toLowerCase();
    const account = readAccounts().find((a) => a.email.toLowerCase() === normalized);
    if (!account || account.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }
    const safeUser = stripPassword(account);
    writeSession(safeUser);
    setUser(safeUser);
    setStatus("authenticated");
    return { ok: true, user: safeUser };
  }, []);

  const register = useCallback((input: RegisterInput): AuthResult => {
    const accounts = readAccounts();
    const normalized = input.email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === normalized)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const account: StoredAccount = {
      id: `user-${Date.now()}`,
      username: input.username.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      role: "customer", // self-service sign-ups are always customers
      password: input.password,
    };
    writeAccounts([...accounts, account]);
    const safeUser = stripPassword(account);
    writeSession(safeUser);
    setUser(safeUser);
    setStatus("authenticated");
    return { ok: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
