"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence } from "motion/react";
import { CartDrawer } from "./CartDrawer";
import { PhoneOTPModal } from "./PhoneOTPModal";
import { CheckoutModal } from "./CheckoutModal";
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
 * Holds the shopping-cart state and orchestrates the cart drawer, phone OTP,
 * and checkout overlays for the whole end-user surface.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

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

  const handleCheckout = () => {
    setCheckoutItems([...cartItems]);
    setCartOpen(false);
    if (!userPhone) setShowOTP(true);
    else setShowCheckout(true);
  };

  const bookNow = (item: CartItem) => {
    setCheckoutItems([item]);
    if (!userPhone) setShowOTP(true);
    else setShowCheckout(true);
  };

  const handleOTPSuccess = (phone: string) => {
    setUserPhone(phone);
    setShowOTP(false);
    setShowCheckout(true);
  };

  const handleOrderDone = () => {
    const fromCart =
      checkoutItems.length > 0 &&
      checkoutItems.every((ci) => cartItems.some((c) => c.size === ci.size));
    if (fromCart) setCartItems([]);
    setCheckoutItems([]);
    setShowCheckout(false);
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
        {showOTP && (
          <PhoneOTPModal onClose={() => setShowOTP(false)} onSuccess={handleOTPSuccess} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCheckout && checkoutItems.length > 0 && (
          <CheckoutModal
            cartItems={checkoutItems}
            userPhone={userPhone}
            onClose={() => setShowCheckout(false)}
            onDone={handleOrderDone}
          />
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
