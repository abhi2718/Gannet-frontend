import { useRef, useState } from "react";

const EMPTY_OTP = ["", "", "", "", "", ""];

/**
 * Manages the 6-digit OTP input: value array, per-box refs, auto-advance on
 * entry, and backspace-to-previous. Shared by the login and checkout flows.
 */
export function useOtpInput() {
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = val.slice(-1);
      return next;
    });
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const reset = () => {
    setOtp(EMPTY_OTP);
    refs.current[0]?.focus();
  };

  const clear = () => setOtp(EMPTY_OTP);

  return { otp, refs, handleChange, handleKey, reset, clear, value: otp.join("") };
}
