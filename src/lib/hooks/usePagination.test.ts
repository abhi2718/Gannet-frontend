import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("slices the current page and tracks total pages", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 4));
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual([0, 1, 2, 3]);
    act(() => result.current.setPage(2));
    expect(result.current.pageItems).toEqual([4, 5, 6, 7]);
  });

  it("clamps the page when the list shrinks (e.g. after filtering)", () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 4), {
      initialProps: { items: Array.from({ length: 10 }, (_, i) => i) },
    });
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
    rerender({ items: [0, 1] });
    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toEqual([0, 1]);
  });

  it("always reports at least one page for an empty list", () => {
    const { result } = renderHook(() => usePagination([] as number[], 4));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });
});
