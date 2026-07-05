"use client";

import { motion } from "motion/react";
import { Package, ChevronRight, Truck, Droplets } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";

export function BookingSection({ onBook }: { onBook: () => void }) {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00B4D8] uppercase">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            Get Water in 2 Easy Steps
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Booking fresh GANNET water takes less than a minute.
          </p>
        </FadeIn>

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div
            className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-[#0D6EFD] to-[#00B4D8]"
            style={{ zIndex: 0 }}
          />

          <FadeIn className="flex-1 w-full" delay={0}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="relative rounded-3xl p-8 flex flex-col items-center text-center cursor-default"
              style={{
                background: "linear-gradient(145deg, #EAF6FF 0%, #DBEAFE 100%)",
                boxShadow: "0 8px 40px rgba(13,110,253,0.10)",
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0D6EFD] flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white text-sm font-black">1</span>
              </div>
              <motion.div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5 mt-3"
                whileHover={{ rotate: 5 }}
                style={{ background: "white", boxShadow: "0 4px 20px rgba(13,110,253,0.12)" }}
              >
                <Package size={38} className="text-[#0D6EFD]" />
              </motion.div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Choose Your Bottle Size</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Pick from 250 ml, 500 ml, 1 L, or 2 L and set your quantity. We show you the price
                instantly.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["250 ml", "500 ml", "1 Litre", "2 Litre"].map((s, i) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: i === 1 ? "#0D6EFD" : "white",
                      color: i === 1 ? "white" : "#0D6EFD",
                      border: "1.5px solid",
                      borderColor: i === 1 ? "#0D6EFD" : "rgba(13,110,253,0.2)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </FadeIn>

          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 rotate-90 sm:rotate-0"
            style={{
              background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
              boxShadow: "0 4px 16px rgba(13,110,253,0.3)",
            }}
          >
            <ChevronRight size={18} className="text-white" />
          </div>

          <FadeIn className="flex-1 w-full" delay={0.15}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="relative rounded-3xl p-8 flex flex-col items-center text-center cursor-default"
              style={{
                background: "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)",
                boxShadow: "0 8px 40px rgba(0,180,216,0.10)",
              }}
            >
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                  boxShadow: "0 4px 16px rgba(0,180,216,0.35)",
                }}
              >
                <span className="text-white text-sm font-black">2</span>
              </div>
              <motion.div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5 mt-3"
                whileHover={{ rotate: -5 }}
                style={{ background: "white", boxShadow: "0 4px 20px rgba(0,180,216,0.12)" }}
              >
                <Truck size={38} className="text-[#00B4D8]" />
              </motion.div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                Fill Your Delivery Details
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Enter your name, phone, address, and preferred delivery date. We handle the rest.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Name", "Phone", "Address", "Date"].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "white",
                      color: "#00B4D8",
                      border: "1.5px solid rgba(0,180,216,0.25)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </FadeIn>
        </div>

        <FadeIn className="text-center mt-12" delay={0.3}>
          <button
            onClick={onBook}
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full font-bold text-white text-sm hover:scale-105 active:scale-95 transition-transform shadow-xl"
            style={{
              background: "linear-gradient(135deg, #0D6EFD 0%, #00B4D8 100%)",
              boxShadow: "0 8px 40px rgba(13,110,253,0.35)",
            }}
          >
            <Droplets size={17} /> Start Booking Now
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
