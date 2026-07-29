import { unstable_noStore as noStore } from "next/cache";
import { site } from "./content";
import { withDbRetry } from "./db";
import { prisma } from "./prisma";

export const SITE_SETTINGS_ID = "default";

export type SiteSettingsData = {
  organizationName: string;
  contactEmail: string;
  defaultRegion: string;
  notifyNewInquiries: boolean;
  notifyTrainingUpdates: boolean;
  notifyUserChanges: boolean;
  notifyWeeklyReports: boolean;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
};

export const defaultSiteSettings: SiteSettingsData = {
  organizationName: site.name,
  contactEmail: site.email,
  defaultRegion: site.location,
  notifyNewInquiries: true,
  notifyTrainingUpdates: true,
  notifyUserChanges: true,
  notifyWeeklyReports: true,
  requireTwoFactor: true,
  sessionTimeoutMinutes: 30,
};

function normalizeSettings(data: unknown): SiteSettingsData {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  return {
    organizationName:
      typeof record.organizationName === "string" && record.organizationName.trim()
        ? record.organizationName.trim()
        : defaultSiteSettings.organizationName,
    contactEmail:
      typeof record.contactEmail === "string" && record.contactEmail.trim()
        ? record.contactEmail.trim()
        : defaultSiteSettings.contactEmail,
    defaultRegion:
      typeof record.defaultRegion === "string" && record.defaultRegion.trim()
        ? record.defaultRegion.trim()
        : defaultSiteSettings.defaultRegion,
    notifyNewInquiries:
      typeof record.notifyNewInquiries === "boolean"
        ? record.notifyNewInquiries
        : defaultSiteSettings.notifyNewInquiries,
    notifyTrainingUpdates:
      typeof record.notifyTrainingUpdates === "boolean"
        ? record.notifyTrainingUpdates
        : defaultSiteSettings.notifyTrainingUpdates,
    notifyUserChanges:
      typeof record.notifyUserChanges === "boolean"
        ? record.notifyUserChanges
        : defaultSiteSettings.notifyUserChanges,
    notifyWeeklyReports:
      typeof record.notifyWeeklyReports === "boolean"
        ? record.notifyWeeklyReports
        : defaultSiteSettings.notifyWeeklyReports,
    requireTwoFactor:
      typeof record.requireTwoFactor === "boolean"
        ? record.requireTwoFactor
        : defaultSiteSettings.requireTwoFactor,
    sessionTimeoutMinutes:
      typeof record.sessionTimeoutMinutes === "number" &&
      [30, 60, 240].includes(record.sessionTimeoutMinutes)
        ? record.sessionTimeoutMinutes
        : defaultSiteSettings.sessionTimeoutMinutes,
  };
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  noStore();

  try {
    const row = await withDbRetry(() =>
      prisma.siteSettings.findUnique({
        where: { id: SITE_SETTINGS_ID },
      }),
    );

    if (!row) {
      return defaultSiteSettings;
    }

    return normalizeSettings(row.data);
  } catch {
    return defaultSiteSettings;
  }
}

export function getDefaultSiteSettingsRecord() {
  return {
    id: SITE_SETTINGS_ID,
    data: defaultSiteSettings,
  };
}
