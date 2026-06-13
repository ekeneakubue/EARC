import AdminShell from "../components/AdminShell";
import { monthlyInquiries, serviceDistribution } from "../lib/data";

export default function AdminReportsPage() {
  const maxInquiries = Math.max(...monthlyInquiries.map((m) => m.value));

  return (
    <AdminShell title="Reports" subtitle="Analytics and performance insights">
      <div className="mb-6 flex gap-2">
        {["Overview", "Inquiries", "Training", "Users"].map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              i === 0
                ? "bg-primary text-white"
                : "border border-border bg-surface text-muted hover:bg-background"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Inquiry Trends</h2>
          <p className="mb-6 text-sm text-muted">Monthly partnership requests</p>
          <div className="flex h-56 items-end gap-4">
            {monthlyInquiries.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary"
                  style={{ height: `${(item.value / maxInquiries) * 100}%`, minHeight: "12px" }}
                />
                <span className="text-xs text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Service Distribution</h2>
          <p className="mb-6 text-sm text-muted">Breakdown by service category</p>
          <div className="space-y-5">
            {serviceDistribution.map((item) => (
              <div key={item.service} className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.service}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-background">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-foreground">Key Metrics Summary</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Inquiries (YTD)", value: "241" },
              { label: "Avg. Response Time", value: "1.8 days" },
              { label: "Training Completion Rate", value: "94%" },
              { label: "Partner Retention", value: "87%" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg bg-background p-4">
                <p className="text-sm text-muted">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
