"use client";

import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartPoint, OrderStatusCounts } from "@/types";

/** Display order, labels and colours for each order status the API reports. */
const STATUS_DISPLAY: { key: string; label: string; color: string }[] = [
  { key: "delivered", label: "Delivered", color: "#16A34A" },
  { key: "out for delivery", label: "Out for Delivery", color: "#7C3AED" },
  { key: "confirmed", label: "Confirmed", color: "#2563EB" },
  { key: "pending", label: "Pending", color: "#D97706" },
  { key: "cancelled", label: "Cancelled", color: "#E11D48" },
];

const cardStyle = {
  borderColor: "rgba(13,110,253,0.08)",
  boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
};

/** Turns the API's status→count map into rows with a percentage-of-total width. */
function statusRows(counts: OrderStatusCounts) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return STATUS_DISPLAY.map((s) => {
    const count = counts[s.key] ?? 0;
    return { ...s, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
}

type OverviewChartsProps = {
  chartData: ChartPoint[];
  statusCounts: OrderStatusCounts;
  ordId: string;
  qryId: string;
};

/** The bookings-vs-queries area chart and the order-status breakdown. */
export function OverviewCharts({ chartData, statusCounts, ordId, qryId }: OverviewChartsProps) {
  const orderStatus = statusRows(statusCounts);
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={cardStyle}>
        <h3 className="font-extrabold text-gray-900 mb-6">Monthly Bookings vs Queries</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={ordId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D6EFD" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0D6EFD" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={qryId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#0D6EFD"
              strokeWidth={2.5}
              fill={`url(#${ordId})`}
              name="Orders"
            />
            <Area
              type="monotone"
              dataKey="queries"
              stroke="#00B4D8"
              strokeWidth={2.5}
              fill={`url(#${qryId})`}
              name="Queries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 border" style={cardStyle}>
        <h3 className="font-extrabold text-gray-900 mb-6">Order Status</h3>
        <div className="space-y-4">
          {orderStatus.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-gray-700">{item.label}</span>
                <span className="text-gray-400">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{ background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
