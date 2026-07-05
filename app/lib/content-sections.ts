import { about, site, story } from "./content";

export type HeroContent = {
  eyebrow: string;
  name: string;
  tagline: string;
  intro: string;
};

export type AboutContent = {
  title: string;
  paragraphs: string[];
};

export type StoryChapterContent = {
  chapter: number;
  title: string;
  paragraph: string;
  image: string;
  alt: string;
};

export type StoryContent = {
  title: string;
  chapters: StoryChapterContent[];
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  description: string;
  collaborationTitle: string;
  collaborationItems: string[];
};

export type ContentSectionId = "hero" | "about" | "story" | "services" | "contact";

export type ContentSectionConfig = {
  title: string;
  section: string;
  previewPath: string;
  editHref?: string;
  sortOrder: number;
  defaultStatus: "PUBLISHED" | "DRAFT";
  defaultData: Record<string, unknown>;
};

export const CONTENT_SECTIONS: Record<ContentSectionId, ContentSectionConfig> = {
  hero: {
    title: "Homepage Hero",
    section: "Hero",
    previewPath: "/",
    sortOrder: 0,
    defaultStatus: "PUBLISHED",
    defaultData: {
      eyebrow: "Multidisciplinary Research & Development",
      name: site.name,
      tagline: site.tagline,
      intro:
        "We bridge the knowledge and capacity gap in underserved communities through research, training, and evidence-based solutions.",
    } satisfies HeroContent,
  },
  about: {
    title: "Who We Are",
    section: "About",
    previewPath: "/#about",
    sortOrder: 1,
    defaultStatus: "PUBLISHED",
    defaultData: {
      title: about.title,
      paragraphs: [...about.paragraphs],
    } satisfies AboutContent,
  },
  story: {
    title: "Our Journey",
    section: "Story",
    previewPath: "/#story",
    sortOrder: 2,
    defaultStatus: "PUBLISHED",
    defaultData: {
      title: story.title,
      chapters: story.chapters.map((chapter) => ({ ...chapter })),
    } satisfies StoryContent,
  },
  services: {
    title: "Our Services",
    section: "Services",
    previewPath: "/#services",
    editHref: "/admin/services",
    sortOrder: 3,
    defaultStatus: "PUBLISHED",
    defaultData: {},
  },
  contact: {
    title: "Contact Section",
    section: "Contact",
    previewPath: "/#contact",
    sortOrder: 4,
    defaultStatus: "PUBLISHED",
    defaultData: {
      eyebrow: "Get in Touch",
      title: "Partner With EARC",
      description:
        "Ready to strengthen your research capacity, improve your MEL systems, or advance evidence-based decision-making? We would love to hear from you.",
      collaborationTitle: "Areas of Collaboration",
      collaborationItems: [
        "Educational research & institutional reviews",
        "MEL framework design & evaluations",
        "Data analytics & research support",
        "Professional training & capacity building",
        "Environmental & geospatial analytics",
        "Policy advisory & strategic planning",
      ],
    } satisfies ContactContent,
  },
};

export function getDefaultContentSections() {
  return Object.entries(CONTENT_SECTIONS).map(([id, config]) => ({
    id,
    title: config.title,
    section: config.section,
    status: config.defaultStatus,
    sortOrder: config.sortOrder,
    data: config.defaultData,
  }));
}
