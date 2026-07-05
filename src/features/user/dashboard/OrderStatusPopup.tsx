"use client";

import { motion } from "motion/react";
import { X, CheckCircle } from "lucide-react";
import { TRACK_STEPS, statusToStep } from "@/data/mock/user";
import type { UserOrder } from "@/types";

/** Modal that visualises the delivery progress of a single customer order. */
export function OrderStatusPopup({ order, onClose }: { order: UserOrder; onClose: () => void }) {
  const step = statusToStep[order.status];
  const isCancelled = order.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 pt-6 pb-5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">
                Order Status
              </span>
              {!isCancelled && (
                <span className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse inline-block" />
              )}
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6">
          {isCancelled ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <X size={28} className="text-red-400" />
              </div>
              <p className="font-bold text-red-500 text-lg mb-1">Order Cancelled</p>
              <p className="text-gray-400 text-sm">This order was cancelled on {order.date}.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100">
                <motion.div
                  className="w-full rounded-full"
                  initial={{ height: "0%" }}
                  animate={{ height: `${(step / (TRACK_STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ background: "linear-gradient(180deg,#0D6EFD,#00B4D8)" }}
                />
              </div>
              <div className="space-y-6 pl-12">
                {TRACK_STEPS.map((s, si) => {
                  const done = si <= step;
                  const current = si === step;
                  return (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.08 }}
                      className="relative flex items-start gap-3"
                    >
                      <div
                        className="absolute -left-[2.85rem] w-8 h-8 rounded-full border-2 flex items-center justify-center"
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
                      </div>
                      <div className="pt-0.5">
                        <div
                          className="font-bold text-sm"
                          style={{ color: done ? "#0D6EFD" : "#9CA3AF" }}
                        >
                          {s}
                        </div>
                        {current && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {s === "Out for Delivery"
                              ? `Expected by ${order.delivery}`
                              : "In progress"}
                          </div>
                        )}
                        {done && !current && (
                          <div className="text-xs text-gray-300 mt-0.5">Completed</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 rounded-2xl" style={{ background: "#F0F9FF" }}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Item</span>
              <span className="font-semibold text-gray-900">
                GANNET {order.size} × {order.qty}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Delivery To</span>
              <span className="font-semibold text-gray-900 text-right max-w-[180px]">
                {order.address}
              </span>
            </div>
            <div
              className="flex justify-between text-sm pt-2 border-t mt-2"
              style={{ borderColor: "rgba(13,110,253,0.1)" }}
            >
              <span className="font-bold text-gray-700">Total</span>
              <span className="font-extrabold text-[#0D6EFD]">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#0D6EFD] text-white font-bold text-sm hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
