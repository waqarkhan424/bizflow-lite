"use server";

import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";

export type BusinessUpsertState = {
  ok: boolean;
  message: string;
};

export async function business_upsert(prevState: BusinessUpsertState, formData: FormData): Promise<BusinessUpsertState> {
  
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name) return { ok: false, message: "Business name is required" };

  await prisma.business.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      name,
      phone: phone || null,
      address: address || null,
      note: note || null,
    },
    update: {
      name,
      phone: phone || null,
      address: address || null,
      note: note || null,
    },
  });

  return { ok: true, message: "Business saved successfully" };
}
