"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { useProducts } from "@/lib/query/hooks/useProducts";
import { ProductModal } from "@/features/user/commerce/ProductModal";
import type { CartItem, CatalogProduct } from "@/types";

type ProductSectionProps = {
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
};

const BOTTLE_HEIGHTS = [68, 80, 90, 100];

const toCartItem = (p: CatalogProduct): CartItem => ({
  size: p.name,
  label: p.tag ?? p.name,
  price: p.price,
  qty: 1,
});

export function ProductSection({ onAddToCart, onBookNow }: ProductSectionProps) {
  const { data: products, isPending } = useProducts();
  const [added, setAdded] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<CatalogProduct | null>(null);

  const handleAdd = (p: CatalogProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(toCartItem(p));
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <section id="products" className="py-24 bg-white">
      <AnimatePresence>
        {modalProduct && (
          <ProductModal
            product={modalProduct}
            onClose={() => setModalProduct(null)}
            onAddToCart={(item) => {
              onAddToCart(item);
              setModalProduct(null);
            }}
            onBookNow={(item) => onBookNow(item)}
          />
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00B4D8] uppercase">
            Our Range
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Choose Your Perfect Size
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            From personal hydration to bulk family needs, GANNET™ has a bottle for every moment.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl h-[440px] animate-pulse"
                  style={{ background: "linear-gradient(160deg, #EAF6FF 0%, #DBEAFE 100%)" }}
                />
              ))
            : (products ?? []).map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.1}>
                  <motion.div
                    className="rounded-3xl overflow-hidden cursor-pointer group relative"
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      background: "linear-gradient(160deg, #EAF6FF 0%, #DBEAFE 100%)",
                      boxShadow: "0 4px 24px rgba(13,110,253,0.08)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 30%, rgba(13,110,253,0.1) 0%, transparent 70%)",
                      }}
                    />
                    <div
                      className="pt-8 pb-2 px-6 flex items-end justify-center"
                      style={{ height: 280 }}
                    >
                      <motion.div
                        whileHover={{ y: -8, rotate: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex items-end justify-center h-full"
                      >
                        <img
                          src={p.image}
                          alt={`GANNET ${p.name} Premium Natural Water Bottle`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/bottle.png";
                          }}
                          style={{
                            height: `${BOTTLE_HEIGHTS[i % BOTTLE_HEIGHTS.length]}%`,
                            width: "auto",
                            objectFit: "contain",
                            filter:
                              "drop-shadow(0 16px 32px rgba(13,71,161,0.3)) drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
                          }}
                        />
                      </motion.div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-5 rounded-2xl mx-3 mb-4">
                      <div className="flex items-baseline justify-between mb-1 gap-2">
                        <h3 className="text-xl font-extrabold text-gray-900">{p.name}</h3>
                        <span className="text-sm font-extrabold text-[#0D6EFD] bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          ₹{p.price}
                        </span>
                      </div>
                      {p.tag && (
                        <span className="inline-block text-xs font-bold text-[#00B4D8] mb-1">
                          {p.tag}
                        </span>
                      )}
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex gap-2">
                        {/* <button
                          onClick={() => setModalProduct(p)}
                          className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                          style={{
                            background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                            color: "white",
                            boxShadow: "0 4px 16px rgba(13,110,253,0.3)",
                          }}
                        >
                          <Droplets size={14} /> 
                        </button> */}
                        <button
                          onClick={(e) => handleAdd(p, e)}
                          className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 border-2 hover:scale-[1.02]"
                          style={{
                            borderColor: added === p.id ? "#16A34A" : "#0D6EFD",
                            color: added === p.id ? "#16A34A" : "#0D6EFD",
                            background: "white",
                          }}
                        >
                          {added === p.id ? (
                            <>
                              <CheckCircle size={14} /> Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} /> Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
        </div>
      </div>
    </section>
  );
}
