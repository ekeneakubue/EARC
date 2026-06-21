import { ServiceStatus } from "./enums";
import { formatNairaAmount } from "./format";
import { getServiceById as getContentServiceById, services as contentServices } from "./content";
import { withDbRetry } from "./db";
import { prisma } from "./prisma";

export type PublicService = {
  id: string;
  title: string;
  description: string;
  note: string;
  items: string[];
  amount?: string;
  duration?: string;
  imageUrl?: string | null;
};

export async function getPublicServiceById(id: string): Promise<PublicService | null> {
  try {
    const dbService = await withDbRetry(() =>
      prisma.service.findUnique({
        where: { id },
      }),
    );

    if (dbService) {
      return {
        id: dbService.id,
        title: dbService.title,
        description: dbService.description,
        note: dbService.note,
        items: dbService.items,
        amount:
          dbService.amountNgn != null ? formatNairaAmount(dbService.amountNgn) : undefined,
        duration: dbService.duration ?? undefined,
        imageUrl: dbService.imageUrl,
      };
    }
  } catch {
    // Fall back to static content when the database is unavailable.
  }

  const contentService = getContentServiceById(id);

  if (!contentService) {
    return null;
  }

  return {
    id: contentService.id,
    title: contentService.title,
    description: contentService.description,
    note: contentService.note,
    items: [...contentService.items],
    amount: contentService.amount,
    duration: contentService.duration,
  };
}

export async function getAllPublicServiceIds(): Promise<string[]> {
  const ids = new Set(contentServices.map((service) => service.id));

  try {
    const dbServices = await withDbRetry(() =>
      prisma.service.findMany({
        where: { status: ServiceStatus.PUBLISHED },
        select: { id: true },
      }),
    );

    for (const service of dbServices) {
      ids.add(service.id);
    }
  } catch {
    // Use static content IDs only.
  }

  return Array.from(ids);
}

export async function getRelatedPublicServices(
  currentId: string,
  limit = 3,
): Promise<PublicService[]> {
  try {
    const dbServices = await withDbRetry(() =>
      prisma.service.findMany({
        where: {
          id: { not: currentId },
          status: ServiceStatus.PUBLISHED,
        },
        orderBy: { sortOrder: "asc" },
        take: limit,
      }),
    );

    if (dbServices.length > 0) {
      return dbServices.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        note: service.note,
        items: service.items,
        amount:
          service.amountNgn != null ? formatNairaAmount(service.amountNgn) : undefined,
        duration: service.duration ?? undefined,
        imageUrl: service.imageUrl,
      }));
    }
  } catch {
    // Fall back to static content.
  }

  return contentServices
    .filter((service) => service.id !== currentId)
    .slice(0, limit)
    .map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      note: service.note,
      items: [...service.items],
      amount: service.amount,
      duration: service.duration,
    }));
}
