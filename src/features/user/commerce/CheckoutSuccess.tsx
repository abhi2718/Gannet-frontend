"use client";

import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import type { CartItem } from "@/types";

type CheckoutSuccessProps = {
  cartItems: CartItem[];
  name: string;
  city: string;
  date: string;
  count: number;
  total: number;
  onDone: () => void;
};

/** Confirmation screen shown after a checkout order is placed. */
export function CheckoutSuccess({
  cartItems,
  name,
  city,
  date,
  count,
  total,
  onDone,
}: CheckoutSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle size={40} className="text-green-500" />
      </motion.div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
        Thank you, <strong>{name}</strong>! Your {count} item order has been confirmed. We will
        deliver to <strong>{city}</strong> by{" "}
        <strong>{date || "the earliest available date"}</strong>.
      </p>
      <div className="rounded-2xl p-5 text-left mb-6" style={{ background: "#F0F9FF" }}>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Order Summary
        </div>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.size} className="flex justify-between text-sm">
              <span className="text-gray-500">
                {item.qty}× GANNET {item.size}
              </span>
              <span className="font-semibold text-gray-900">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div
            className="flex justify-between text-sm pt-2 border-t mt-1"
            style={{ borderColor: "rgba(13,110,253,0.1)" }}
          >
            <span className="font-bold text-gray-700">Total</span>
            <span className="font-extrabold text-[#0D6EFD]">₹{total}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl bg-[#0D6EFD] text-white font-bold text-sm hover:bg-blue-600 transition-colors"
      >
        Done
      </button>
    </motion.div>
  );
}
