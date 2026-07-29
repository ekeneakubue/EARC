import Image from "next/image";
import Link from "next/link";
import type { SessionUser } from "../../lib/auth";
import { userRoleLabels } from "../../lib/enums";
import { getAdminPortalLabel } from "../../lib/user-permissions";
import type { DashboardData } from "../../lib/dashboard-data";

type DashboardContentProps = {
  data: DashboardData;
  session: SessionUser;
};

function StatCard({
  label,
  value,
  change,
  trend,
  detail,
}: DashboardData["stats"][number]) {
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

export default function DashboardContent({ data, session }: DashboardContentProps) {
  const roleLabel = userRoleLabels[session.role];

  return (
    <>
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-primary-dark text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.35) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(26, 107, 107, 0.45) 0%, transparent 40%)
            `,
          }}
        />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Image
              src="/images/logo.png"
              alt="EARC Logo"
              width={56}
              height={56}
              className="hidden rounded-full bg-white p-1 sm:block"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-light">
                {getAdminPortalLabel(session.role)}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                Welcome back, {session.name.split(" ")[0]}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                Overview of platform activity, training programs, and website content.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  {roleLabel}
                </span>
                {["Users", "Services", "Content", "Training"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Service Catalog</h2>
          <p className="mb-6 text-sm text-muted">By publication status</p>
          <div className="space-y-4">
            {data.serviceDistribution.map((item) => (
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

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
          <p className="mb-6 text-sm text-muted">Latest platform events</p>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
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
    </>
  );
}
