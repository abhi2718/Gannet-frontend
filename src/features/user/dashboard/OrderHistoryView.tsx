"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ORDERS_PER_PAGE } from "@/data/mock/user";
import { useUserOrders } from "@/lib/query/hooks/useUserOrders";
import type { UserOrder } from "@/types";
import { OrderStatusPopup } from "./OrderStatusPopup";

const COLUMNS = ["Order ID", "Item", "Qty", "Order Date", "Est. Delivery", "Amount", "Status"];

export function OrderHistoryView() {
  const { data: orders = [] } = useUserOrders();
  const [page, setPage] = useState(1);
  const [statusOrder, setStatusOrder] = useState<UserOrder | null>(null);

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const paginated = orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Order History</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {orders.length} total orders · ₹{totalSpent} spent
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400">
          Page {page} of {totalPages}
        </div>
      </div>

      <div
        className="bg-white rounded-3xl border overflow-hidden"
        style={{
          borderColor: "rgba(13,110,253,0.08)",
          boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.map((o, idx) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-t hover:bg-blue-50/30 transition-colors"
                    style={{ borderColor: "rgba(13,110,253,0.05)" }}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">{o.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      GANNET {o.size}
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-semibold">{o.qty}</td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{o.date}</td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{o.delivery}</td>
                    <td className="px-5 py-4 font-extrabold text-[#0D6EFD] whitespace-nowrap">
                      ₹{o.total}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setStatusOrder(o)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                        style={{
                          background: "#EFF6FF",
                          color: "#0D6EFD",
                          border: "1px solid rgba(13,110,253,0.2)",
                        }}
                      >
                        <CheckCircle size={12} />
                        Track Status
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div
          className="px-5 py-4 border-t flex items-center justify-between"
          style={{ borderColor: "rgba(13,110,253,0.06)", background: "#F8FAFC" }}
        >
          <span className="text-sm text-gray-400">
            {orders.length} orders · Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:bg-blue-50"
              style={{ border: "1.5px solid rgba(13,110,253,0.15)" }}
            >
              <ChevronLeft size={15} className="text-[#0D6EFD]" />
            </button>
            {Array.from({ length: totalPages }).map((_, pi) => (
              <button
                key={pi}
                onClick={() => setPage(pi + 1)}
                className="w-8 h-8 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: page === pi + 1 ? "#0D6EFD" : "transparent",
                  color: page === pi + 1 ? "white" : "#6B7280",
                  border: page === pi + 1 ? "none" : "1.5px solid rgba(13,110,253,0.15)",
                }}
              >
                {pi + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:bg-blue-50"
              style={{ border: "1.5px solid rgba(13,110,253,0.15)" }}
            >
              <ChevronRight size={15} className="text-[#0D6EFD]" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {statusOrder && (
          <OrderStatusPopup order={statusOrder} onClose={() => setStatusOrder(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
