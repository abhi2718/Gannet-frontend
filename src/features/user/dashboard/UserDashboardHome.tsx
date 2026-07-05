"use client";

import { motion } from "motion/react";
import { Droplets, MapPin, Phone, ShoppingCart, Users } from "lucide-react";
import { useUserOrders } from "@/lib/query/hooks/useUserOrders";
import type { UserDashView } from "@/types";
import { UserDashboardTracking } from "./UserDashboardTracking";
import { UserDashboardRecent } from "./UserDashboardRecent";

type UserDashboardHomeProps = {
  onBook: () => void;
  onNavigate: (view: UserDashView) => void;
};

export function UserDashboardHome({ onBook, onNavigate }: UserDashboardHomeProps) {
  const { data: orders = [] } = useUserOrders();
  const activeOrder = orders.find(
    (o) => o.status === "out-for-delivery" || o.status === "confirmed",
  );
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length },
    { label: "Delivered", value: delivered },
    { label: "Total Spent", value: `₹${totalSpent}` },
  ];

  const quickActions = [
    {
      icon: Droplets,
      label: "Book Water",
      sub: "Place a new order",
      action: onBook,
      color: "#0D6EFD",
      bg: "#EFF6FF",
    },
    {
      icon: ShoppingCart,
      label: "Order History",
      sub: "View all your orders",
      action: () => onNavigate("order-history"),
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      icon: Users,
      label: "My Profile",
      sub: "Update your details",
      action: () => onNavigate("profile"),
      color: "#16A34A",
      bg: "#F0FDF4",
    },
  ];

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D47A1 0%, #0D6EFD 55%, #00B4D8 100%)" }}
      >
        <div
          className="absolute top-[-40px] right-[-40px] w-56 h-56 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
        <div
          className="absolute bottom-[-30px] left-[30%] w-40 h-40 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
            <h1 className="text-3xl font-extrabold mb-3">Arjun Mehta</h1>
            <button
              onClick={onBook}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}
            >
              <Droplets size={15} /> Book Water Now
            </button>
          </div>
          <div className="flex gap-6 flex-wrap">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-blue-200 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeOrder && <UserDashboardTracking order={activeOrder} />}

      <div className="grid sm:grid-cols-2 gap-5">
        <UserDashboardRecent orders={orders} onViewAll={() => onNavigate("order-history")} />

        <div
          className="bg-white rounded-3xl p-6 border"
          style={{
            borderColor: "rgba(13,110,253,0.08)",
            boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
          }}
        >
          <h3 className="font-extrabold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:scale-[1.01] transition-all text-left"
                style={{ background: item.bg }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white">
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          className="bg-white rounded-3xl p-6 border"
          style={{
            borderColor: "rgba(13,110,253,0.08)",
            boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-900">Saved Address</h3>
            <button
              onClick={() => onNavigate("profile")}
              className="text-xs font-bold text-[#0D6EFD] hover:underline"
            >
              Edit →
            </button>
          </div>
          <div className="p-4 rounded-2xl mb-3" style={{ background: "#F0F9FF" }}>
            <div className="flex items-start gap-3">
              <MapPin size={15} className="text-[#0D6EFD] mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-0.5">Home</div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  7 Juhu Beach Road, Mumbai, Maharashtra 400049
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Phone size={11} className="text-[#0D6EFD]" /> +91 99123 45678
          </div>
        </div>
      </div>
    </motion.div>
  );
}
