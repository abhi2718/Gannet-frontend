import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GANNET — Admin Dashboard",
};

/**
 * Layout for the admin surface. A natural place to add admin-only auth guards
 * or providers later; kept minimal for now.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
