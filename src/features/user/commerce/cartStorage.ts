/**
 * Persistence for the shopping cart. Kept in `localStorage` so the cart survives
 * a page refresh; reads are defensive so a corrupt or unavailable store simply
 * yields an empty cart instead of throwing.
 */
import type { CartItem } from "@/types";

const CART_KEY = "gannet.cart";

/** True for a well-formed cart line (guards against corrupt stored JSON). */
function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.size === "string" &&
    typeof v.label === "string" &&
    typeof v.price === "number" &&
    typeof v.qty === "number"
  );
}

/** Load the saved cart, or `[]` when nothing valid is stored. */
export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

/** Persist the cart (best-effort; ignores storage failures). */
export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — persistence is best-effort */
  }
}
