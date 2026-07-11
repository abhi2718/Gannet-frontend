"use client";

import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, X, CheckCircle, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";

type CartDrawerProps = {
  items: CartItem[];
  onClose: () => void;
  onQtyChange: (size: string, qty: number) => void;
  onRemove: (size: string) => void;
  onCheckout: () => void;
};

export function CartDrawer({ items, onClose, onQtyChange, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-[#0D6EFD]" />
            <h2 className="text-lg font-extrabold text-gray-900">My Cart</h2>
            {count > 0 && (
              <span
                className="w-6 h-6 rounded-full text-xs font-extrabold text-white flex items-center justify-center"
                style={{ background: "#0D6EFD" }}
              >
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                <ShoppingCart size={30} className="text-[#0D6EFD] opacity-40" />
              </div>
              <div>
                <p className="font-bold text-gray-700 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-400">
                  Browse our products and add items to continue
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-[#0D6EFD] transition-all hover:bg-blue-50"
                style={{ border: "1.5px solid rgba(13,110,253,0.3)" }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.size}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: "#F0F9FF" }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: "#EFF6FF" }}
                    >
                      <img
                        src="/bottle_old.png"
                        alt={item.size}
                        style={{
                          height: "100%",
                          width: "auto",
                          objectFit: "contain",
                          filter: "drop-shadow(0 4px 8px rgba(13,71,161,0.2))",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm">GANNET {item.size}</div>
                      <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                      <div className="font-extrabold text-[#0D6EFD] text-sm">
                        ₹{item.price * item.qty}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => onRemove(item.size)}
                        aria-label={`Remove ${item.size}`}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQtyChange(item.size, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#0D6EFD] font-bold hover:bg-blue-50 transition-colors shadow-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-extrabold text-gray-900 w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onQtyChange(item.size, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 rounded-full bg-[#0D6EFD] flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            className="px-6 py-5 border-t"
            style={{ borderColor: "rgba(13,110,253,0.08)", background: "#FAFCFF" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">
                {count} item{count !== 1 ? "s" : ""}
              </span>
              <span className="text-2xl font-extrabold text-gray-900">₹{total}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Taxes &amp; delivery calculated at checkout
            </p>
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
              }}
            >
              <ShoppingCart size={17} /> Proceed to Checkout
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
              <CheckCircle size={11} /> Sign in &amp; pick a delivery address to place your order
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
