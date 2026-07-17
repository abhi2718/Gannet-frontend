"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { Droplets } from "lucide-react";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";
import { useAuth } from "@/features/user/auth/AuthContext";
import type { UserDashView } from "@/types";
import { UserDashboardHome } from "./UserDashboardHome";
import { ProfileView } from "./ProfileView";
import { OrderHistoryView } from "./OrderHistoryView";
import { DashboardUserMenu } from "./DashboardUserMenu";

const NAV_LINKS: { key: UserDashView; label: string }[] = [
  { key: "home", label: "Dashboard" },
  { key: "order-history", label: "My Orders" },
  { key: "profile", label: "Profile" },
];

/** Customer dashboard shell: top nav, avatar menu, and view switching. */
export function UserDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [dashView, setDashView] = useState<UserDashView>("home");

  // Open a specific view when deep-linked from the landing navbar
  // (e.g. `/dashboard?view=profile` or `?view=order-history`).
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "profile" || view === "order-history") setDashView(view);
  }, []);

  const nav = (v: UserDashView) => setDashView(v);
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
          <button
            onClick={() => router.push("/")}
            aria-label="Go to home page"
            className="flex items-center gap-2.5"
          >
              <GannetBirdIcon />
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

            <DashboardUserMenu
              onHome={() => router.push("/")}
              onNavigate={nav}
              onLogout={handleLogout}
            />
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
