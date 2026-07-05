"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Clock, CheckCircle, UserCheck } from "lucide-react";
import { useAdminQueries } from "@/lib/query/hooks/useAdminQueries";
import { useAdminChart } from "@/lib/query/hooks/useAdminChart";
import { OverviewCharts } from "./OverviewCharts";
import { OverviewRecentQueries } from "./OverviewRecentQueries";

const STATS = [
  {
    label: "Total Bookings",
    value: "1,284",
    delta: "+12.4%",
    icon: ShoppingCart,
    color: "#0D6EFD",
    bg: "#EFF6FF",
  },
  {
    label: "Pending Orders",
    value: "47",
    delta: "-3.2%",
    icon: Clock,
    color: "#D97706",
    bg: "#FFF7ED",
  },
  {
    label: "Completed Orders",
    value: "1,190",
    delta: "+8.7%",
    icon: CheckCircle,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    label: "Total Customers",
    value: "380",
    delta: "+21.5%",
    icon: UserCheck,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

export function DashboardOverview() {
  const uid = useId().replace(/:/g, "");
  const ordId = `ordGrad-${uid}`;
  const qryId = `qryGrad-${uid}`;
  const { data: queries = [] } = useAdminQueries();
  const { data: chartData = [] } = useAdminChart();
  const newCount = queries.filter((q) => q.status === "new").length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">
          Welcome back, Admin. Here is what is happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 border"
            style={{
              borderColor: "rgba(13,110,253,0.08)",
              boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{
                  background: s.delta.startsWith("+") ? "#F0FDF4" : "#FFF1F2",
                  color: s.delta.startsWith("+") ? "#16A34A" : "#E11D48",
                }}
              >
                {s.delta}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <OverviewCharts chartData={chartData} ordId={ordId} qryId={qryId} />
      <OverviewRecentQueries queries={queries} newCount={newCount} />
    </div>
  );
}
