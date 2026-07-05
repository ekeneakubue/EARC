"use server";

import { revalidatePath } from "next/cache";
import { TrainingStatus } from "../lib/enums";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";
import { slugify } from "../lib/slugify";

export type TrainingActionState = {
  error?: string;
  success?: boolean;
};

const validStatuses = Object.values(TrainingStatus);

function parsePositiveInt(value: string, field: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Enter a valid ${field}.`);
  }

  return parsed;
}

function parseStartDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Enter a valid start date.");
  }

  return date;
}

function normalizeProgramId(title: string, cohort: string) {
  return slugify(`${title}-${cohort}`);
}

async function ensureUniqueProgramId(baseId: string) {
  let candidate = baseId;
  let suffix = 2;

  while (
    await withDbRetry(() => prisma.trainingProgram.findUnique({ where: { id: candidate } }))
  ) {
    candidate = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createTrainingProgramAction(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const enrolledRaw = String(formData.get("enrolled") ?? "0").trim();
  const startDateRaw = String(formData.get("startDate") ?? "").trim();
  const status = String(formData.get("status") ?? TrainingStatus.DRAFT);

  if (!title || !cohort) {
    return { error: "Title and cohort are required." };
  }

  if (!capacityRaw || !startDateRaw) {
    return { error: "Capacity and start date are required." };
  }

  if (!validStatuses.includes(status as TrainingStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const capacity = parsePositiveInt(capacityRaw, "capacity");
    const enrolled = parsePositiveInt(enrolledRaw, "enrollment count");
    const startDate = parseStartDate(startDateRaw);

    if (capacity === 0) {
      return { error: "Capacity must be greater than zero." };
    }

    if (enrolled > capacity) {
      return { error: "Enrolled count cannot exceed capacity." };
    }

    const baseId = normalizeProgramId(title, cohort);

    if (!baseId) {
      return { error: "Could not generate a program ID from the title and cohort." };
    }

    const id = await ensureUniqueProgramId(baseId);

    await withDbRetry(() =>
      prisma.trainingProgram.create({
        data: {
          id,
          title,
          cohort,
          enrolled,
          capacity,
          startDate,
          status: status as TrainingStatus,
        },
      }),
    );

    revalidatePath("/admin/training");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Enter a valid")) {
      return { error: error.message };
    }

    console.error("Training program create failed:", error);
    return { error: getDbErrorMessage(error) };
  }
}

export async function updateTrainingProgramAction(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const cohort = String(formData.get("cohort") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const enrolledRaw = String(formData.get("enrolled") ?? "0").trim();
  const startDateRaw = String(formData.get("startDate") ?? "").trim();
  const status = String(formData.get("status") ?? TrainingStatus.DRAFT);

  if (!id || !title || !cohort) {
    return { error: "Program ID, title, and cohort are required." };
  }

  if (!capacityRaw || !startDateRaw) {
    return { error: "Capacity and start date are required." };
  }

  if (!validStatuses.includes(status as TrainingStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const capacity = parsePositiveInt(capacityRaw, "capacity");
    const enrolled = parsePositiveInt(enrolledRaw, "enrollment count");
    const startDate = parseStartDate(startDateRaw);

    if (capacity === 0) {
      return { error: "Capacity must be greater than zero." };
    }

    if (enrolled > capacity) {
      return { error: "Enrolled count cannot exceed capacity." };
    }

    await withDbRetry(() =>
      prisma.trainingProgram.update({
        where: { id },
        data: {
          title,
          cohort,
          enrolled,
          capacity,
          startDate,
          status: status as TrainingStatus,
        },
      }),
    );

    revalidatePath("/admin/training");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Enter a valid")) {
      return { error: error.message };
    }

    console.error("Training program update failed:", error);
    return { error: getDbErrorMessage(error) };
  }
}

export async function updateTrainingEnrollmentAction(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const enrolledRaw = String(formData.get("enrolled") ?? "").trim();
  const status = String(formData.get("status") ?? TrainingStatus.OPEN);

  if (!id) {
    return { error: "Program ID is required." };
  }

  if (!validStatuses.includes(status as TrainingStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const program = await withDbRetry(() =>
      prisma.trainingProgram.findUnique({ where: { id } }),
    );

    if (!program) {
      return { error: "Training program not found." };
    }

    const enrolled = parsePositiveInt(enrolledRaw, "enrollment count");

    if (enrolled > program.capacity) {
      return { error: "Enrolled count cannot exceed capacity." };
    }

    await withDbRetry(() =>
      prisma.trainingProgram.update({
        where: { id },
        data: {
          enrolled,
          status: status as TrainingStatus,
        },
      }),
    );

    revalidatePath("/admin/training");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Enter a valid")) {
      return { error: error.message };
    }

    console.error("Training enrollment update failed:", error);
    return { error: getDbErrorMessage(error) };
  }
}
