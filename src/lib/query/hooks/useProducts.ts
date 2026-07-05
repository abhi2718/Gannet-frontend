import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

/**
 * Loads the catalogue of bottle sizes.
 * Real endpoint: `return apiGet<Product[]>(endpoints.products);`
 */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async (): Promise<Product[]> => PRODUCTS,
  });
}
