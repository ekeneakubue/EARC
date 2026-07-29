import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import { getDashboardData } from "../lib/dashboard-data";
import { userRoleLabels } from "../lib/enums";
import AdminShell from "./components/AdminShell";
import DashboardContent from "./components/DashboardContent";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const data = await getDashboardData();

  return (
    <AdminShell
      title="Dashboard"
      subtitle={`Welcome back, ${userRoleLabels[session.role]}`}
    >
      <DashboardContent data={data} session={session} />
    </AdminShell>
  );
}
