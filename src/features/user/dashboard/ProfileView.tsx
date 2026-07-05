"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Send } from "lucide-react";
import { ProfileAddresses } from "./ProfileAddresses";

const PROFILE_FIELDS: {
  label: string;
  key: "name" | "phone" | "email";
  type: string;
  placeholder: string;
}[] = [
  { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
  { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
  { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
];

export function ProfileView() {
  const [profile, setProfile] = useState({
    name: "Arjun Mehta",
    phone: "+91 99123 45678",
    email: "arjun.m@gmail.com",
  });
  const [saved, setSaved] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            AM
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg">{profile.name}</h3>
            <p className="text-gray-400 text-sm">{profile.email}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.key} className={f.key === "email" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={profile[f.key]}
                  onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                  style={{ background: "#F0F9FF", border: "1.5px solid transparent" }}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: saved ? "#16A34A" : "#0D6EFD" }}
          >
            {saved ? (
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
