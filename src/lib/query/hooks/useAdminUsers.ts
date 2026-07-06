import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { MOCK_USERS } from "@/data/mock/admin";
import type { User } from "@/types";

/**
 * User row as returned by the `GET /api/users` aggregation: the base user plus
 * `orderCount` (from Orders) and `cities` (distinct, from Addresses).
 */
export type ApiUser = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt?: string;
  orderCount?: number;
  cities?: string[];
};

export function toUser(u: ApiUser): User {
  return {
    id: u._id ?? u.id ?? "",
    name: u.username,
    email: u.email,
    phone: u.phoneNumber,
    city: u.cities?.filter(Boolean).join(", ") ?? "",
    joined: u.createdAt ? u.createdAt.slice(0, 10) : "",
    orders: u.orderCount ?? 0,
    status: u.status,
  };
}

/**
 * Loads all registered users for the admin dashboard (`GET /api/users`), each
 * with their order count, cities, join date and status. Falls back to mock data
 * if the request fails, so the dashboard still renders during local development
 * without the API.
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async (): Promise<User[]> => {
      try {
        const { data } = await apiGetPaged<ApiUser>(`${endpoints.users}?limit=100`);
        return data.map(toUser);
      } catch {
        return MOCK_USERS;
      }
    },
  });
}
