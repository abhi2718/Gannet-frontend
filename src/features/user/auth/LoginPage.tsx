"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";
import { AuthField } from "./AuthField";
import { LoginBrandingPanel } from "./LoginBrandingPanel";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";
import { emailError, passwordError } from "@/lib/validation";

type LoginErrors = { email?: string; password?: string; form?: string };

/** Email + password sign-in. Routes to the customer or admin dashboard by role. */
export function LoginPage() {
  const router = useRouter();
  const { login, status, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  // Already signed in? Skip the form and go straight to the right dashboard.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [status, user, router]);

  const submit = async () => {
    const next: LoginErrors = {};
    const eErr = emailError(email);
    if (eErr) next.email = eErr;
    const pErr = passwordError(password);
    if (pErr) next.password = pErr;
    if (next.email || next.password) {
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await login(email.trim(), password);
    if (!result.ok) {
      setErrors({ form: result.error });
      setLoading(false);
      return;
    }
    router.replace(result.user.role === "admin" ? "/admin" : "/dashboard");
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
              <GannetBirdIcon />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D6EFD]">GANNET™</h1>
              <p className="text-gray-400 text-sm">Pure Natural Drinking Water</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-6">
              Sign in with your email and password to continue.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <AuthField
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                error={errors.email}
                onChange={(v) => {
                  setEmail(v);
                  setErrors((p) => ({ ...p, email: undefined, form: undefined }));
                }}
              />
              <AuthField
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                error={errors.password}
                onChange={(v) => {
                  setPassword(v);
                  setErrors((p) => ({ ...p, password: undefined, form: undefined }));
                }}
              />

              {errors.form && <p className="text-xs text-red-500 mb-3">{errors.form}</p>}

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
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-[#0D6EFD] hover:underline">
                Sign up
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
