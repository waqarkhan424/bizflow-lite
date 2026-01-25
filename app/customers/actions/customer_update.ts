"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";

export type CustomerUpdateState = {
  ok: boolean;
  message: string;
};

export async function customer_update(_prevState: CustomerUpdateState, formData: FormData): Promise<CustomerUpdateState> {
    
  const { business } = await requireBusiness();

  const customerId = String(formData.get("customerId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!customerId) return { ok: false, message: "Missing customer id" };
  if (!name) return { ok: false, message: "Customer name is required" };

  // security: only update customer of this business
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId: business.id },
    select: { id: true },
  });

  if (!customer) {
    return { ok: false, message: "Customer not found" };
  }

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
    },
  });

  return { ok: true, message: "Customer updated" };
}
