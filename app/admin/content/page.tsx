import AdminShell from "../components/AdminShell";
import { StatusBadge } from "../components/AdminUI";
import { contentPages } from "../lib/data";

export default function AdminContentPage() {
  return (
    <AdminShell title="Content" subtitle="Manage website sections and pages">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + New Section
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contentPages.map((page) => (
          <div
            key={page.id}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="rounded-md bg-background px-2 py-1 text-xs font-medium text-muted">
                {page.section}
              </span>
              <StatusBadge status={page.status} />
            </div>
            <h3 className="font-semibold text-foreground">{page.title}</h3>
            <p className="mt-1 text-xs text-muted">Updated {page.updated}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-background"
              >
                Edit
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/20"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
