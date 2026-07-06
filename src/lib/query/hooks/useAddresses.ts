import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import {
  createAddress,
  createOrder,
  deleteAddress,
  fetchAddresses,
  updateAddress,
  type NewAddressInput,
} from "@/features/user/commerce/checkoutApi";
import type { Address } from "@/types";

/** The signed-in customer's saved delivery addresses (`GET /api/addresses`). */
export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: async (): Promise<Address[]> => fetchAddresses(),
  });
}

/** Save a new address; refreshes the address list on success. */
export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
}

/** Update an existing address; refreshes the address list on success. */
export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: NewAddressInput }) => updateAddress(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
}

/** Delete an address; refreshes the address list on success. */
export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
}

/** Place an order; refreshes the customer's and the admin's order lists. */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.userOrders });
      qc.invalidateQueries({ queryKey: queryKeys.adminOrders });
    },
  });
}
