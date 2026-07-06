"use client";

import { motion } from "motion/react";
import { Package, Droplets } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { UserOrder } from "@/types";

type UserDashboardRecentProps = {
  orders: UserOrder[];
  onViewAll: () => void;
  onBook: () => void;
};

/** The "Recent Bookings" card on the customer dashboard home. */
export function UserDashboardRecent({ orders, onViewAll, onBook }: UserDashboardRecentProps) {
  return (
    <div
      className="sm:col-span-2 bg-white rounded-3xl border overflow-hidden"
      style={{
        borderColor: "rgba(13,110,253,0.08)",
        boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
      }}
    >
      <div
        className="px-6 py-5 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(13,110,253,0.06)" }}
      >
        <h3 className="font-extrabold text-gray-900">Recent Bookings</h3>
        <button onClick={onViewAll} className="text-xs font-bold text-[#0D6EFD] hover:underline">
          View all →
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="px-6 py-12 flex flex-col items-center text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#EFF6FF" }}
          >
            <Package size={24} className="text-[#0D6EFD]" />
          </div>
          <p className="font-bold text-gray-900 text-sm mb-1">No bookings yet</p>
          <p className="text-xs text-gray-400 max-w-[220px] mb-5">
            You haven&apos;t placed any orders. Book your first bottle of GANNET™ water to get
            started.
          </p>
          <button
            onClick={onBook}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: "#0D6EFD", boxShadow: "0 4px 16px rgba(13,110,253,0.3)" }}
          >
            <Droplets size={14} /> Book Your First Water
          </button>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "rgba(13,110,253,0.05)" }}>
          {orders.slice(0, 4).map((o, idx) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="px-6 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#EFF6FF" }}
              >
                <Package size={16} className="text-[#0D6EFD]" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {o.qty}× GANNET {o.size}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {o.id} · {o.date}
                </div>
              </div>
            </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                <span className="font-bold text-gray-900 text-sm hidden sm:inline">
                  ₹{o.total}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
