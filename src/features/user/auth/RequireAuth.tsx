"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets } from "lucide-react";
import { useAuth, type Role } from "./AuthContext";

/** Full-screen brand spinner shown while auth resolves or a redirect runs. */
function AuthGate() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#F0F9FF" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#0D6EFD] flex items-center justify-center animate-pulse">
        <Droplets size={22} className="text-white" />
      </div>
      <div className="w-6 h-6 border-2 border-[#0D6EFD]/30 border-t-[#0D6EFD] rounded-full animate-spin" />
    </div>
  );
}

type RequireAuthProps = {
  role: Role;
  children: React.ReactNode;
};

/**
 * Route guard. Sends unauthenticated visitors to the login page and users whose
 * role does not match to their own dashboard. Renders `children` only once an
 * authenticated user with the required `role` is confirmed.
 */
export function RequireAuth({ role, children }: RequireAuthProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [status, user, role, router]);

  if (status !== "authenticated" || !user || user.role !== role) {
    return <AuthGate />;
  }
  return <>{children}</>;
}
