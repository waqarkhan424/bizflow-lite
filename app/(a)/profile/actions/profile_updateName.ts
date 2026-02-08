"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export type ProfileUpdateNameState = {
  ok: boolean;
  message: string;
};

export async function profile_updateName(_prevState: ProfileUpdateNameState, formData: FormData): Promise<ProfileUpdateNameState> {
    
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();

  if (!name) return { ok: false, message: "Name is required" };
  if (name.length < 2) return { ok: false, message: "Name must be at least 2 characters" };

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  return { ok: true, message: "Name updated" };
}
