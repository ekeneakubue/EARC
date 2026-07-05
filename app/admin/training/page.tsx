import AdminShell from "../components/AdminShell";
import { getDbErrorMessage, withDbRetry } from "../../lib/db";
import { prisma } from "../../lib/prisma";
import {
  formatTrainingStartDate,
  toDateInputValue,
} from "../../lib/training-programs";
import TrainingManager, { type TrainingProgramRow } from "./TrainingManager";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  try {
    const programs = await withDbRetry(() =>
      prisma.trainingProgram.findMany({
        orderBy: [{ startDate: "asc" }, { title: "asc" }],
      }),
    );

    const rows: TrainingProgramRow[] = programs.map((program) => ({
      id: program.id,
      title: program.title,
      cohort: program.cohort,
      enrolled: program.enrolled,
      capacity: program.capacity,
      startDate: formatTrainingStartDate(program.startDate),
      startDateInput: toDateInputValue(program.startDate),
      status: program.status,
    }));

    return (
      <AdminShell title="Training Programs" subtitle="Manage cohorts and enrollments">
        <TrainingManager programs={rows} />
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell title="Training Programs" subtitle="Manage cohorts and enrollments">
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
