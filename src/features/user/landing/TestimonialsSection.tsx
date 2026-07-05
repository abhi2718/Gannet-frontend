"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin } from "lucide-react";
import { Stars } from "@/components/shared/Stars";
import { TESTIMONIALS } from "@/data/content";

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const active = TESTIMONIALS[idx];

  return (
    <section id="testimonials" className="py-24" style={{ background: "#F0F9FF" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00B4D8] uppercase">
            What People Say
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Loved by Thousands
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-10 relative overflow-hidden"
              style={{ boxShadow: "0 20px 60px rgba(13,110,253,0.1)" }}
            >
              <div className="absolute top-6 right-8 text-8xl font-black text-blue-50 leading-none select-none">
                &ldquo;
              </div>
              <Stars n={active.rating} />
              <p className="text-xl text-gray-700 mt-5 mb-8 leading-relaxed relative z-10">
                {active.review}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={active.photo}
                  alt={active.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100"
                />
                <div>
                  <div className="font-extrabold text-gray-900">{active.name}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {active.location}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300"
              style={{
                background: i === idx ? "white" : "transparent",
                boxShadow: i === idx ? "0 4px 20px rgba(13,110,253,0.12)" : "none",
                border: `1.5px solid ${i === idx ? "rgba(13,110,253,0.15)" : "transparent"}`,
              }}
            >
              <img
                src={t.photo}
                alt={t.name}
                className="w-10 h-10 rounded-xl object-cover"
                style={{ opacity: i === idx ? 1 : 0.55 }}
              />
              <span
                className="text-sm font-semibold hidden sm:block"
                style={{ color: i === idx ? "#0D6EFD" : "#9CA3AF" }}
              >
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
