import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { apiGetPaged } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { PRODUCTS, BOTTLE_PRICES } from "@/data/products";
import type { CatalogProduct } from "@/types";

/** Product as returned by `GET /api/products`. */
type ApiProduct = {
  _id?: string;
  id?: string;
  productName: string;
  url: string;
  price: number;
  description: string;
};

function toCatalog(p: ApiProduct): CatalogProduct {
  return {
    id: p._id ?? p.id ?? p.productName,
    name: p.productName,
    price: p.price,
    description: p.description,
    image: p.url,
  };
}

/**
 * The static bottle lineup, used when the API can't be reached — e.g. guests on
 * the public landing page (the products endpoint requires auth) or a network
 * error — so the marketing grid always renders something.
 */
export const FALLBACK_CATALOG: CatalogProduct[] = PRODUCTS.map((p) => ({
  id: p.size,
  name: p.size,
  tag: p.label,
  price: BOTTLE_PRICES[p.size],
  description: p.desc,
  image: "/bottle_old.png",
}));

/**
 * Loads the product catalogue for the landing grid. Resolves API products when
 * available, otherwise the static fallback — the query never rejects, so the
 * page renders for guests and logged-in users alike.
 */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async (): Promise<CatalogProduct[]> => {
      try {
        const { data } = await apiGetPaged<ApiProduct>(endpoints.products);
        return data.length ? data.map(toCatalog) : FALLBACK_CATALOG;
      } catch {
        return FALLBACK_CATALOG;
      }
    },
  });
}
