"use client";

import { motion } from "motion/react";
import { CheckCircle, Package, MapPin } from "lucide-react";
import { TRACK_STEPS, statusToStep } from "@/data/mock/user";
import type { UserOrder } from "@/types";

/** Horizontal delivery tracker for the customer's current active order. */
export function UserDashboardTracking({ order }: { order: UserOrder }) {
  const activeStep = statusToStep[order.status];

  return (
    <div
      className="bg-white rounded-3xl p-6 border"
      style={{
        borderColor: "rgba(13,110,253,0.08)",
        boxShadow: "0 4px 24px rgba(13,110,253,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">
              Active Order
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse inline-block" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">{order.id}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-0.5">Estimated delivery</div>
          <div className="font-bold text-gray-900 text-sm">{order.delivery}</div>
        </div>
      </div>
      <div className="relative flex items-start justify-between mb-5">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100" style={{ zIndex: 0 }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStep / (TRACK_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ background: "linear-gradient(90deg,#0D6EFD,#00B4D8)" }}
          />
        </div>
        {TRACK_STEPS.map((step, si) => {
          const done = si <= activeStep;
          const current = si === activeStep;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + si * 0.1 }}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                style={{
                  background: done ? "#0D6EFD" : "white",
                  borderColor: done ? "#0D6EFD" : "#E5E7EB",
                  boxShadow: current ? "0 0 0 4px rgba(13,110,253,0.15)" : "none",
                }}
              >
                {done ? (
                  <CheckCircle size={14} className="text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-200" />
                )}
              </motion.div>
              <span
                className="text-xs text-center leading-tight"
                style={{
                  color: done ? "#0D6EFD" : "#9CA3AF",
                  fontWeight: done ? 700 : 400,
                  maxWidth: 64,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center justify-between pt-4 border-t text-sm"
        style={{ borderColor: "#F0F9FF" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Package size={16} className="text-[#0D6EFD]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {order.qty}× GANNET {order.size}
            </div>
            <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {order.address}
            </div>
          </div>
        </div>
        <div className="font-extrabold text-[#0D6EFD]">₹{order.total}</div>
      </div>
    </div>
  );
}
