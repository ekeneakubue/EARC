import type { SessionUser } from "./auth";
import { UserRole } from "./enums";

export function isSuperAdmin(role: UserRole) {
  return role === UserRole.SUPER_ADMIN;
}

export function getVisibleUsersWhere(actorRole: UserRole) {
  if (isSuperAdmin(actorRole)) {
    return {};
  }

  return { role: { not: UserRole.SUPER_ADMIN } };
}

export function getAdminPortalLabel(role: UserRole) {
  return isSuperAdmin(role) ? "Super Admin Dashboard" : "Admin Dashboard";
}

export function getAssignableRoles(actorRole: UserRole): UserRole[] {
  const roles = Object.values(UserRole);

  if (isSuperAdmin(actorRole)) {
    return roles;
  }

  return roles.filter((role) => role !== UserRole.SUPER_ADMIN);
}

export function canManageUser(actor: SessionUser, targetRole: UserRole) {
  if (isSuperAdmin(actor.role)) {
    return true;
  }

  return targetRole !== UserRole.SUPER_ADMIN;
}

export function canAssignRole(actorRole: UserRole, targetRole: UserRole) {
  if (targetRole === UserRole.SUPER_ADMIN) {
    return isSuperAdmin(actorRole);
  }

  return true;
}
