"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";
import { LoginBrandingPanel } from "./LoginBrandingPanel";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";
import { RegisterFields, type RegisterValues } from "./RegisterFields";
import { nameError, phoneError, emailError, passwordError } from "@/lib/validation";

type RegisterErrors = Partial<Record<keyof RegisterValues, string>> & { form?: string };

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
  const [errors, setErrors] = useState<RegisterErrors>({});

  // Already signed in? There's nothing to register — go to the dashboard.
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [status, user, router]);

  const validate = (): RegisterErrors => {
    const next: RegisterErrors = {};
    const nErr = nameError(name);
    if (nErr) next.name = nErr;
    const phErr = phoneError(phone);
    if (phErr) next.phone = phErr;
    const eErr = emailError(email);
    if (eErr) next.email = eErr;
    const pErr = passwordError(password);
    if (pErr) next.password = pErr;
    else if (password !== confirm) next.confirm = "Passwords do not match.";
    return next;
  };

  const submit = async () => {
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await register({
      username: name.trim(),
      email: email.trim(),
      password,
      phone,
    });
    if (!result.ok) {
      setErrors({ form: result.error });
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
  };

  // Update a field, normalising the phone to digits, and clear its error.
  const setField = (field: keyof RegisterValues, value: string) => {
    const setters: Record<keyof RegisterValues, (v: string) => void> = {
      name: setName,
      phone: (v) => setPhone(v.replace(/\D/g, "").slice(0, 10)),
      email: setEmail,
      password: setPassword,
      confirm: setConfirm,
    };
    setters[field](value);
    setErrors((p) => ({ ...p, [field]: undefined, form: undefined }));
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
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h2>
            <p className="text-gray-400 text-sm mb-6">
              Join GANNET to book water and track your orders.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <RegisterFields
                values={{ name, phone, email, password, confirm }}
                errors={errors}
                onChange={setField}
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
