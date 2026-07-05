"use client";

import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { OtpBoxes } from "@/components/shared/OtpBoxes";

type LoginOtpStepProps = {
  phone: string;
  otp: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (idx: number, val: string) => void;
  onKeyDown: (idx: number, e: React.KeyboardEvent) => void;
  error: string;
  timer: number;
  loading: boolean;
  canVerify: boolean;
  onVerify: () => void;
  onResend: () => void;
  onChangeNumber: () => void;
};

/** The OTP verification step of the login flow. */
export function LoginOtpStep(props: LoginOtpStepProps) {
  const { phone, otp, refs, onChange, onKeyDown, error, timer, loading, canVerify } = props;
  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Verify OTP</h2>
      <p className="text-gray-400 text-sm mb-1">6-digit code sent to</p>
      <p className="text-sm font-bold text-[#0D6EFD] mb-5">+91 {phone}</p>
      <div className="p-3 rounded-xl mb-5 text-xs text-center" style={{ background: "#EFF6FF" }}>
        <span className="text-gray-500">Demo OTP: </span>
        <span className="font-extrabold text-[#0D6EFD] tracking-widest">1 2 3 4 5 6</span>
      </div>
      <OtpBoxes otp={otp} refs={refs} onChange={onChange} onKeyDown={onKeyDown} />
      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
      <div className="flex items-center justify-between mb-5 mt-2">
        <span className="text-xs text-gray-400">{timer > 0 ? `Resend in ${timer}s` : ""}</span>
        {timer === 0 && (
          <button
            onClick={props.onResend}
            className="text-xs font-bold text-[#0D6EFD] hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
      <button
        onClick={props.onVerify}
        disabled={loading || !canVerify}
        className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
          boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
        }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <CheckCircle size={16} /> Verify &amp; Continue
          </>
        )}
      </button>
      <button
        onClick={props.onChangeNumber}
        className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
      >
        ← Change number
      </button>
    </motion.div>
  );
}
