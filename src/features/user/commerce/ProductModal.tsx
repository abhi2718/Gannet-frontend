"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, ShoppingCart, CheckCircle, Droplets } from "lucide-react";
import type { CartItem, CatalogProduct } from "@/types";

type ProductModalProps = {
  product: CatalogProduct;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
};

export function ProductModal({ product, onClose, onAddToCart, onBookNow }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  const total = product.price * qty;
  const cartItem: CartItem = {
    size: product.name,
    label: product.tag ?? product.name,
    price: product.price,
    qty,
  };

  const handleAddToCart = () => {
    onAddToCart(cartItem);
    setCartAdded(true);
    setTimeout(() => {
      setCartAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex items-center justify-center py-10"
          style={{ background: "linear-gradient(160deg, #EAF6FF 0%, #DBEAFE 100%)" }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: 200 }}
          >
            <img
              src={product.image}
              alt={`GANNET ${product.name}`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/bottle_old.png";
              }}
              style={{
                height: "100%",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(13,71,161,0.3))",
              }}
            />
          </motion.div>
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: "#0D6EFD" }}
          >
            GANNET™ Premium Natural Water
          </div>
        </div>

        <div className="px-7 py-6">
          <div className="mb-5">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-2xl font-extrabold text-gray-900">{product.name}</h2>
              {product.tag && (
                <span className="text-xs font-bold text-[#0D6EFD] bg-blue-50 px-2.5 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 p-1.5 rounded-2xl"
                style={{ background: "#F0F9FF" }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#0D6EFD] font-bold text-lg shadow-sm hover:shadow transition-all"
                >
                  −
                </button>
                <span className="text-lg font-extrabold text-gray-900 w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-full bg-[#0D6EFD] flex items-center justify-center text-white font-bold text-lg hover:bg-blue-600 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex-1 p-3 rounded-2xl text-right" style={{ background: "#F0F9FF" }}>
                <div className="text-xs text-gray-400 mb-0.5">
                  {qty} × ₹{product.price}
                </div>
                <div className="text-2xl font-extrabold text-[#0D6EFD]">₹{total}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border-2"
              style={{
                borderColor: cartAdded ? "#16A34A" : "#0D6EFD",
                color: cartAdded ? "#16A34A" : "#0D6EFD",
                background: "white",
              }}
            >
              {cartAdded ? (
                <>
                  <CheckCircle size={16} /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={15} /> Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(cartItem);
              }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                boxShadow: "0 8px 24px rgba(13,110,253,0.35)",
              }}
            >
              <Droplets size={15} /> Book Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
