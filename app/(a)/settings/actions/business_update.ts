"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";

export type BusinessUpdateState = {
  ok: boolean;
  message: string;
};

export async function business_update(_prevState: BusinessUpdateState, formData: FormData): Promise<BusinessUpdateState> {
    
  const { business } = await requireBusiness();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!name) return { ok: false, message: "Business name is required" };

  await prisma.business.update({
    where: { id: business.id }, // secure: update only current business
    data: {
      name,
      phone: phone || null,
      address: address || null,
      note: note || null,
    },
  });

  return { ok: true, message: "Business updated successfully" };
}
