"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Send, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/features/user/auth/AuthContext";
import { useUpdateProfile } from "@/lib/query/hooks/useProfile";
import { initials } from "@/lib/format/initials";
import { FieldError } from "@/components/shared/FieldError";
import { nameError, phoneError } from "@/lib/validation";
import { ProfileAddresses } from "./ProfileAddresses";

export function ProfileView() {
  const { user, updateUser } = useAuth();
  const updateProfile = useUpdateProfile(user?.id ?? "");
  const [name, setName] = useState(user?.username ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [error, setError] = useState("");

  const email = user?.email ?? "";

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const next = {
      name: nameError(name) ?? undefined,
      phone: phoneError(phone) ?? undefined,
    };
    if (next.name || next.phone) {
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      const updated = await updateProfile.mutateAsync({
        username: name.trim(),
        phone: phone.trim(),
      });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile. Try again.");
    }
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">My Profile</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Manage your personal information and delivery addresses.
        </p>
      </div>

      <div
        className="bg-white rounded-3xl p-6 border"
        style={{
          borderColor: "rgba(13,110,253,0.08)",
          boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shrink-0"
            style={{ background: "linear-gradient(135deg,#0D6EFD,#00B4D8)" }}
          >
            {initials(name || "?")}
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">{email}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                aria-label="Full Name"
                aria-invalid={!!errors.name}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="Your full name"
                className="w-full px-4 py-3 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                style={{ background: "#F0F9FF", border: `1.5px solid ${errors.name ? "#EF4444" : "transparent"}` }}
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                aria-label="Phone Number"
                aria-invalid={!!errors.phone}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((p) => ({ ...p, phone: undefined }));
                }}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                style={{ background: "#F0F9FF", border: `1.5px solid ${errors.phone ? "#EF4444" : "transparent"}` }}
              />
              <FieldError message={errors.phone} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address <Lock size={11} className="text-gray-400" />
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                aria-label="Email Address (read-only)"
                title="Email cannot be changed"
                className="w-full px-4 py-3 text-sm rounded-2xl text-gray-400 cursor-not-allowed focus:outline-none"
                style={{ background: "#F1F5F9", border: "1.5px solid transparent" }}
              />
              <p className="text-xs text-gray-400 mt-1">
                Your email address can&apos;t be changed.
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: saved ? "#16A34A" : "#0D6EFD" }}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle size={15} /> Saved!
              </>
            ) : (
              <>
                <Send size={14} /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      <ProfileAddresses />
    </motion.div>
  );
}
