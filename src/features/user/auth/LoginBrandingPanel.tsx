"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { FloatingDroplets } from "@/components/shared/FloatingDroplets";
import { WaterBottle } from "@/components/shared/WaterBottle";
import { PRODUCTS } from "@/data/products";
import { BrandLockup } from "@/components/shared/BrandLockup";

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
          <BrandLockup
            size="lg"
            companyColor="rgba(219,234,254,0.7)"
            wordmarkColor="#ffffff"
            taglineColor="#93C5FD"
            className="mb-10"
          />
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
