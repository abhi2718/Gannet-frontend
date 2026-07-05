import { renderHook, act } from "@testing-library/react";
import { useOtpInput } from "./useOtpInput";

describe("useOtpInput", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useOtpInput());
    expect(result.current.value).toBe("");
  });

  it("stores a single digit per box and builds the joined value", () => {
    const { result } = renderHook(() => useOtpInput());
    act(() => result.current.handleChange(0, "1"));
    act(() => result.current.handleChange(1, "2"));
    expect(result.current.value).toBe("12");
  });

  it("ignores non-numeric input", () => {
    const { result } = renderHook(() => useOtpInput());
    act(() => result.current.handleChange(0, "a"));
    expect(result.current.value).toBe("");
  });

  it("clears all boxes on reset", () => {
    const { result } = renderHook(() => useOtpInput());
    act(() => result.current.handleChange(0, "9"));
    act(() => result.current.clear());
    expect(result.current.value).toBe("");
  });
});
