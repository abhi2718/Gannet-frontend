import type { OrderItem } from "@/types";

/**
 * Summary of an order's item lines for the compact table/tracking views that
 * still show a single size: the first bottle size, plus "+N more" when the
 * order has several lines.
 */
export function summarizeSize(items: OrderItem[]): string {
  if (items.length === 0) return "";
  const first = items[0].size;
  return items.length > 1 ? `${first} +${items.length - 1} more` : first;
}

/** Total quantity across every item line in the order. */
export function totalQty(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
