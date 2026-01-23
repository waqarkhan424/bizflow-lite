"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";

export type CustomerDeleteState = {
  ok: boolean;
  message: string;
};

export async function customer_delete(_prevState: CustomerDeleteState,formData: FormData): Promise<CustomerDeleteState> {
    
  const { business } = await requireBusiness();

  const customerId = String(formData.get("customerId") ?? "").trim();
  if (!customerId) return { ok: false, message: "Missing customer id" };

  // security: only delete customer of this business
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId: business.id },
    select: { id: true },
  });

  if (!customer) {
    return { ok: false, message: "Customer not found" };
  }

  await prisma.customer.delete({ where: { id: customerId } });

  return { ok: true, message: "Customer deleted" };
}
