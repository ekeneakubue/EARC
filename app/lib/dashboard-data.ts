import { unstable_noStore as noStore } from "next/cache";
import { ServiceStatus } from "./enums";
import { withDbRetry } from "./db";
import { prisma } from "./prisma";
import { recentActivity } from "../admin/lib/data";

export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  detail: string;
};

export type ServiceBreakdownItem = {
  service: string;
  percentage: number;
  color: string;
};

export type DashboardActivity = {
  id: string;
  action: string;
  detail: string;
  time: string;
};

export type DashboardData = {
  stats: DashboardStat[];
  serviceDistribution: ServiceBreakdownItem[];
  recentActivity: DashboardActivity[];
};

const breakdownColors = [
  "bg-primary",
  "bg-primary-light",
  "bg-accent",
  "bg-emerald-500",
  "bg-slate-400",
];

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function buildServiceDistribution(
  published: number,
  draft: number,
  archived: number,
): ServiceBreakdownItem[] {
  const total = published + draft + archived;

  if (total === 0) {
    return [
      { service: "Published", percentage: 0, color: breakdownColors[0] },
      { service: "Draft", percentage: 0, color: breakdownColors[1] },
      { service: "Archived", percentage: 0, color: breakdownColors[2] },
    ];
  }

  const items = [
    { service: "Published", count: published, color: breakdownColors[0] },
    { service: "Draft", count: draft, color: breakdownColors[1] },
    { service: "Archived", count: archived, color: breakdownColors[2] },
  ];

  return items.map((item) => ({
    service: item.service,
    color: item.color,
    percentage: Math.round((item.count / total) * 100),
  }));
}

function getFallbackDashboardData(): DashboardData {
  return {
    stats: [
      {
        label: "Total Users",
        value: "0",
        change: "—",
        trend: "up",
        detail: "active accounts",
      },
      {
        label: "Published Services",
        value: "0",
        change: "—",
        trend: "up",
        detail: "live on website",
      },
      {
        label: "Training Enrollments",
        value: "0",
        change: "—",
        trend: "up",
        detail: "across cohorts",
      },
      {
        label: "Open Programs",
        value: "0",
        change: "—",
        trend: "up",
        detail: "accepting enrollments",
      },
    ],
    serviceDistribution: buildServiceDistribution(0, 0, 0),
    recentActivity: recentActivity.map((item) => ({
      id: String(item.id),
      action: item.action,
      detail: item.detail,
      time: item.time,
    })),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  noStore();

  try {
    const [
      usersCount,
      activeUsers,
      publishedServices,
      draftServices,
      archivedServices,
      enrollmentAggregate,
      openPrograms,
      publishedContentCount,
      recentUsers,
      recentServices,
      recentPrograms,
      recentContent,
    ] = await withDbRetry(() =>
      Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.service.count({ where: { status: ServiceStatus.PUBLISHED } }),
        prisma.service.count({ where: { status: ServiceStatus.DRAFT } }),
        prisma.service.count({ where: { status: ServiceStatus.ARCHIVED } }),
        prisma.trainingProgram.aggregate({ _sum: { enrolled: true } }),
        prisma.trainingProgram.count({ where: { status: "OPEN" } }),
        prisma.contentSection.count({ where: { status: "PUBLISHED" } }),
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { name: true, createdAt: true },
        }),
        prisma.service.findMany({
          orderBy: { updatedAt: "desc" },
          take: 3,
          select: { title: true, updatedAt: true },
        }),
        prisma.trainingProgram.findMany({
          orderBy: { updatedAt: "desc" },
          take: 3,
          select: { title: true, cohort: true, updatedAt: true },
        }),
        prisma.contentSection.findMany({
          orderBy: { updatedAt: "desc" },
          take: 3,
          select: { title: true, updatedAt: true },
        }),
      ]),
    );

    const totalEnrollments = enrollmentAggregate._sum.enrolled ?? 0;

    const activity: DashboardActivity[] = [
      ...recentUsers.map((user, index) => ({
        id: `user-${index}`,
        action: "User account created",
        detail: user.name,
        time: formatRelativeTime(user.createdAt),
        sortDate: user.createdAt,
      })),
      ...recentServices.map((service, index) => ({
        id: `service-${index}`,
        action: "Service updated",
        detail: service.title,
        time: formatRelativeTime(service.updatedAt),
        sortDate: service.updatedAt,
      })),
      ...recentPrograms.map((program, index) => ({
        id: `training-${index}`,
        action: "Training program updated",
        detail: `${program.title} — ${program.cohort}`,
        time: formatRelativeTime(program.updatedAt),
        sortDate: program.updatedAt,
      })),
      ...recentContent.map((section, index) => ({
        id: `content-${index}`,
        action: "Content section updated",
        detail: section.title,
        time: formatRelativeTime(section.updatedAt),
        sortDate: section.updatedAt,
      })),
    ]
      .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
      .slice(0, 5)
      .map(({ sortDate: _sortDate, ...item }) => item);

    return {
      stats: [
        {
          label: "Total Users",
          value: usersCount.toLocaleString("en-US"),
          change: `${activeUsers}`,
          trend: "up",
          detail: "active accounts",
        },
        {
          label: "Published Services",
          value: publishedServices.toLocaleString("en-US"),
          change: `${draftServices}`,
          trend: "up",
          detail: "draft in catalog",
        },
        {
          label: "Training Enrollments",
          value: totalEnrollments.toLocaleString("en-US"),
          change: `${openPrograms}`,
          trend: "up",
          detail: "open programs",
        },
        {
          label: "Content Sections",
          value: publishedContentCount.toLocaleString("en-US"),
          change: `${draftServices}`,
          trend: "up",
          detail: "published on site",
        },
      ],
      serviceDistribution: buildServiceDistribution(
        publishedServices,
        draftServices,
        archivedServices,
      ),
      recentActivity: activity.length > 0 ? activity : getFallbackDashboardData().recentActivity,
    };
  } catch {
    return getFallbackDashboardData();
  }
}