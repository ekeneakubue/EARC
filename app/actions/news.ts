"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../lib/auth";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { ContentStatus } from "../lib/enums";
import { saveNewsImage } from "../lib/news-image";
import { prisma } from "../lib/prisma";
import { deletePublicObject } from "../lib/r2";

export type CreateNewsState = {
  error?: string;
  success?: boolean;
};

export type UpdateNewsState = {
  error?: string;
  success?: boolean;
};

export type DeleteNewsResult = {
  error?: string;
  success?: boolean;
};

const validStatuses = Object.values(ContentStatus);

function parseNewsFields(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const fullDescription = String(formData.get("fullDescription") ?? "").trim();
  const status = String(formData.get("status") ?? ContentStatus.DRAFT);

  if (!category || !title || !description || !fullDescription) {
    return {
      error: "Category, title, overlay text, and full news description are required.",
    } as const;
  }

  if (!validStatuses.includes(status as ContentStatus)) {
    return { error: "Invalid status selected." } as const;
  }

  return {
    category,
    title,
    description,
    fullDescription,
    status: status as ContentStatus,
  };
}

function revalidateNewsPaths(newsId?: string) {
  revalidatePath("/admin/news");
  revalidatePath("/");

  if (newsId) {
    revalidatePath(`/news/${newsId}`);
  }
}

export async function createNewsAction(
  _prevState: CreateNewsState,
  formData: FormData,
): Promise<CreateNewsState> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to add news." };
  }

  const parsed = parseNewsFields(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return { error: "News image is required." };
  }

  try {
    const lastItem = await withDbRetry(() =>
      prisma.newsItem.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      }),
    );

    const item = await withDbRetry(() =>
      prisma.newsItem.create({
        data: {
          category: parsed.category,
          title: parsed.title,
          description: parsed.description,
          fullDescription: parsed.fullDescription,
          imageUrl: "",
          status: parsed.status,
          sortOrder: (lastItem?.sortOrder ?? -1) + 1,
        },
        select: { id: true },
      }),
    );

    let imageUrl = "";

    try {
      imageUrl = await saveNewsImage(item.id, image);

      await withDbRetry(() =>
        prisma.newsItem.update({
          where: { id: item.id },
          data: { imageUrl },
        }),
      );
    } catch (error) {
      await withDbRetry(() => prisma.newsItem.delete({ where: { id: item.id } }));
      await deletePublicObject(imageUrl);
      return {
        error: error instanceof Error ? error.message : "Failed to upload news image.",
      };
    }

    revalidateNewsPaths(item.id);
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function updateNewsAction(
  _prevState: UpdateNewsState,
  formData: FormData,
): Promise<UpdateNewsState> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to update news." };
  }

  const newsId = String(formData.get("newsId") ?? "").trim();

  if (!newsId) {
    return { error: "News item not found." };
  }

  const parsed = parseNewsFields(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    const existing = await withDbRetry(() =>
      prisma.newsItem.findUnique({
        where: { id: newsId },
        select: { id: true, imageUrl: true },
      }),
    );

    if (!existing) {
      return { error: "News item not found." };
    }

    let imageUrl = existing.imageUrl;
    const previousImageUrl = existing.imageUrl;
    const image = formData.get("image");
    const replacingImage = image instanceof File && image.size > 0;

    if (replacingImage) {
      try {
        imageUrl = await saveNewsImage(newsId, image);
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Failed to upload news image.",
        };
      }
    }

    try {
      await withDbRetry(() =>
        prisma.newsItem.update({
          where: { id: newsId },
          data: {
            category: parsed.category,
            title: parsed.title,
            description: parsed.description,
            fullDescription: parsed.fullDescription,
            imageUrl,
            status: parsed.status,
          },
        }),
      );
    } catch (error) {
      if (replacingImage && imageUrl !== previousImageUrl) {
        await deletePublicObject(imageUrl);
      }

      return { error: getDbErrorMessage(error) };
    }

    if (replacingImage && previousImageUrl && previousImageUrl !== imageUrl) {
      await deletePublicObject(previousImageUrl);
    }

    revalidateNewsPaths(newsId);
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function deleteNewsAction(newsId: string): Promise<DeleteNewsResult> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to delete news." };
  }

  if (!newsId) {
    return { error: "News item not found." };
  }

  try {
    const existing = await withDbRetry(() =>
      prisma.newsItem.findUnique({
        where: { id: newsId },
        select: { id: true, imageUrl: true },
      }),
    );

    if (!existing) {
      return { error: "News item not found." };
    }

    await withDbRetry(() => prisma.newsItem.delete({ where: { id: newsId } }));
    await deletePublicObject(existing.imageUrl);

    revalidateNewsPaths(newsId);
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}
