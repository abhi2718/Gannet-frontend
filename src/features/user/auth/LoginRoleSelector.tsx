"use client";

import { Users, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LoginRole = "customer" | "admin";

const ROLES: { key: LoginRole; label: string; icon: LucideIcon; desc: string }[] = [
  { key: "customer", label: "Customer", icon: Users, desc: "View my bookings" },
  { key: "admin", label: "Admin", icon: LayoutDashboard, desc: "Manage all orders" },
];

type LoginRoleSelectorProps = {
  role: LoginRole;
  onSelect: (role: LoginRole) => void;
};

/** Customer / admin role picker shown above the login form. */
export function LoginRoleSelector({ role, onSelect }: LoginRoleSelectorProps) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">I am a</p>
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => onSelect(r.key)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
            style={{
              borderColor: role === r.key ? "#0D6EFD" : "rgba(13,110,253,0.1)",
              background: role === r.key ? "#EFF6FF" : "white",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: role === r.key ? "#0D6EFD" : "#F0F9FF" }}
            >
              <r.icon size={18} style={{ color: role === r.key ? "white" : "#9CA3AF" }} />
            </div>
            <div className="text-center">
              <div
                className="font-bold text-sm"
                style={{ color: role === r.key ? "#0D6EFD" : "#374151" }}
              >
                {r.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
            </div>
            {role === r.key && <div className="w-1.5 h-1.5 rounded-full bg-[#0D6EFD]" />}
          </button>
        ))}
      </div>
    </div>
  );
}
