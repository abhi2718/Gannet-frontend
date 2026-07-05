"use client";

import { useState } from "react";
import { Search, Eye, Edit2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAdminQueries } from "@/lib/query/hooks/useAdminQueries";

const COLUMNS = ["ID", "Name", "Mobile", "Email", "City", "Queries", "Date", "Status", "Actions"];
const STATUS_OPTIONS = ["all", "new", "contacted", "converted"];

export function QueriesView() {
  const { data: queries = [] } = useAdminQueries();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = queries.filter(
    (q) =>
      (filter === "all" || q.status === filter) &&
      (q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.city.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">All Queries</h2>
          <p className="text-gray-500 text-sm mt-0.5">{queries.length} total inquiries received</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries..."
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
                {opt === "all" ? "All Status" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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
              {filtered.map((q) => (
                <tr
                  key={q.id}
                  className="border-t hover:bg-blue-50/30 transition-colors"
                  style={{ borderColor: "rgba(13,110,253,0.05)" }}
                >
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{q.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {q.name}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{q.mobile}</td>
                  <td className="px-5 py-4 text-gray-500">{q.email}</td>
                  <td className="px-5 py-4 text-gray-500">{q.city}</td>
                  <td className="px-5 py-4 text-gray-500">{q.requirement}</td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{q.date}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        aria-label="View"
                        className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      >
                        <Eye size={14} className="text-[#0D6EFD]" />
                      </button>
                      <button
                        aria-label="Edit"
                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors"
                      >
                        <Edit2 size={14} className="text-amber-500" />
                      </button>
                      <button
                        aria-label="Delete"
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
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">
            No queries match your search.
          </div>
        )}
      </div>
    </div>
  );
}
