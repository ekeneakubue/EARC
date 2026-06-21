import type { ServiceStatus, UserRole, UserStatus } from "./enums";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  note: string;
  items: string[];
  amountNgn: number | null;
  duration: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
};

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
  amountNgn?: number | null;
  duration?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  status?: ServiceStatus;
};

export type UpdateServiceInput = {
  title?: string;
  description?: string;
  note?: string;
  items?: string[];
  amountNgn?: number | null;
  duration?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  status?: ServiceStatus;
};
