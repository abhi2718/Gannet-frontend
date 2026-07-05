import { RequireAuth } from "@/features/user/auth/RequireAuth";
import { Dashboard } from "@/features/admin/dashboard/Dashboard";

export default function AdminDashboardPage() {
  return (
    <RequireAuth role="admin">
      <Dashboard />
    </RequireAuth>
  );
}
