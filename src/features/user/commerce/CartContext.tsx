"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { useAuth } from "@/features/user/auth/AuthContext";
import { loadCart, saveCart } from "./cartStorage";
import type { CartItem } from "@/types";

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  updateQty: (size: string, qty: number) => void;
  removeFromCart: (size: string) => void;
  openCart: () => void;
  bookNow: (item: CartItem) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Access cart state and actions. Must be used inside a `CartProvider`. */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

/**
 * Holds the shopping-cart state and orchestrates the cart drawer and checkout
 * overlay. Checkout uses the signed-in customer's account (and their stored
 * phone number) — guests are redirected to log in first.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  // Restore any saved cart on first mount (after hydration to avoid a mismatch).
  useEffect(() => {
    setCartItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist the cart on every change so it survives a page refresh.
  useEffect(() => {
    if (hydrated) saveCart(cartItems);
  }, [cartItems, hydrated]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((x) => x.size === item.size);
      if (existing) {
        return prev.map((x) => (x.size === item.size ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const updateQty = (size: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) => prev.map((x) => (x.size === size ? { ...x, qty } : x)));
  };

  const removeFromCart = (size: string) =>
    setCartItems((prev) => prev.filter((x) => x.size !== size));

  /** Require a signed-in customer before any checkout can start. */
  const requireLogin = (): boolean => {
    if (user) return true;
    setCartOpen(false);
    router.push("/login");
    return false;
  };

  const handleCheckout = () => {
    if (!requireLogin()) return;
    setCheckoutItems([...cartItems]);
    setCartOpen(false);
    setShowCheckout(true);
  };

  const bookNow = (item: CartItem) => {
    if (!requireLogin()) return;
    setCheckoutItems([item]);
    setShowCheckout(true);
  };

  const handleOrderDone = () => {
    const fromCart =
      checkoutItems.length > 0 &&
      checkoutItems.every((ci) => cartItems.some((c) => c.size === ci.size));
    if (fromCart) setCartItems([]);
    setCheckoutItems([]);
    setShowCheckout(false);
    // Send the customer to their dashboard, where the new order is shown.
    router.push("/dashboard");
  };

  const value: CartContextValue = {
    cartItems,
    cartCount,
    addToCart,
    updateQty,
    removeFromCart,
    openCart: () => setCartOpen(true),
    bookNow,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setCartOpen(false)}
            onQtyChange={updateQty}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCheckout && checkoutItems.length > 0 && (
          <CheckoutModal
            cartItems={checkoutItems}
            userName={user?.username ?? ""}
            userPhone={user?.phone ?? ""}
            onClose={() => setShowCheckout(false)}
            onDone={handleOrderDone}
          />
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
