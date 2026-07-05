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

  if (!process.env.DATABASE_URL) {
    console.error("Login failed: DATABASE_URL is not set");
    return { error: "Database is not configured on the server." };
  }

  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    console.error("Login failed: AUTH_SECRET is not set");
    return { error: "Authentication is not configured on the server." };
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

    try {
      await createSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      console.error("Login failed: could not create session", error);
      return { error: "Authentication is not configured on the server." };
    }

    return { success: true };
  } catch (error) {
    console.error("Login failed: database error", error);
    return { error: getDbErrorMessage(error) };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
