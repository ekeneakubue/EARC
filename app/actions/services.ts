"use server";

import { revalidatePath } from "next/cache";
import { ServiceStatus } from "../lib/enums";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";
import { saveServiceImage } from "../lib/service-image";
import { slugify } from "../lib/slugify";

export type CreateServiceState = {
  error?: string;
  success?: boolean;
};

export type UpdateServiceState = {
  error?: string;
  success?: boolean;
};

const validStatuses = Object.values(ServiceStatus);

function parseItems(formData: FormData) {
  return formData
    .getAll("items")
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export async function createServiceAction(
  _prevState: CreateServiceState,
  formData: FormData,
): Promise<CreateServiceState> {
  const id = slugify(String(formData.get("id") ?? ""));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const items = parseItems(formData);
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const status = String(formData.get("status") ?? ServiceStatus.DRAFT);

  if (!id) {
    return { error: "Service ID (URL slug) is required." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    return { error: "Service ID must use lowercase letters, numbers, and hyphens only." };
  }

  if (!title || !description || !note) {
    return { error: "Title, description, and approach note are required." };
  }

  if (items.length === 0) {
    return { error: "Add at least one service item." };
  }

  if (!amountRaw) {
    return { error: "Amount in Naira is required." };
  }

  const amountNgn = Number.parseInt(amountRaw, 10);

  if (!Number.isFinite(amountNgn) || amountNgn < 0) {
    return { error: "Enter a valid amount in Naira." };
  }

  if (!duration) {
    return { error: "Service duration is required." };
  }

  if (!validStatuses.includes(status as ServiceStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const existingService = await withDbRetry(() =>
      prisma.service.findUnique({ where: { id } }),
    );

    if (existingService) {
      return { error: "A service with this ID already exists." };
    }

    const imageFile = formData.get("image");

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return { error: "Service image is required." };
    }

    let imageUrl: string;

    try {
      imageUrl = await saveServiceImage(id, imageFile);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to upload service image.",
      };
    }

    const lastService = await withDbRetry(() =>
      prisma.service.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      }),
    );

    await withDbRetry(() =>
      prisma.service.create({
        data: {
          id,
          title,
          description,
          note,
          items,
          amountNgn,
          duration,
          imageUrl,
          status: status as ServiceStatus,
          sortOrder: (lastService?.sortOrder ?? -1) + 1,
        },
      }),
    );

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function updateServiceAction(
  _prevState: UpdateServiceState,
  formData: FormData,
): Promise<UpdateServiceState> {
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const items = parseItems(formData);
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const status = String(formData.get("status") ?? ServiceStatus.DRAFT);

  if (!serviceId) {
    return { error: "Service ID is required." };
  }

  if (!title || !description || !note) {
    return { error: "Title, description, and approach note are required." };
  }

  if (items.length === 0) {
    return { error: "Add at least one service item." };
  }

  if (!amountRaw) {
    return { error: "Amount in Naira is required." };
  }

  const amountNgn = Number.parseInt(amountRaw, 10);

  if (!Number.isFinite(amountNgn) || amountNgn < 0) {
    return { error: "Enter a valid amount in Naira." };
  }

  if (!duration) {
    return { error: "Service duration is required." };
  }

  if (!validStatuses.includes(status as ServiceStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const existingService = await withDbRetry(() =>
      prisma.service.findUnique({ where: { id: serviceId } }),
    );

    if (!existingService) {
      return { error: "Service not found." };
    }

    let imageUrl = existingService.imageUrl;
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await saveServiceImage(serviceId, imageFile);
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Failed to upload service image.",
        };
      }
    }

    if (!imageUrl) {
      return { error: "Service image is required." };
    }

    await withDbRetry(() =>
      prisma.service.update({
        where: { id: serviceId },
        data: {
          title,
          description,
          note,
          items,
          amountNgn,
          duration,
          imageUrl,
          status: status as ServiceStatus,
        },
      }),
    );

    revalidatePath("/admin/services");
    revalidatePath(`/services/${serviceId}`);
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}
