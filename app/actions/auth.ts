"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { UserStatus } from "../lib/enums";
import { createSession, deleteSession } from "../lib/auth";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import { prisma } from "../lib/prisma";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  try {
    const user = await withDbRetry(() =>
      prisma.user.findUnique({ where: { email } }),
    );

    if (!user) {
      return { error: "Invalid email or password." };
    }

    if (user.status !== UserStatus.ACTIVE) {
      return { error: "Your account is not active. Contact an administrator." };
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return { error: "Invalid email or password." };
    }

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      }),
    );

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { success: true };
  } catch (error) {
    return { error: getDbErrorMessage(error) };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
