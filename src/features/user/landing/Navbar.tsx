"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Droplets, X, Menu } from "lucide-react";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";
import { NAV } from "@/data/content";
import { useAuth } from "@/features/user/auth/AuthContext";
import { NavUserMenu } from "./NavUserMenu";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

type NavbarProps = {
  scrolled: boolean;
  onBook: () => void;
  onLogin: () => void;
  cartCount: number;
  onCartOpen: () => void;
};

const sectionId = (n: string) =>
  n === "Why GANNET" ? "why-gannet" : n.toLowerCase().replace(/\s+/g, "-");

export function Navbar({ scrolled, onBook, onLogin, cartCount, onCartOpen }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };
  const goToView = (view: string) => {
    setOpen(false);
    router.push(`/dashboard?view=${view}`);
  };
  const mobileLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };
  const navColor = scrolled ? "#374151" : "rgba(255,255,255,0.88)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(255,255,255,0.93)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 1px 32px rgba(13,110,253,0.08)" : "none",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        style={{ height: 72 }}
      >
        <button onClick={() => go("home")} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0D6EFD] flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <GannetBirdIcon />
          </div>
          <div className="flex items-start gap-0.5">
            <span
              className="text-xl font-extrabold tracking-wider transition-colors duration-300"
              style={{ color: scrolled ? "#0D6EFD" : "#fff", letterSpacing: "0.12em" }}
            >
              GANNET
            </span>
            <span
              className="text-xs font-bold mt-0.5 transition-colors duration-300"
              style={{ color: scrolled ? "#0D6EFD" : "rgba(255,255,255,0.7)" }}
            >
              ™
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n}
              onClick={() => go(sectionId(n))}
              className="text-sm font-semibold transition-colors duration-200 hover:text-[#0D6EFD]"
              style={{ color: scrolled ? "#374151" : navColor }}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:block">
              <NavUserMenu scrolled={scrolled} />
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                color: scrolled ? "#0D6EFD" : "#fff",
                border: "1.5px solid",
                borderColor: scrolled ? "#0D6EFD" : "rgba(255,255,255,0.4)",
              }}
            >
              Login
            </button>
          )}
          <button
            onClick={onCartOpen}
            aria-label="Open cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-110"
            style={{
              background: scrolled ? "#EFF6FF" : "rgba(255,255,255,0.15)",
              backdropFilter: !scrolled ? "blur(10px)" : "none",
            }}
          >
            <ShoppingCart size={18} style={{ color: scrolled ? "#0D6EFD" : "#fff" }} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-extrabold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onBook}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105"
            style={{ background: "#0D6EFD", boxShadow: "0 4px 20px rgba(13,110,253,0.35)" }}
          >
            <Droplets size={15} /> Book Water
          </button>
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ color: scrolled ? "#374151" : "#fff" }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <NavbarMobileMenu
        open={open}
        signedIn={!!user}
        go={go}
        onLogin={onLogin}
        onBook={onBook}
        goToView={goToView}
        mobileLogout={mobileLogout}
      />
    </header>
  );
}
