"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateTrainingEnrollmentAction,
  type TrainingActionState,
} from "../../actions/training";
import { TrainingStatus, trainingStatusLabels } from "../../lib/enums";
import type { TrainingProgramRow } from "./TrainingManager";

type EnrollmentsModalProps = {
  program: TrainingProgramRow | null;
  onClose: () => void;
};

const initialState: TrainingActionState = {};

const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function EnrollmentsForm({
  program,
  onClose,
}: {
  program: TrainingProgramRow;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateTrainingEnrollmentAction, initialState);
  const fillRate = Math.round((program.enrolled / program.capacity) * 100);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="id" value={program.id} />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <p className="text-sm font-medium text-foreground">{program.title}</p>
          <p className="mt-1 text-sm text-muted">{program.cohort}</p>
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

        <div>
          <label htmlFor="enrollment-count" className="mb-1.5 block text-sm font-medium text-foreground">
            Enrolled participants
          </label>
          <input
            id="enrollment-count"
            name="enrolled"
            type="number"
            min={0}
            max={program.capacity}
            defaultValue={program.enrolled}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="enrollment-status" className="mb-1.5 block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="enrollment-status"
            name="status"
            defaultValue={program.status}
            className={inputClassName}
          >
            {Object.values(TrainingStatus).map((status) => (
              <option key={status} value={status}>
                {trainingStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        {state.error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
        >
          {pending ? "Saving..." : "Update enrollments"}
        </button>
      </div>
    </form>
  );
}

export default function EnrollmentsModal({ program, onClose }: EnrollmentsModalProps) {
  useEffect(() => {
    if (!program) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [program, onClose]);

  if (!program) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close enrollments modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-bold text-foreground">Enrollments</h2>
          <p className="mt-1 text-sm text-muted">Update participant count and availability status.</p>
        </div>

        <EnrollmentsForm key={`${program.id}-${program.enrolled}`} program={program} onClose={onClose} />
      </div>
    </div>
  );
}
