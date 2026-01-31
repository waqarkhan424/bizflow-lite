"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export type PasswordChangeState = {
  ok: boolean;
  message: string;
};

export async function password_change(_prev: PasswordChangeState, formData: FormData): Promise<PasswordChangeState> {
    
  const user = await requireUser();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) return { ok: false, message: "Current password is required" };
  if (newPassword.length < 6) return { ok: false, message: "New password must be at least 6 characters" };
  if (newPassword !== confirmPassword) return { ok: false, message: "Passwords do not match" };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return { ok: false, message: "User not found" };

  const isValid = await bcrypt.compare(currentPassword, dbUser.password);
  if (!isValid) return { ok: false, message: "Current password is incorrect" };

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  // Optional: logout from all devices by deleting sessions
  await prisma.session.deleteMany({ where: { userId: user.id } });

  // clear cookie so user must login again
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return { ok: true, message: "Password changed. Please login again." };
}
