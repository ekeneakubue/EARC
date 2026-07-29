import { unstable_noStore as noStore } from "next/cache";
import { ContentStatus } from "./enums";
import { withDbRetry } from "./db";
import { prisma } from "./prisma";

export type PublicNewsItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  fullDescription?: string | null;
  imageUrl: string;
  imageAlt: string;
};

export type AdminNewsItem = PublicNewsItem & {
  status: ContentStatus;
  updatedAt: Date;
};

export const defaultNewsItems: PublicNewsItem[] = [
  {
    id: "educational-research-services",
    category: "Research",
    title: "Educational Research Services",
    description:
      "Strengthen education systems with rigorous studies, evidence synthesis, and practical recommendations.",
    fullDescription:
      "Strengthen education systems with rigorous studies, evidence synthesis, and practical recommendations. EARC partners with institutions to design research agendas, collect and analyse data, and translate findings into actionable guidance for education leaders and practitioners.",
    imageUrl: "/images/services/educational-research.jpg",
    imageAlt: "Educational research and analysis",
  },
  {
    id: "measurable-programme-impact",
    category: "Monitoring & Evaluation",
    title: "Turn programme data into measurable impact",
    description:
      "Build stronger MEL frameworks, indicators, reporting systems, and learning processes.",
    fullDescription:
      "Build stronger MEL frameworks, indicators, reporting systems, and learning processes. Our team helps organisations track progress, surface insights, and use evidence to improve programme delivery and demonstrate results to stakeholders.",
    imageUrl: "/images/services/monitoring-evaluation-and-learning-mel.jpg",
    imageAlt: "Monitoring, evaluation, and learning professionals",
  },
  {
    id: "collaborate-with-earc",
    category: "Partnerships",
    title: "Collaborate with EARC",
    description:
      "Partner with our multidisciplinary team on research, training, policy, and development initiatives.",
    fullDescription:
      "Partner with our multidisciplinary team on research, training, policy, and development initiatives. Whether you need technical support, capacity building, or collaborative project delivery, EARC works with partners across Africa and beyond to create lasting impact.",
    imageUrl: "/images/journey/chapter-3.jpg",
    imageAlt: "EARC partnership and collaboration",
  },
];

function mapNewsItem(item: {
  id: string;
  category: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
}): PublicNewsItem {
  return {
    id: item.id,
    category: item.category,
    title: item.title,
    description: item.description,
    fullDescription: item.fullDescription?.trim() || item.description,
    imageUrl: item.imageUrl,
    imageAlt: item.title,
  };
}

export async function getPublicNewsItems(): Promise<PublicNewsItem[]> {
  noStore();

  try {
    const items = await withDbRetry(() =>
      prisma.newsItem.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    );

    if (items.length > 0) {
      return items.map(mapNewsItem);
    }
  } catch {
    // Use defaults while the database is unavailable or before migration.
  }

  return defaultNewsItems;
}

export async function getPublicNewsItemById(id: string): Promise<PublicNewsItem | null> {
  noStore();

  try {
    const item = await withDbRetry(() =>
      prisma.newsItem.findFirst({
        where: {
          id,
          status: ContentStatus.PUBLISHED,
        },
      }),
    );

    if (item) {
      return mapNewsItem(item);
    }
  } catch {
    // Use defaults while the database is unavailable or before migration.
  }

  return defaultNewsItems.find((item) => item.id === id) ?? null;
}

export async function getAllPublicNewsIds(): Promise<string[]> {
  const ids = new Set(defaultNewsItems.map((item) => item.id));

  try {
    const items = await withDbRetry(() =>
      prisma.newsItem.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { id: true },
      }),
    );

    for (const item of items) {
      ids.add(item.id);
    }
  } catch {
    // Use default IDs while the database is unavailable.
  }

  return Array.from(ids);
}

export async function getAdminNewsItems(): Promise<AdminNewsItem[]> {
  noStore();

  return withDbRetry(async () => {
    const items = await prisma.newsItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return items.map((item) => ({
      ...mapNewsItem(item),
      status: item.status,
      updatedAt: item.updatedAt,
    }));
  });
}
