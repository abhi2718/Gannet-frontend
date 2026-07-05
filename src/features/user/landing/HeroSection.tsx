"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplets } from "lucide-react";
import { SLIDES } from "@/data/content";
import { FloatingDroplets } from "@/components/shared/FloatingDroplets";

export function HeroSection({ onBook }: { onBook: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[idx];

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] overflow-hidden flex items-center"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.bg}
            alt={slide.tag}
            className="w-full h-full object-cover object-center"
            style={{ background: "#0A1628" }}
          />
          <div className="absolute inset-0" style={{ background: slide.overlay }} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 60%)" }}
          />
        </motion.div>
      </AnimatePresence>

      <FloatingDroplets />

      <div
        className="absolute right-[8%] top-1/2 -translate-y-1/2 h-[65vh] hidden lg:flex items-center"
        style={{ zIndex: 5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="h-full"
            initial={{ opacity: 0, x: 60, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ animation: "bottleFloat 4s ease-in-out infinite" }}
          >
            <img
              src="/bottle.png"
              alt="GANNET Premium Natural Water Bottle"
              style={{
                height: "100%",
                width: "auto",
                objectFit: "contain",
                filter:
                  "drop-shadow(0 40px 60px rgba(0,0,0,0.45)) drop-shadow(0 0 80px rgba(13,110,253,0.2))",
                maskImage:
                  "radial-gradient(ellipse 60% 85% at 50% 50%, black 55%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 85% at 50% 50%, black 55%, transparent 100%)",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white">
                {slide.tag}
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl font-black leading-tight mb-3 text-white"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
            >
              {slide.h1}
              <br />
              <span style={{ color: "#93C5FD" }}>{slide.h2}</span>
            </h1>
            <p
              className="text-lg max-w-md mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onBook}
                className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-white text-sm hover:scale-105 active:scale-95 transition-transform"
                style={{ background: "#0D6EFD", boxShadow: "0 8px 32px rgba(13,110,253,0.5)" }}
              >
                <Droplets size={17} /> Book Water Now
              </button>
              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm text-white transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                }}
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === idx ? 32 : 10,
              background: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" fill="white" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
