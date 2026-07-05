"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CONTENT_SECTIONS, type ContentSectionId } from "../lib/content-sections";
import { ContentStatus } from "../lib/enums";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";

export type UpdateContentState = {
  error?: string;
  success?: boolean;
};

const validStatuses = Object.values(ContentStatus);
const editableSectionIds = new Set<ContentSectionId>(["hero", "about", "story", "contact"]);

function parseList(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function parseHeroData(formData: FormData) {
  return {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    intro: String(formData.get("intro") ?? "").trim(),
  };
}

function parseAboutData(formData: FormData) {
  return {
    title: String(formData.get("contentTitle") ?? "").trim(),
    paragraphs: parseList(formData, "paragraphs"),
  };
}

function parseStoryData(formData: FormData) {
  const titles = parseList(formData, "chapterTitles");
  const paragraphs = parseList(formData, "chapterParagraphs");
  const images = formData.getAll("chapterImages").map((value) => String(value).trim());
  const alts = formData.getAll("chapterAlts").map((value) => String(value).trim());
  const count = Math.max(titles.length, paragraphs.length, images.length, alts.length);

  const chapters = Array.from({ length: count }, (_, index) => ({
    chapter: index + 1,
    title: titles[index] ?? "",
    paragraph: paragraphs[index] ?? "",
    image: images[index] ?? "",
    alt: alts[index] ?? "",
  })).filter((chapter) => chapter.title || chapter.paragraph);

  return {
    title: String(formData.get("contentTitle") ?? "").trim(),
    chapters,
  };
}

function parseContactData(formData: FormData) {
  return {
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("contentTitle") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    collaborationTitle: String(formData.get("collaborationTitle") ?? "").trim(),
    collaborationItems: parseList(formData, "collaborationItems"),
  };
}

function validateSectionData(id: ContentSectionId, data: Record<string, unknown>) {
  if (id === "hero") {
    const hero = data as ReturnType<typeof parseHeroData>;
    if (!hero.name || !hero.tagline || !hero.intro) {
      return "Hero name, tagline, and intro are required.";
    }
  }

  if (id === "about") {
    const about = data as ReturnType<typeof parseAboutData>;
    if (!about.title || about.paragraphs.length === 0) {
      return "About title and at least one paragraph are required.";
    }
  }

  if (id === "story") {
    const story = data as ReturnType<typeof parseStoryData>;
    if (!story.title || story.chapters.length === 0) {
      return "Story title and at least one chapter are required.";
    }
  }

  if (id === "contact") {
    const contact = data as ReturnType<typeof parseContactData>;
    if (!contact.title || !contact.description || contact.collaborationItems.length === 0) {
      return "Contact title, description, and collaboration items are required.";
    }
  }

  return null;
}

export async function updateContentSectionAction(
  _prevState: UpdateContentState,
  formData: FormData,
): Promise<UpdateContentState> {
  const id = String(formData.get("id") ?? "") as ContentSectionId;
  const title = String(formData.get("cardTitle") ?? "").trim();
  const section = String(formData.get("sectionLabel") ?? "").trim();
  const status = String(formData.get("status") ?? ContentStatus.DRAFT);

  if (!editableSectionIds.has(id)) {
    return { error: "This section cannot be edited here." };
  }

  if (!title || !section) {
    return { error: "Title and section label are required." };
  }

  if (!validStatuses.includes(status as ContentStatus)) {
    return { error: "Invalid status selected." };
  }

  let data: Record<string, unknown>;

  switch (id) {
    case "hero":
      data = parseHeroData(formData);
      break;
    case "about":
      data = parseAboutData(formData);
      break;
    case "story":
      data = parseStoryData(formData);
      break;
    case "contact":
      data = parseContactData(formData);
      break;
    default:
      return { error: "Unsupported content section." };
  }

  const validationError = validateSectionData(id, data);
  if (validationError) {
    return { error: validationError };
  }

  const config = CONTENT_SECTIONS[id];

  try {
    await withDbRetry(() =>
      prisma.contentSection.upsert({
        where: { id },
        update: {
          title,
          section,
          status: status as ContentStatus,
          data: data as Prisma.InputJsonValue,
        },
        create: {
          id,
          title,
          section,
          status: status as ContentStatus,
          data: data as Prisma.InputJsonValue,
          sortOrder: config.sortOrder,
        },
      }),
    );

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Content update failed:", error);
    return { error: getDbErrorMessage(error) };
  }
}
