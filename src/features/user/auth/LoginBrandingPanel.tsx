"use client";

import { motion } from "motion/react";
import { ChevronLeft, Droplets } from "lucide-react";
import { FloatingDroplets } from "@/components/shared/FloatingDroplets";
import { WaterBottle } from "@/components/shared/WaterBottle";
import { PRODUCTS } from "@/data/products";

/** The decorative left-hand branding panel of the login screen. */
export function LoginBrandingPanel({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="hidden lg:flex flex-col w-1/2 relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #060E24 0%, #0D2B6E 40%, #0D6EFD 75%, #00B4D8 100%)",
      }}
    >
      <FloatingDroplets />
      <div className="relative z-10 flex flex-col h-full p-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-auto"
        >
          <ChevronLeft size={18} /> Back to site
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
            <Droplets size={36} className="text-white" />
          </div>
          <div className="flex items-start gap-1 mb-3">
            <span className="text-5xl font-black text-white tracking-widest">GANNET</span>
            <span className="text-xl font-bold text-blue-200 mt-1">™</span>
          </div>
          <p className="text-blue-100/80 text-lg max-w-xs leading-relaxed mb-10">
            Pure Refreshment. Naturally Delivered.
          </p>
          <div className="flex items-end gap-4 justify-center">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <WaterBottle size={p.size} />
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-blue-200/50 text-xs text-center mt-auto">
          © 2024 GANNET™ Natural Water
        </p>
      </div>
    </div>
  );
}
