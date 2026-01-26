"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";
import { redirect } from "next/navigation";

export type CustomerCreateState = {
  ok: boolean;
  message: string;
};

export async function customer_create(_prevState: CustomerCreateState, formData: FormData): Promise<CustomerCreateState> {
    
  const { business } = await requireBusiness();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) return { ok: false, message: "Customer name is required" };

  await prisma.customer.create({
    data: {
      businessId: business.id,
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
    },
  });

  redirect("/customers");
}
