"use client";

import { useEffect, useState } from "react";

/** Default rows-per-page for the admin dashboard tables. */
export const TABLE_PAGE_SIZE = 8;

/**
 * Client-side pagination over an in-memory list (the admin tables already hold
 * every row for search/filter, so we page the filtered array here rather than
 * round-tripping to the API). Returns the current page's slice plus the controls
 * a `TablePagination` footer needs. When the list shrinks (e.g. after filtering)
 * the page is clamped so we never strand the user on an empty page.
 */
export function usePagination<T>(items: T[], pageSize: number = TABLE_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return { page: current, setPage, totalPages, pageItems };
}
