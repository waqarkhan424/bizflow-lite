"use server";

import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/invoice-number";
import { redirect } from "next/navigation";

export type InvoiceCreateState = { ok: boolean; message: string };

function toInt(value: FormDataEntryValue | null) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

export async function invoice_create(_prev: InvoiceCreateState, formData: FormData): Promise<InvoiceCreateState> {
    
  const { business } = await requireBusiness();

  const customerId = String(formData.get("customerId") ?? "").trim();
  const status = String(formData.get("status") ?? "unpaid").trim(); // draft|unpaid|paid
  const notes = String(formData.get("notes") ?? "").trim();

  const issueDateRaw = String(formData.get("issueDate") ?? "").trim();
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

  if (!customerId) return { ok: false, message: "Customer is required" };

  // security: customer must belong to this business
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId: business.id },
    select: { id: true },
  });
  if (!customer) return { ok: false, message: "Invalid customer" };

  // items arrays (from client form)
  const names = formData.getAll("itemName").map((x) => String(x ?? "").trim());
  const qtys = formData.getAll("itemQty").map((x) => toInt(x));
  const rates = formData.getAll("itemRate").map((x) => toInt(x)); // cents

  // build items, ignore empty rows
  const items = names
    .map((name, i) => ({
      name,
      qty: qtys[i] ?? 0,
      rate: rates[i] ?? 0,
      amount: (qtys[i] ?? 0) * (rates[i] ?? 0),
    }))
    .filter((it) => it.name && it.qty > 0);

  if (items.length === 0) {
    return { ok: false, message: "Add at least 1 item (name + qty)" };
  }

  const subtotal = items.reduce((sum, it) => sum + it.amount, 0);
  const total = subtotal; // later you can add tax/discount

  const number = await generateInvoiceNumber(business.id);

  const issueDate = issueDateRaw ? new Date(issueDateRaw) : new Date();
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

  const invoice = await prisma.invoice.create({
    data: {
      businessId: business.id,
      customerId,
      number,
      status,
      notes: notes || null,
      issueDate,
      dueDate,
      subtotal,
      total,
      items: {
        create: items.map((it) => ({
          name: it.name,
          qty: it.qty,
          rate: it.rate,
          amount: it.amount,
        })),
      },
    },
    select: { id: true },
  });

  redirect(`/invoices/${invoice.id}`);
}
