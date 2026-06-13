import AdminShell from "../components/AdminShell";
import { prisma } from "../../lib/prisma";
import UsersManager from "./UsersManager";

function formatLastActive(date: Date | null) {
  if (!date) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      lastActiveAt: true,
    },
  });

  const rows = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActive: formatLastActive(user.lastActiveAt),
  }));

  return (
    <AdminShell title="Users" subtitle="Manage admin accounts and roles">
      <UsersManager users={rows} />
    </AdminShell>
  );
}
