"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Loader } from "@/components/shared/Loader";
import { useAdminOrders } from "@/lib/query/hooks/useAdminOrders";
import { useDeleteOrder } from "@/lib/query/hooks/useOrderMutations";
import { usePagination } from "@/lib/hooks/usePagination";
import type { AdminOrder } from "@/types";
import { OrderEditModal } from "./OrderEditModal";

const COLUMNS = [
  "Order ID",
  "Customer",
  "Phone",
  "Bottle Size",
  "Qty",
  "Date",
  "Status",
  "Actions",
];
const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

const optionLabel = (opt: string) =>
  opt === "all"
    ? "All Status"
    : opt
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

export function OrdersView() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const deleteOrder = useDeleteOrder();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editOrder, setEditOrder] = useState<AdminOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);

  const filtered = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())),
  );
  const { page, setPage, totalPages, pageItems } = usePagination(filtered);

  if (isLoading) return <Loader label="Loading orders..." />;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteOrder.mutateAsync(deleteTarget.mongoId);
    setDeleteTarget(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">All Orders</h2>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} orders in system</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] w-56"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by status"
            className="px-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {optionLabel(opt)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="bg-white rounded-2xl border overflow-hidden"
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
              {pageItems.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-blue-50/30 transition-colors"
                  style={{ borderColor: "rgba(13,110,253,0.05)" }}
                >
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{o.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {o.customer}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{o.phone}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {o.items.map((it, i) => (
                      <div key={i} className="whitespace-nowrap">
                        {it.size}
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-gray-900 font-semibold">
                    {o.items.map((it, i) => (
                      <div key={i}>{it.qty}</div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditOrder(o)}
                        aria-label={`Edit ${o.id}`}
                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors"
                      >
                        <Edit2 size={14} className="text-amber-500" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(o)}
                        aria-label={`Delete ${o.id}`}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No orders match your search.
          </div>
        ) : (
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            label={`${filtered.length} orders · Page ${page} of ${totalPages}`}
          />
        )}
      </div>

      <AnimatePresence>
        {editOrder && <OrderEditModal order={editOrder} onClose={() => setEditOrder(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            title="Delete order"
            message={`Delete order ${deleteTarget.id} for ${deleteTarget.customer}? This can't be undone.`}
            loading={deleteOrder.isPending}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
