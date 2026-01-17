"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function auth_resetPassword(_: any, formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!token) return { ok: false, message: "Invalid token" };
  if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters" };

  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!reset) return { ok: false, message: "Token is invalid or expired" };

  if (reset.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return { ok: false, message: "Token is expired" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hashed },
  });

  // delete token after use
  await prisma.passwordResetToken.delete({ where: { token } });

  return { ok: true, message: "Password updated. You can login now." };
}
