export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  TRAINER: "TRAINER",
  ANALYST: "ANALYST",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ServiceStatus = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
  ARCHIVED: "ARCHIVED",
} as const;

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus];

export const ContentStatus = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
} as const;

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

export const TrainingStatus = {
  OPEN: "OPEN",
  FULL: "FULL",
  DRAFT: "DRAFT",
} as const;

export type TrainingStatus = (typeof TrainingStatus)[keyof typeof TrainingStatus];

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

export const contentStatusLabels: Record<ContentStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
};

export const trainingStatusLabels: Record<TrainingStatus, string> = {
  OPEN: "Open",
  FULL: "Full",
  DRAFT: "Draft",
};

export const USER_ROLES = Object.values(UserRole);
export const USER_STATUSES = Object.values(UserStatus);
export const SERVICE_STATUSES = Object.values(ServiceStatus);
export const CONTENT_STATUSES = Object.values(ContentStatus);
export const TRAINING_STATUSES = Object.values(TrainingStatus);
