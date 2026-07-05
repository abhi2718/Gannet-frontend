import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

/** Payload for a public enquiry submission (`POST /api/queries`). */
export type QuerySubmission = {
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  requirement: string;
  message: string;
};

/** Public: submit an enquiry. No auth required (rate-limited server-side). */
export function useSubmitQuery() {
  return useMutation({
    mutationFn: (input: QuerySubmission) => apiPost(endpoints.queries, input),
  });
}

/** Admin: change an enquiry's status — `PATCH /api/queries/:id`. */
export function useUpdateQueryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch(endpoints.query(id), { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminQueries }),
  });
}

/** Admin: delete an enquiry — `DELETE /api/queries/:id`. */
export function useDeleteQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(endpoints.query(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminQueries }),
  });
}
