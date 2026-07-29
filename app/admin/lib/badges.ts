import type { SessionUser } from "../../lib/auth";
import { withDbRetry } from "../../lib/db";
import { prisma } from "../../lib/prisma";
import { getVisibleUsersWhere } from "../../lib/user-permissions";
import type { SidebarBadges } from "./data";

export async function getSidebarBadges(session: SessionUser | null): Promise<SidebarBadges> {
  let usersCount = 0;

  if (!session) {
    return { users: usersCount };
  }

  try {
    usersCount = await withDbRetry(() =>
      prisma.user.count({
        where: getVisibleUsersWhere(session.role),
      }),
    );
  } catch {
    // Fall back to 0 if DB is unreachable.
  }

  return {
    users: usersCount,
  };
}
