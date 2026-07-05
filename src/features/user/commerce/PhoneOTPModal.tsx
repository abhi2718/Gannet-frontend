"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, X, CheckCircle } from "lucide-react";
import { OtpBoxes } from "@/components/shared/OtpBoxes";
import { useOtpInput } from "@/lib/hooks/useOtpInput";

type PhoneOTPModalProps = {
  onSuccess: (phone: string) => void;
  onClose: () => void;
};

export function PhoneOTPModal({ onSuccess, onClose }: PhoneOTPModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { otp, refs, handleChange, handleKey, reset, clear, value } = useOtpInput();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const sendOTP = () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setTimer(30);
    }, 1000);
  };

  const verifyOTP = () => {
    if (value !== "123456") {
      setError("Invalid OTP. Use 123456 for demo.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(phone);
    }, 800);
  };

  const resend = () => {
    setTimer(30);
    setError("");
    reset();
  };

  const changeNumber = () => {
    setStep("phone");
    setError("");
    clear();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-[#0D6EFD] flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
          <Phone size={24} className="text-white" />
        </div>

        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Enter Mobile Number</h2>
              <p className="text-sm text-gray-400 mb-6">
                We will send a one-time password to verify your identity.
              </p>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="flex gap-2 mb-2">
                <div
                  className="px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-500"
                  style={{ background: "#F0F9FF" }}
                >
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  className="flex-1 px-4 py-3.5 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                  style={{ background: "#F0F9FF", border: "1.5px solid transparent" }}
                />
              </div>
              {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 mt-4"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                  boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Verify OTP</h2>
              <p className="text-sm text-gray-400 mb-0.5">6-digit code sent to</p>
              <p className="text-sm font-bold text-[#0D6EFD] mb-5">+91 {phone}</p>
              <div
                className="p-3 rounded-xl mb-5 text-xs text-center"
                style={{ background: "#EFF6FF" }}
              >
                <span className="text-gray-500">Demo OTP: </span>
                <span className="font-extrabold text-[#0D6EFD] tracking-widest">1 2 3 4 5 6</span>
              </div>
              <OtpBoxes otp={otp} refs={refs} onChange={handleChange} onKeyDown={handleKey} />
              {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
              <div className="flex items-center justify-between mb-5 mt-2">
                <span className="text-xs text-gray-400">
                  {timer > 0 ? `Resend in ${timer}s` : ""}
                </span>
                {timer === 0 && (
                  <button
                    onClick={resend}
                    className="text-xs font-bold text-[#0D6EFD] hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading || value.length < 6}
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
                onClick={changeNumber}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
              >
                ← Change number
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
