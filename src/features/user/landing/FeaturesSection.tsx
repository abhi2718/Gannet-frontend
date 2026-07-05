"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/shared/FadeIn";
import { FEATURES } from "@/data/content";

export function FeaturesSection() {
  return (
    <section
      id="why-gannet"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D47A1 0%, #0D6EFD 45%, #00B4D8 100%)" }}
    >
      <div
        className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.3)" }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.3)" }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
            Why GANNET™
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">
            Built on Trust &amp; Purity
          </h2>
          <p className="text-blue-100 max-w-md mx-auto">
            Eight reasons thousands of families and businesses choose GANNET every day.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <motion.div
                className="rounded-2xl p-6 group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280 }}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
