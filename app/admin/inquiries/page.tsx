import AdminShell from "../components/AdminShell";
import { StatusBadge } from "../components/AdminUI";
import { recentInquiries } from "../lib/data";

export default function AdminInquiriesPage() {
  return (
    <AdminShell title="Inquiries" subtitle="Partnership and service requests">
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "New", count: 12, color: "border-blue-200 bg-blue-50" },
          { label: "In Review", count: 18, color: "border-amber-200 bg-amber-50" },
          { label: "Responded", count: 24, color: "border-emerald-200 bg-emerald-50" },
          { label: "Closed", count: 156, color: "border-slate-200 bg-slate-50" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
            <p className="text-sm font-medium text-muted">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold text-foreground">All Inquiries</h2>
          <div className="flex gap-2">
            <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
              <option>All Statuses</option>
            </select>
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white"
            >
              Export
            </button>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">Organization</th>
              <th className="px-6 py-3 font-semibold">Service</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentInquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-border last:border-0 hover:bg-background/50">
                <td className="px-6 py-4 font-mono text-xs text-muted">{inquiry.id}</td>
                <td className="px-6 py-4 font-medium text-foreground">{inquiry.name}</td>
                <td className="px-6 py-4 text-muted">{inquiry.organization}</td>
                <td className="px-6 py-4 text-muted">{inquiry.service}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={inquiry.status} />
                </td>
                <td className="px-6 py-4 text-muted">{inquiry.date}</td>
                <td className="px-6 py-4">
                  <button type="button" className="text-sm font-medium text-primary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
