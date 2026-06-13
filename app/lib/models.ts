import type { Service, User } from "@prisma/client";
import type { ServiceStatus, UserRole, UserStatus } from "./enums";

export type { User, Service } from "@prisma/client";
export {
  UserRole,
  UserStatus,
  ServiceStatus,
  userRoleLabels,
  userStatusLabels,
  serviceStatusLabels,
} from "./enums";

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
