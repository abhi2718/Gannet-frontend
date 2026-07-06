"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable pager footer for the dashboard tables. Presentational: the parent
 * owns the page state (via `usePagination`) and passes it down.
 */
export function TablePagination({
  page,
  totalPages,
  onPageChange,
  label,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  return (
    <div
      className="px-5 py-4 border-t flex items-center justify-between gap-3"
      style={{ borderColor: "rgba(13,110,253,0.06)", background: "#F8FAFC" }}
    >
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
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
            onClick={() => onPageChange(pi + 1)}
            aria-label={`Page ${pi + 1}`}
            aria-current={page === pi + 1 ? "page" : undefined}
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
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:bg-blue-50"
          style={{ border: "1.5px solid rgba(13,110,253,0.15)" }}
        >
          <ChevronRight size={15} className="text-[#0D6EFD]" />
        </button>
      </div>
    </div>
  );
}
