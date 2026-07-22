"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  AlertCircle,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashTab } from "@/types";
import { useAuth } from "@/features/user/auth/AuthContext";
import { DashboardOverview } from "./DashboardOverview";
import { QueriesView } from "./QueriesView";
import { OrdersView } from "./OrdersView";
import { UsersView } from "./UsersView";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";

const SIDE_ITEMS: { key: DashTab; icon: LucideIcon; label: string }[] = [
  { key: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { key: "queries", icon: AlertCircle, label: "Queries" },
  { key: "orders", icon: ShoppingCart, label: "Orders" },
  { key: "users", icon: Users, label: "Users" },
];

/** Up-to-two-letter avatar initials derived from the user's name. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

/** Admin dashboard shell: collapsible sidebar, top bar, and tab switching. */
export function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<DashTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayName = user?.username ?? "Admin";
  const displayEmail = user?.email ?? "";
  const avatar = user ? initials(user.username) : "AD";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="shrink-0 flex flex-col relative z-20"
        style={{
          background: "white",
          borderRight: "1px solid rgba(13,110,253,0.08)",
          boxShadow: "2px 0 16px rgba(13,110,253,0.05)",
        }}
      >
        <div
          className="flex items-center px-2 border-b"
          style={{ height: 72, borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div className="flex items-center  overflow-hidden">
          <GannetBirdIcon />
            {sidebarOpen && (
              <div className="flex items-start  overflow-hidden">
                <span className="text-lg font-extrabold text-[#0D6EFD] tracking-wider whitespace-nowrap">
                  GANNET
                </span>
                <span className="text-xs font-bold text-[#0D6EFD] mt-0.5">™</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-hidden">
          {SIDE_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group"
              style={{
                background: tab === item.key ? "#EFF6FF" : "transparent",
                color: tab === item.key ? "#0D6EFD" : "#6B7280",
              }}
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
              )}
              {tab === item.key && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0D6EFD] shrink-0" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "rgba(13,110,253,0.08)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="bg-white border-b flex items-center px-6 justify-between gap-4"
          style={{ height: 72, borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
              className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Menu size={18} className="text-gray-500" />
            </button>
            <h1 className="font-extrabold text-gray-900 text-lg capitalize">{tab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-gray-500" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400" />
            </button>
            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
              style={{ background: "#F0F9FF" }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0D6EFD] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{avatar}</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-gray-900">{displayName}</div>
                <div className="text-xs text-gray-400">{displayEmail}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "overview" && <DashboardOverview />}
              {tab === "queries" && <QueriesView />}
              {tab === "orders" && <OrdersView />}
              {tab === "users" && <UsersView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
