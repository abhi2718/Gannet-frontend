"use client";

import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Query } from "@/types";

const COLUMNS = ["Name", "City", "Queries", "Date", "Status"];

type OverviewRecentQueriesProps = {
  queries: Query[];
  newCount: number;
};

/** Recent-queries preview table for the admin overview. */
export function OverviewRecentQueries({ queries, newCount }: OverviewRecentQueriesProps) {
  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{
        borderColor: "rgba(13,110,253,0.08)",
        boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
      }}
    >
      <div
        className="p-6 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(13,110,253,0.06)" }}
      >
        <h3 className="font-extrabold text-gray-900">Recent Queries</h3>
        <span className="text-xs font-bold text-[#0D6EFD] bg-blue-50 px-3 py-1.5 rounded-full">
          {newCount} New
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: "#F8FAFC" }}>
            <tr>
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queries.slice(0, 5).map((q) => (
              <tr
                key={q.id}
                className="border-t hover:bg-blue-50/30 transition-colors"
                style={{ borderColor: "rgba(13,110,253,0.05)" }}
              >
                <td className="px-6 py-4 font-semibold text-gray-900">{q.name}</td>
                <td className="px-6 py-4 text-gray-500">{q.city}</td>
                <td className="px-6 py-4 text-gray-500">{q.requirement}</td>
                <td className="px-6 py-4 text-gray-400">{q.date}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={q.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
