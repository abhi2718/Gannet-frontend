import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { MOCK_QUERIES } from "@/data/mock/admin";
import type { Query } from "@/types";

/**
 * Loads inbound sales enquiries for the admin dashboard.
 * Real endpoint: `return apiGet<Query[]>(endpoints.admin.queries);`
 */
export function useAdminQueries() {
  return useQuery({
    queryKey: queryKeys.adminQueries,
    queryFn: async (): Promise<Query[]> => MOCK_QUERIES,
  });
}
