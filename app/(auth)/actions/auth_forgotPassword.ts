"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const RESET_TOKEN_MINUTES = 30;

export async function auth_forgotPassword(_: any, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  // Always return success (security: don’t reveal if email exists)
  const okResponse = { ok: true, message: "If this email exists, a reset link has been sent." };

  if (!email) return { ok: false, message: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return okResponse;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60 * 1000);

  // delete old tokens for this user (optional, keeps DB clean)
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  // TODO: send email (for now just console log)
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  console.log("RESET LINK:", resetLink);

  return okResponse;
}
