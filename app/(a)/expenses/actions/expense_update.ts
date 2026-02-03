"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";

export type ExpenseUpdateState = { ok: boolean; message: string };

export async function expense_update(_prev: ExpenseUpdateState, formData: FormData): Promise<ExpenseUpdateState> {
    
  const { business } = await requireBusiness();

  const expenseId = String(formData.get("expenseId") ?? "").trim();
  const amount = Math.round(Number(formData.get("amount") ?? 0));
  const dateRaw = String(formData.get("date") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!expenseId) return { ok: false, message: "Missing expense id" };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: "Amount is required" };
  if (!dateRaw) return { ok: false, message: "Date is required" };

  // security: expense must belong to this business
  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, businessId: business.id },
    select: { id: true },
  });
  if (!existing) return { ok: false, message: "Expense not found" };

  await prisma.expense.update({
    where: { id: expenseId },
    data: {
      amount,
      date: new Date(dateRaw),
      category: category || null,
      note: note || null,
    },
  });

  return { ok: true, message: "Expense updated" };
}
