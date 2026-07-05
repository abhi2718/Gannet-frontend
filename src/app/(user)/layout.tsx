"use client";

import { CartProvider } from "@/features/user/commerce/CartContext";

/**
 * Layout for the end-user surface (landing, login, customer dashboard).
 * Wraps everything in the cart provider so the cart drawer, OTP, and checkout
 * overlays are available across the whole group.
 */
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
