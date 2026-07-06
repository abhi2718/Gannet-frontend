"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Home, Users, ShoppingCart, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/features/user/auth/AuthContext";
import { initials } from "@/lib/format/initials";
import type { UserDashView } from "@/types";

const MENU_ITEMS: { icon: LucideIcon; label: string; key: UserDashView; desc: string }[] = [
  { icon: Users, label: "Profile", key: "profile", desc: "View & edit your info" },
  { icon: ShoppingCart, label: "Order History", key: "order-history", desc: "All your bookings" },
];

type DashboardUserMenuProps = {
  onHome: () => void;
  onNavigate: (view: UserDashView) => void;
  onLogout: () => void;
};

/** Avatar button + dropdown (Home, Profile, Order History, Logout) in the dashboard header. */
export function DashboardUserMenu({ onHome, onNavigate, onLogout }: DashboardUserMenuProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.username ?? "Account";
  const displayEmail = user?.email ?? "";
  const avatar = user ? initials(user.username) : "";

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (view: UserDashView) => {
    setOpen(false);
    onNavigate(view);
  };
  const goHome = () => {
    setOpen(false);
    onHome();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-blue-50"
        style={{ border: open ? "1.5px solid rgba(13,110,253,0.2)" : "1.5px solid transparent" }}
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
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown size={14} className="text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
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
            <button
              onClick={goHome}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:bg-[#0D6EFD] transition-colors"
                style={{ background: "#EFF6FF" }}
              >
                <Home size={14} className="text-[#0D6EFD] group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Home</div>
                <div className="text-xs text-gray-400">Back to storefront</div>
              </div>
            </button>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.key)}
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
                onClick={onLogout}
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
  );
}
