import type { AuthUser } from "@/features/user/auth/AuthContext";

const SESSION_KEY = "gannet.auth.session";

/** Seed an authenticated session so `AuthProvider` resolves to this user. */
export function seedSession(user: AuthUser): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export const demoCustomer: AuthUser = {
  id: "seed-customer",
  username: "Arjun Mehta",
  email: "arjun.m@gmail.com",
  phone: "9876543210",
  role: "customer",
};

export const demoAdmin: AuthUser = {
  id: "seed-admin",
  username: "Admin",
  email: "admin@gannet.com",
  phone: "9999999999",
  role: "admin",
};
