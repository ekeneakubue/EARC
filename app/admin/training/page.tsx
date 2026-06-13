import AdminShell from "../components/AdminShell";
import { StatusBadge } from "../components/AdminUI";
import { trainingPrograms } from "../lib/data";

export default function AdminTrainingPage() {
  return (
    <AdminShell title="Training Programs" subtitle="Manage cohorts and enrollments">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{trainingPrograms.length} active programs</p>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Create Program
        </button>
      </div>

      <div className="space-y-4">
        {trainingPrograms.map((program) => {
          const fillRate = Math.round((program.enrolled / program.capacity) * 100);

          return (
            <div
              key={program.id}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{program.title}</h3>
                    <StatusBadge status={program.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {program.cohort} · Starts {program.startDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background">
                    Manage
                  </button>
                  <button type="button" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    Enrollments
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted">
                    {program.enrolled} / {program.capacity} enrolled
                  </span>
                  <span className="font-semibold text-foreground">{fillRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${fillRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
