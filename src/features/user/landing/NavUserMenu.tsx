"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, LayoutDashboard, User, ShoppingBag, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/features/user/auth/AuthContext";
import { initials } from "@/lib/format/initials";

type NavUserMenuProps = { scrolled: boolean };

const MENU: { icon: LucideIcon; label: string; view: string }[] = [
  { icon: User, label: "Profile", view: "profile" },
  { icon: ShoppingBag, label: "Orders", view: "order-history" },
];

/**
 * Signed-in avatar with a hover/click dropdown (Profile, Orders, Logout). Shown
 * in the landing navbar in place of the Login button once a customer is signed
 * in. Profile/Orders deep-link into the dashboard views; Logout ends the session.
 */
export function NavUserMenu({ scrolled }: NavUserMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!user) return null;

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // Small delay so moving the pointer from the avatar to the menu keeps it open.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const goToDashboard = () => {
    setOpen(false);
    router.push("/dashboard");
  };
  const goToView = (view: string) => {
    setOpen(false);
    router.push(`/dashboard?view=${view}`);
  };
  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/");
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full transition-all"
        style={{
          border: "1.5px solid",
          borderColor: scrolled ? "rgba(13,110,253,0.25)" : "rgba(255,255,255,0.4)",
        }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
          style={{ background: "linear-gradient(135deg,#0D6EFD,#00B4D8)" }}
        >
          {initials(user.username)}
        </span>
        <ChevronDown size={14} style={{ color: scrolled ? "#374151" : "#fff" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl overflow-hidden z-50"
            style={{
              border: "1px solid rgba(13,110,253,0.1)",
              boxShadow: "0 16px 48px rgba(13,110,253,0.18)",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "rgba(13,110,253,0.06)", background: "#F8FAFC" }}
            >
              <div className="font-bold text-gray-900 text-sm truncate">{user.username}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
            <button
              onClick={goToDashboard}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
            >
              <LayoutDashboard size={15} className="text-[#0D6EFD]" />
              <span className="text-sm font-semibold text-gray-800">Dashboard</span>
            </button>
            {MENU.map((item) => (
              <button
                key={item.view}
                onClick={() => goToView(item.view)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
              >
                <item.icon size={15} className="text-[#0D6EFD]" />
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 border-t hover:bg-red-50 transition-colors text-left"
              style={{ borderColor: "rgba(13,110,253,0.06)" }}
            >
              <LogOut size={15} className="text-red-400" />
              <span className="text-sm font-semibold text-red-500">Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
