import type { AuthUser } from "@/features/user/auth/AuthContext";

/** Sample authenticated users for tests that mock the auth layer. */
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
