import { withDbRetry } from "../../lib/db";
import { prisma } from "../../lib/prisma";
import type { SidebarBadges } from "./data";
import { recentInquiries } from "./data";

export async function getSidebarBadges(): Promise<SidebarBadges> {
  let usersCount = 0;

  try {
    usersCount = await withDbRetry(() => prisma.user.count());
  } catch {
    // Fall back to 0 if DB is unreachable.
  }

  return {
    users: usersCount,
    inquiries: recentInquiries.length,
  };
}
