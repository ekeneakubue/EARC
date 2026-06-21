"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { UserRole, UserStatus } from "../lib/enums";
import { getSession } from "../lib/auth";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";

export type CreateUserState = {
  error?: string;
  success?: boolean;
};

export type DeleteUserResult = {
  error?: string;
  success?: boolean;
};

export type UpdateUserState = {
  error?: string;
  success?: boolean;
};

const validRoles = Object.values(UserRole);
const validStatuses = Object.values(UserStatus);

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? UserRole.EDITOR);
  const status = String(formData.get("status") ?? UserStatus.PENDING);

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!validRoles.includes(role as UserRole)) {
    return { error: "Invalid role selected." };
  }

  if (!validStatuses.includes(status as UserStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const existingUser = await withDbRetry(() =>
      prisma.user.findUnique({ where: { email } }),
    );

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await withDbRetry(() =>
      prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: role as UserRole,
          status: status as UserStatus,
        },
      }),
    );

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function updateUserAction(
  _prevState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to update users." };
  }

  const userId = String(formData.get("userId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? UserRole.EDITOR);
  const status = String(formData.get("status") ?? UserStatus.PENDING);

  if (!userId || !name || !email) {
    return { error: "Name and email are required." };
  }

  if (password && password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!validRoles.includes(role as UserRole)) {
    return { error: "Invalid role selected." };
  }

  if (!validStatuses.includes(status as UserStatus)) {
    return { error: "Invalid status selected." };
  }

  try {
    const existingUser = await withDbRetry(() =>
      prisma.user.findUnique({ where: { id: userId } }),
    );

    if (!existingUser) {
      return { error: "User not found." };
    }

    const emailTaken = await withDbRetry(() =>
      prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      }),
    );

    if (emailTaken) {
      return { error: "A user with this email already exists." };
    }

    if (existingUser.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      const superAdminCount = await withDbRetry(() =>
        prisma.user.count({
          where: { role: UserRole.SUPER_ADMIN },
        }),
      );

      if (superAdminCount <= 1) {
        return { error: "Cannot change the role of the last super admin." };
      }
    }

    if (
      session.userId === userId &&
      status !== UserStatus.ACTIVE &&
      existingUser.status === UserStatus.ACTIVE
    ) {
      return { error: "You cannot deactivate your own account." };
    }

    const data: {
      name: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      passwordHash?: string;
    } = {
      name,
      email,
      role: role as UserRole,
      status: status as UserStatus,
    };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: userId },
        data,
      }),
    );

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function deleteUserAction(userId: string): Promise<DeleteUserResult> {
  const session = await getSession();

  if (!session) {
    return { error: "You must be signed in to delete users." };
  }

  if (!userId) {
    return { error: "User ID is required." };
  }

  if (session.userId === userId) {
    return { error: "You cannot delete your own account." };
  }

  try {
    const user = await withDbRetry(() =>
      prisma.user.findUnique({ where: { id: userId } }),
    );

    if (!user) {
      return { error: "User not found." };
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      const superAdminCount = await withDbRetry(() =>
        prisma.user.count({
          where: { role: UserRole.SUPER_ADMIN },
        }),
      );

      if (superAdminCount <= 1) {
        return { error: "Cannot delete the last super admin account." };
      }
    }

    await withDbRetry(() => prisma.user.delete({ where: { id: userId } }));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}
