"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, Droplets, User, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";
import { AuthField } from "./AuthField";
import { LoginBrandingPanel } from "./LoginBrandingPanel";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Create a customer account: name, phone, email, password + confirm password. */
export function RegisterPage() {
  const router = useRouter();
  const { register, status, user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already signed in? There's nothing to register — go to the dashboard.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [status, user, router]);

  const validate = (): string | null => {
    if (name.trim().length < 2) return "Enter your full name.";
    if (!/^\d{10}$/.test(phone)) return "Enter a valid 10-digit phone number.";
    if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const submit = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    // Simulate a network round-trip for the mock sign-up.
    window.setTimeout(() => {
      const result = register({ username: name, email, password, phone });
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.replace("/dashboard");
    }, 500);
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

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h2>
            <p className="text-gray-400 text-sm mb-6">
              Join GANNET to book water and track your orders.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <AuthField
                id="name"
                label="Full Name"
                icon={User}
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(v) => {
                  setName(v);
                  setError("");
                }}
              />
              <AuthField
                id="phone"
                label="Phone Number"
                icon={Phone}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                prefix="+91"
                maxLength={10}
                placeholder="XXXXX XXXXX"
                value={phone}
                onChange={(v) => {
                  setPhone(v.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
              />
              <AuthField
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setError("");
                }}
              />
              <AuthField
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setError("");
                }}
              />
              <AuthField
                id="confirm"
                label="Confirm Password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(v) => {
                  setConfirm(v);
                  setError("");
                }}
              />

              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70 mt-2"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                  boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#0D6EFD] hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>

          <p className="text-center text-xs text-gray-300 mt-8">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
