import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiPatch, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

/** Fields an admin may change on a user (`PATCH /api/users/:id`). */
export type UpdateUserInput = {
  username?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
};

/** Refresh the user list plus the overview tiles that count users. */
function invalidateUsers(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: queryKeys.adminUsers });
  qc.invalidateQueries({ queryKey: queryKeys.adminSummary });
}

/** Admin: edit a user — `PATCH /api/users/:id`. */
export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      apiPatch(endpoints.user(id), input),
    onSuccess: () => invalidateUsers(qc),
  });
}

/** Admin: delete a user — `DELETE /api/users/:id`. */
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(endpoints.user(id)),
    onSuccess: () => invalidateUsers(qc),
  });
}
