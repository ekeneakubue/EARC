"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateTrainingProgramAction,
  type TrainingActionState,
} from "../../actions/training";
import { TrainingStatus, trainingStatusLabels } from "../../lib/enums";
import type { TrainingProgramRow } from "./TrainingManager";

type EditTrainingModalProps = {
  program: TrainingProgramRow | null;
  onClose: () => void;
};

const initialState: TrainingActionState = {};

const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const readOnlyClassName =
  "w-full cursor-not-allowed rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-muted outline-none";

function EditTrainingForm({
  program,
  onClose,
}: {
  program: TrainingProgramRow;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateTrainingProgramAction, initialState);

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
        <div>
          <label htmlFor="edit-program-id" className="mb-1.5 block text-sm font-medium text-foreground">
            Program ID
          </label>
          <input id="edit-program-id" value={program.id} readOnly className={readOnlyClassName} />
        </div>

        <div>
          <label htmlFor="edit-training-title" className="mb-1.5 block text-sm font-medium text-foreground">
            Program title
          </label>
          <input
            id="edit-training-title"
            name="title"
            type="text"
            defaultValue={program.title}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="edit-training-cohort" className="mb-1.5 block text-sm font-medium text-foreground">
            Cohort
          </label>
          <input
            id="edit-training-cohort"
            name="cohort"
            type="text"
            defaultValue={program.cohort}
            required
            className={inputClassName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-training-capacity" className="mb-1.5 block text-sm font-medium text-foreground">
              Capacity
            </label>
            <input
              id="edit-training-capacity"
              name="capacity"
              type="number"
              min={1}
              defaultValue={program.capacity}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="edit-training-enrolled" className="mb-1.5 block text-sm font-medium text-foreground">
              Enrolled
            </label>
            <input
              id="edit-training-enrolled"
              name="enrolled"
              type="number"
              min={0}
              defaultValue={program.enrolled}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-training-start-date" className="mb-1.5 block text-sm font-medium text-foreground">
            Start date
          </label>
          <input
            id="edit-training-start-date"
            name="startDate"
            type="date"
            defaultValue={program.startDateInput}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="edit-training-status" className="mb-1.5 block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="edit-training-status"
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
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditTrainingModal({ program, onClose }: EditTrainingModalProps) {
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
        aria-label="Close edit program modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-bold text-foreground">Manage Program</h2>
          <p className="mt-1 text-sm text-muted">{program.title}</p>
        </div>

        <EditTrainingForm key={program.id} program={program} onClose={onClose} />
      </div>
    </div>
  );
}
