"use client";

import { useState } from "react";
import type { TrainingStatus } from "../../lib/enums";
import { trainingStatusLabels } from "../../lib/enums";
import { StatusBadge } from "../components/AdminUI";
import AddTrainingModal from "./AddTrainingModal";
import EditTrainingModal from "./EditTrainingModal";
import EnrollmentsModal from "./EnrollmentsModal";

export type TrainingProgramRow = {
  id: string;
  title: string;
  cohort: string;
  enrolled: number;
  capacity: number;
  startDate: string;
  startDateInput: string;
  status: TrainingStatus;
};

type TrainingManagerProps = {
  programs: TrainingProgramRow[];
};

export default function TrainingManager({ programs }: TrainingManagerProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<TrainingProgramRow | null>(null);
  const [programToManageEnrollments, setProgramToManageEnrollments] =
    useState<TrainingProgramRow | null>(null);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{programs.length} training programs</p>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Create Program
        </button>
      </div>

      <div className="space-y-4">
        {programs.map((program) => {
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
                    <StatusBadge status={trainingStatusLabels[program.status]} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {program.cohort} · Starts {program.startDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProgramToEdit(program)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgramToManageEnrollments(program)}
                    className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                  >
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

      <AddTrainingModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditTrainingModal program={programToEdit} onClose={() => setProgramToEdit(null)} />
      <EnrollmentsModal
        program={programToManageEnrollments}
        onClose={() => setProgramToManageEnrollments(null)}
      />
    </>
  );
}
