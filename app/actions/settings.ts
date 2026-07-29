"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "../lib/auth";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";
import {
  SITE_SETTINGS_ID,
  type SiteSettingsData,
} from "../lib/site-settings";
import { isSuperAdmin } from "../lib/user-permissions";

export type UpdateSettingsState = {
  error?: string;
  success?: boolean;
};

export type ChangePasswordState = {
  error?: string;
  success?: boolean;
};

const sessionTimeoutOptions = [30, 60, 240];

function parseCheckbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function parseSettingsForm(formData: FormData): SiteSettingsData | { error: string } {
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const defaultRegion = String(formData.get("defaultRegion") ?? "").trim();
  const sessionTimeoutMinutes = Number(formData.get("sessionTimeoutMinutes") ?? 30);

  if (!organizationName || !contactEmail || !defaultRegion) {
    return { error: "Organization name, contact email, and default region are required." };
  }

  if (!contactEmail.includes("@")) {
    return { error: "Please enter a valid contact email." };
  }

  if (!sessionTimeoutOptions.includes(sessionTimeoutMinutes)) {
    return { error: "Invalid session timeout selected." };
  }

  return {
    organizationName,
    contactEmail,
    defaultRegion,
    notifyNewInquiries: parseCheckbox(formData, "notifyNewInquiries"),
    notifyTrainingUpdates: parseCheckbox(formData, "notifyTrainingUpdates"),
    notifyUserChanges: parseCheckbox(formData, "notifyUserChanges"),
    notifyWeeklyReports: parseCheckbox(formData, "notifyWeeklyReports"),
    requireTwoFactor: parseCheckbox(formData, "requireTwoFactor"),
    sessionTimeoutMinutes,
  };
}

export async function updateSettingsAction(
  _prevState: UpdateSettingsState,
  formData: FormData,
): Promise<UpdateSettingsState> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to update settings." };
  }

  if (!isSuperAdmin(session.role)) {
    return { error: "Only super admins can update system settings." };
  }

  const parsed = parseSettingsForm(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    await withDbRetry(() =>
      prisma.siteSettings.upsert({
        where: { id: SITE_SETTINGS_ID },
        update: {
          data: parsed as Prisma.InputJsonValue,
        },
        create: {
          id: SITE_SETTINGS_ID,
          data: parsed as Prisma.InputJsonValue,
        },
      }),
    );

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to change your password." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  if (currentPassword === newPassword) {
    return { error: "New password must be different from your current password." };
  }

  try {
    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { passwordHash: true },
      }),
    );

    if (!user) {
      return { error: "User account not found." };
    }

    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!validPassword) {
      return { error: "Current password is incorrect." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: session.userId },
        data: { passwordHash },
      }),
    );

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}
