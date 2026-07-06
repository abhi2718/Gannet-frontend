import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiPatch, apiDelete } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

/**
 * Fields an admin may change on an order (`PATCH /api/orders/:id`). `status`
 * uses the API's spaced form ("out for delivery"); the caller converts from the
 * UI's hyphenated keys before sending.
 */
export type UpdateOrderInput = {
  customerName?: string;
  customerPhone?: string;
  status?: string;
};

/** Refresh the order list plus the overview tiles/charts that count orders. */
function invalidateOrders(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: queryKeys.adminOrders });
  qc.invalidateQueries({ queryKey: queryKeys.adminSummary });
  qc.invalidateQueries({ queryKey: queryKeys.adminOrderStatus });
}

/** Admin: edit an order — `PATCH /api/orders/:id`. */
export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderInput }) =>
      apiPatch(endpoints.order(id), input),
    onSuccess: () => invalidateOrders(qc),
  });
}

/** Admin: delete an order — `DELETE /api/orders/:id`. */
export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(endpoints.order(id)),
    onSuccess: () => invalidateOrders(qc),
  });
}
