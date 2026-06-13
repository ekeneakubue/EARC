import Link from "next/link";
import AdminShell from "./components/AdminShell";
import { StatusBadge } from "./components/AdminUI";
import {
  dashboardStats,
  monthlyInquiries,
  recentActivity,
  recentInquiries,
  serviceDistribution,
} from "./lib/data";

function StatCard({
  label,
  value,
  change,
  trend,
  detail,
}: (typeof dashboardStats)[number]) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${
            trend === "up" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {trend === "up" ? "↑" : "↓"} {change}
        </span>
        <span className="text-xs text-muted">{detail}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const maxInquiries = Math.max(...monthlyInquiries.map((m) => m.value));

  return (
    <AdminShell title="Dashboard" subtitle="Welcome back, Super Admin">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">
            Overview of platform activity, inquiries, and training programs.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
          >
            Export Report
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            + New Inquiry
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-foreground">Monthly Inquiries</h2>
              <p className="text-sm text-muted">Partnership & service requests</p>
            </div>
            <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="flex h-48 items-end gap-3">
            {monthlyInquiries.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{item.value}</span>
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${(item.value / maxInquiries) * 100}%`, minHeight: "8px" }}
                />
                <span className="text-xs text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Service Breakdown</h2>
          <p className="mb-6 text-sm text-muted">By inquiry type</p>
          <div className="space-y-4">
            {serviceDistribution.map((item) => (
              <div key={item.service}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-foreground">{item.service}</span>
                  <span className="font-semibold text-muted">{item.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="font-semibold text-foreground">Recent Inquiries</h2>
              <p className="text-sm text-muted">Latest partnership requests</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-sm font-medium text-primary hover:text-primary-light"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Service</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-border last:border-0 hover:bg-background/50">
                    <td className="px-6 py-4 font-mono text-xs text-muted">{inquiry.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{inquiry.name}</p>
                      <p className="text-xs text-muted">{inquiry.organization}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{inquiry.service}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-6 py-4 text-muted">{inquiry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
          <p className="mb-6 text-sm text-muted">Latest platform events</p>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted">{activity.detail}</p>
                  <p className="mt-0.5 text-xs text-muted/70">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Manage Users", href: "/admin/users", desc: "Roles & permissions" },
          { label: "Edit Content", href: "/admin/content", desc: "Website sections" },
          { label: "Training Programs", href: "/admin/training", desc: "Cohorts & enrollments" },
          { label: "System Settings", href: "/admin/settings", desc: "Site configuration" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <p className="font-semibold text-foreground group-hover:text-primary">{action.label}</p>
            <p className="mt-1 text-sm text-muted">{action.desc}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
