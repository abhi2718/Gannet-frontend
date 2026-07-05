import { RequireAuth } from "@/features/user/auth/RequireAuth";
import { UserDashboard } from "@/features/user/dashboard/UserDashboard";

export default function CustomerDashboardPage() {
  return (
    <RequireAuth role="customer">
      <UserDashboard />
    </RequireAuth>
  );
}
