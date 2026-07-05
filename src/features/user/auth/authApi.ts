import { apiGet, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthUser, RegisterInput, Role } from "./AuthContext";

/** The user object as returned by the API (`/api/auth/*`, `/api/users`). */
export type ApiUser = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  userType: Role;
  status?: string;
};

type AuthPayload = { user: ApiUser; token: string };

/** Map the API user shape onto the app's `AuthUser`. */
export function toAuthUser(u: ApiUser): AuthUser {
  return {
    id: u._id ?? u.id ?? "",
    username: u.username,
    email: u.email,
    phone: u.phoneNumber,
    role: u.userType,
  };
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  const data = await apiPost<AuthPayload>(endpoints.auth.login, { email, password });
  return { user: toAuthUser(data.user), token: data.token };
}

export async function register(input: RegisterInput): Promise<{ user: AuthUser; token: string }> {
  const data = await apiPost<AuthPayload>(endpoints.auth.register, {
    username: input.username,
    email: input.email,
    password: input.password,
    phoneNumber: input.phone,
  });
  return { user: toAuthUser(data.user), token: data.token };
}

export async function me(): Promise<AuthUser> {
  const data = await apiGet<{ user: ApiUser }>(endpoints.auth.me);
  return toAuthUser(data.user);
}
