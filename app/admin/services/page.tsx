import AdminShell from "../components/AdminShell";
import { getDbErrorMessage, withDbRetry } from "../../lib/db";
import { prisma } from "../../lib/prisma";
import ServicesManager from "./ServicesManager";

export default async function AdminServicesPage() {
  try {
    const services = await withDbRetry(() =>
      prisma.service.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          note: true,
          items: true,
          amountNgn: true,
          duration: true,
          imageUrl: true,
          status: true,
        },
      }),
    );

    return (
      <AdminShell title="Services" subtitle="Manage EARC service offerings">
        <ServicesManager services={services} />
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell title="Services" subtitle="Manage EARC service offerings">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700"
        >
          {getDbErrorMessage(error)}
        </div>
      </AdminShell>
    );
  }
}
