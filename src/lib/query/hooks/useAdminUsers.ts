import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { MOCK_USERS } from "@/data/mock/admin";
import type { User } from "@/types";

/**
 * Loads all registered customers for the admin dashboard.
 * Real endpoint: `return apiGet<User[]>(endpoints.admin.users);`
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async (): Promise<User[]> => MOCK_USERS,
  });
}
