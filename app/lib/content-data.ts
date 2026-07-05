import type { ContentStatus } from "./enums";
import {
  CONTENT_SECTIONS,
  type AboutContent,
  type ContactContent,
  type ContentSectionId,
  type HeroContent,
  type StoryContent,
} from "./content-sections";
import { withDbRetry } from "./db";
import { prisma } from "./prisma";

export type ContentSectionRow = {
  id: string;
  title: string;
  section: string;
  status: ContentStatus;
  data: Record<string, unknown>;
  sortOrder: number;
  updatedAt: Date;
  previewPath: string;
  editHref?: string;
};

function enrichSection(section: {
  id: string;
  title: string;
  section: string;
  status: ContentStatus;
  data: unknown;
  sortOrder: number;
  updatedAt: Date;
}): ContentSectionRow {
  const config = CONTENT_SECTIONS[section.id as ContentSectionId];

  return {
    id: section.id,
    title: section.title,
    section: section.section,
    status: section.status,
    data:
      section.data && typeof section.data === "object" && !Array.isArray(section.data)
        ? (section.data as Record<string, unknown>)
        : {},
    sortOrder: section.sortOrder,
    updatedAt: section.updatedAt,
    previewPath: config?.previewPath ?? "/",
    editHref: config?.editHref,
  };
}

function getFallbackSection(id: ContentSectionId): ContentSectionRow {
  const config = CONTENT_SECTIONS[id];
  const now = new Date(0);

  return {
    id,
    title: config.title,
    section: config.section,
    status: config.defaultStatus,
    data: config.defaultData,
    sortOrder: config.sortOrder,
    updatedAt: now,
    previewPath: config.previewPath,
    editHref: config.editHref,
  };
}

export async function getAdminContentSections(): Promise<ContentSectionRow[]> {
  try {
    const sections = await withDbRetry(() =>
      prisma.contentSection.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    );

    if (sections.length > 0) {
      return sections.map(enrichSection);
    }
  } catch {
    // Fall back to static defaults.
  }

  return getDefaultContentSections().map((section) =>
    enrichSection({
      ...section,
      status: section.status as ContentStatus,
      updatedAt: new Date(0),
    }),
  );
}

export type PublicHomeContent = {
  hero: HeroContent;
  about: AboutContent;
  story: StoryContent;
  contact: ContactContent;
};

export async function getPublicHomeContent(): Promise<PublicHomeContent> {
  const fallback = {
    hero: CONTENT_SECTIONS.hero.defaultData as HeroContent,
    about: CONTENT_SECTIONS.about.defaultData as AboutContent,
    story: CONTENT_SECTIONS.story.defaultData as StoryContent,
    contact: CONTENT_SECTIONS.contact.defaultData as ContactContent,
  };

  try {
    const sections = await withDbRetry(() =>
      prisma.contentSection.findMany({
        where: { status: "PUBLISHED" },
      }),
    );

    const byId = new Map(sections.map((section) => [section.id, section]));

    const heroSection = byId.get("hero");
    const aboutSection = byId.get("about");
    const storySection = byId.get("story");
    const contactSection = byId.get("contact");

    return {
      hero: heroSection
        ? ({ ...fallback.hero, ...(heroSection.data as HeroContent) } as HeroContent)
        : fallback.hero,
      about: aboutSection
        ? ({ ...fallback.about, ...(aboutSection.data as AboutContent) } as AboutContent)
        : fallback.about,
      story: storySection
        ? ({ ...fallback.story, ...(storySection.data as StoryContent) } as StoryContent)
        : fallback.story,
      contact: contactSection
        ? ({ ...fallback.contact, ...(contactSection.data as ContactContent) } as ContactContent)
        : fallback.contact,
    };
  } catch {
    return fallback;
  }
}
