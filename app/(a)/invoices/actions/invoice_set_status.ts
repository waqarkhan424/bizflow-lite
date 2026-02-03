"use server";

import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";

export type InvoiceStatusState = { ok: boolean; message: string };

export async function invoice_set_status(_prev: InvoiceStatusState, formData: FormData): Promise<InvoiceStatusState> {

  const { business } = await requireBusiness();

  const invoiceId = String(formData.get("invoiceId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim(); // paid|unpaid|draft

  if (!invoiceId) return { ok: false, message: "Missing invoice id" };
  if (!["paid", "unpaid", "draft"].includes(status)) {
    return { ok: false, message: "Invalid status" };
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, businessId: business.id },
    select: { id: true },
  });

  if (!invoice) return { ok: false, message: "Invoice not found" };

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });

  return { ok: true, message: `Invoice marked ${status}` };
}
