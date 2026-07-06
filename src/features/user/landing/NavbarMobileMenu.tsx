"use client";

import { motion, AnimatePresence } from "motion/react";
import { User, ShoppingBag, LogOut } from "lucide-react";
import { NAV, FEATURES } from "@/data/content";

const sectionId = (n: string) =>
  n === "Why GANNET" ? "why-gannet" : n.toLowerCase().replace(/\s+/g, "-");

type NavbarMobileMenuProps = {
  open: boolean;
  signedIn: boolean;
  go: (id: string) => void;
  onLogin: () => void;
  onBook: () => void;
  goToView: (view: string) => void;
  mobileLogout: () => void;
};

/** The collapsible mobile navigation panel for the landing navbar. */
export function NavbarMobileMenu({
  open,
  signedIn,
  go,
  onLogin,
  onBook,
  goToView,
  mobileLogout,
}: NavbarMobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-blue-50 overflow-hidden"
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() => go(sectionId(n))}
                className="py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-0"
              >
                {n}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 py-3">
              {FEATURES.map((f) => (
                <button
                  key={f.title}
                  onClick={() => go("why-gannet")}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 text-left"
                >
                  <f.icon size={14} className="text-[#0D6EFD] shrink-0" />
                  <span className="text-xs font-semibold text-gray-700 truncate">{f.title}</span>
                </button>
              ))}
            </div>
            {signedIn && (
              <div className="flex flex-col gap-1 pt-2 mt-1 border-t border-gray-50">
                <button
                  onClick={() => goToView("profile")}
                  className="flex items-center gap-2.5 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  <User size={15} className="text-[#0D6EFD]" /> Profile
                </button>
                <button
                  onClick={() => goToView("order-history")}
                  className="flex items-center gap-2.5 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  <ShoppingBag size={15} className="text-[#0D6EFD]" /> Orders
                </button>
                <button
                  onClick={mobileLogout}
                  className="flex items-center gap-2.5 py-3 text-left text-sm font-semibold text-red-500"
                >
                  <LogOut size={15} className="text-red-400" /> Logout
                </button>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              {!signedIn && (
                <button
                  onClick={onLogin}
                  className="flex-1 py-3 rounded-2xl border-2 border-[#0D6EFD] text-[#0D6EFD] font-bold text-sm"
                >
                  Login
                </button>
              )}
              <button
                onClick={onBook}
                className="flex-1 py-3 rounded-2xl bg-[#0D6EFD] text-white font-bold text-sm"
              >
                Book Water
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
