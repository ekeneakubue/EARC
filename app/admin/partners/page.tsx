import AdminShell from "../components/AdminShell";
import { StatusBadge } from "../components/AdminUI";
import { partners } from "../lib/data";

export default function AdminPartnersPage() {
  return (
    <AdminShell title="Partners" subtitle="Manage institutional partnerships">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Add Partner
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-semibold">Organization</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Region</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-border last:border-0 hover:bg-background/50">
                <td className="px-6 py-4 font-medium text-foreground">{partner.name}</td>
                <td className="px-6 py-4 text-muted">{partner.type}</td>
                <td className="px-6 py-4 text-muted">{partner.region}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={partner.status} />
                </td>
                <td className="px-6 py-4">
                  <button type="button" className="text-sm font-medium text-primary">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
