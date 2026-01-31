"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export type AccountDeleteState = {
  ok: boolean;
  message: string;
};

export async function account_delete(_prev: AccountDeleteState, formData: FormData): Promise<AccountDeleteState> {
    
  const user = await requireUser();

  const confirm = String(formData.get("confirm") ?? "").trim().toLowerCase();
  if (confirm !== "delete") {
    return { ok: false, message: 'Type "delete" to confirm.' };
  }

  // This will cascade delete Business, Customers, Sessions, Tokens because you set onDelete: Cascade
  await prisma.user.delete({ where: { id: user.id } });

  // clear cookie
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return { ok: true, message: "Account deleted." };
}
