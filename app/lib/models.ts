import type { Service, ServiceStatus, User, UserRole, UserStatus } from "@prisma/client";

export {
  UserRole,
  UserStatus,
  ServiceStatus,
  type User,
  type Service,
} from "@prisma/client";

export type CreateUserInput = {
  email: string;
  name: string;
  passwordHash: string;
  role?: UserRole;
  status?: UserStatus;
};

export type UpdateUserInput = {
  email?: string;
  name?: string;
  passwordHash?: string;
  role?: UserRole;
  status?: UserStatus;
  lastActiveAt?: Date | null;
};

export type CreateServiceInput = {
  id: string;
  title: string;
  description: string;
  note: string;
  items: string[];
  sortOrder?: number;
  status?: ServiceStatus;
};

export type UpdateServiceInput = {
  title?: string;
  description?: string;
  note?: string;
  items?: string[];
  sortOrder?: number;
  status?: ServiceStatus;
};

export const userRoleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  TRAINER: "Trainer",
  ANALYST: "Analyst",
};

export const userStatusLabels: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
};

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};
