"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Droplets } from "lucide-react";
import { useOtpInput } from "@/lib/hooks/useOtpInput";
import { LoginBrandingPanel } from "./LoginBrandingPanel";
import { LoginRoleSelector, type LoginRole } from "./LoginRoleSelector";
import { LoginOtpStep } from "./LoginOtpStep";

/** Role-aware phone + OTP login. Routes to the customer or admin dashboard. */
export function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>("customer");
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
    if (phone.length < 10) {
      setError("Enter a valid 10-digit mobile number");
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
      router.push(role === "admin" ? "/admin" : "/dashboard");
    }, 800);
  };

  const selectRole = (r: LoginRole) => {
    setRole(r);
    setStep("phone");
    setError("");
    clear();
  };
  const resend = () => {
    setTimer(30);
    setError("");
    reset();
  };
  const goBack = () => router.push("/");

  return (
    <div className="min-h-screen flex">
      <LoginBrandingPanel onBack={goBack} />

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={goBack}
            className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm mb-8"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#0D6EFD] flex items-center justify-center">
              <Droplets size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D6EFD]">GANNET™</h1>
              <p className="text-gray-400 text-sm">Premium Natural Water</p>
            </div>
          </div>

          <LoginRoleSelector role={role} onSelect={selectRole} />

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {role === "admin" ? "Admin Sign In" : "Welcome to GANNET"}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your mobile number to receive a one-time password.
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
                    onKeyDown={(e) => e.key === "Enter" && sendOTP()}
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
                    "Send OTP →"
                  )}
                </button>
              </motion.div>
            ) : (
              <LoginOtpStep
                phone={phone}
                otp={otp}
                refs={refs}
                onChange={handleChange}
                onKeyDown={handleKey}
                error={error}
                timer={timer}
                loading={loading}
                canVerify={value.length === 6}
                onVerify={verifyOTP}
                onResend={resend}
                onChangeNumber={() => {
                  setStep("phone");
                  setError("");
                  clear();
                }}
              />
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-gray-300 mt-8">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
