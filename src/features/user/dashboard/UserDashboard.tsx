"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Droplets, ChevronDown, Users, ShoppingCart, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";
import { useAuth } from "@/features/user/auth/AuthContext";
import { initials } from "@/lib/format/initials";
import type { UserDashView } from "@/types";
import { UserDashboardHome } from "./UserDashboardHome";
import { ProfileView } from "./ProfileView";
import { OrderHistoryView } from "./OrderHistoryView";

const NAV_LINKS: { key: UserDashView; label: string }[] = [
  { key: "order-history", label: "My Orders" },
  { key: "profile", label: "Profile" },
];

const MENU_ITEMS: { icon: LucideIcon; label: string; key: UserDashView; desc: string }[] = [
  { icon: Users, label: "Profile", key: "profile", desc: "View & edit your info" },
  { icon: ShoppingCart, label: "Order History", key: "order-history", desc: "All your bookings" },
];

/** Customer dashboard shell: top nav, avatar menu, and view switching. */
export function UserDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dashView, setDashView] = useState<UserDashView>("home");
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const displayName = user?.username ?? "Account";
  const displayEmail = user?.email ?? "";
  const avatar = user ? initials(user.username) : "";

  // Open a specific view when deep-linked from the landing navbar
  // (e.g. `/dashboard?view=profile` or `?view=order-history`).
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "profile" || view === "order-history") setDashView(view);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const nav = (v: UserDashView) => {
    setDashView(v);
    setDropOpen(false);
  };
  // Booking happens on the storefront: send the customer to the bottle picker
  // ("Choose Your Perfect Size") on the landing page.
  const goToBook = () => router.push("/#products");
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0F9FF" }}>
      <header
        className="bg-white border-b sticky top-0 z-30"
        style={{
          borderColor: "rgba(13,110,253,0.08)",
          boxShadow: "0 1px 20px rgba(13,110,253,0.06)",
        }}
      >
        <div
          className="max-w-5xl mx-auto px-6 flex items-center justify-between"
          style={{ height: 68 }}
        >
          <button onClick={() => nav("home")} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D6EFD] flex items-center justify-center">
              <GannetBirdIcon />
            </div>
            <div className="flex items-start gap-0.5">
              <span className="text-lg font-extrabold text-[#0D6EFD] tracking-wider">GANNET</span>
              <span className="text-xs font-bold text-[#0D6EFD] mt-0.5">™</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-blue-50 transition-all"
            >
              Home
            </button>
            {NAV_LINKS.map((item) => (
              <button
                key={item.key}
                onClick={() => nav(item.key)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: dashView === item.key ? "#EFF6FF" : "transparent",
                  color: dashView === item.key ? "#0D6EFD" : "#6B7280",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goToBook}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "#0D6EFD", boxShadow: "0 4px 16px rgba(13,110,253,0.3)" }}
            >
              <Droplets size={14} /> Book Water
            </button>

            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-blue-50"
                style={{
                  border: dropOpen ? "1.5px solid rgba(13,110,253,0.2)" : "1.5px solid transparent",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
                  style={{ background: "linear-gradient(135deg,#0D6EFD,#00B4D8)" }}
                >
                  {avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-gray-900 leading-tight">{displayName}</div>
                  <div className="text-xs text-gray-400 leading-tight">{displayEmail}</div>
                </div>
                <motion.span
                  animate={{ rotate: dropOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.span>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl overflow-hidden z-50"
                    style={{
                      border: "1px solid rgba(13,110,253,0.1)",
                      boxShadow: "0 16px 48px rgba(13,110,253,0.15)",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "rgba(13,110,253,0.06)", background: "#F8FAFC" }}
                    >
                      <div className="font-bold text-gray-900 text-sm">{displayName}</div>
                      <div className="text-xs text-gray-400">{displayEmail}</div>
                    </div>
                    {MENU_ITEMS.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => nav(item.key)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:bg-[#0D6EFD] transition-colors"
                          style={{ background: "#EFF6FF" }}
                        >
                          <item.icon
                            size={14}
                            className="text-[#0D6EFD] group-hover:text-white transition-colors"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                          <div className="text-xs text-gray-400">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t" style={{ borderColor: "rgba(13,110,253,0.06)" }}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition-colors">
                          <LogOut size={14} className="text-red-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-red-500">Logout</div>
                          <div className="text-xs text-gray-400">Sign out of account</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {dashView === "profile" ? (
            <ProfileView key="profile" />
          ) : dashView === "order-history" ? (
            <OrderHistoryView key="order-history" />
          ) : (
            <UserDashboardHome key="home" onBook={goToBook} onNavigate={nav} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
