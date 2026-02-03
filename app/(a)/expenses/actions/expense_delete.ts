"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";

export type ExpenseDeleteState = { ok: boolean; message: string };

export async function expense_delete(_prev: ExpenseDeleteState, formData: FormData): Promise<ExpenseDeleteState> {
    
  const { business } = await requireBusiness();

  const expenseId = String(formData.get("expenseId") ?? "").trim();
  if (!expenseId) return { ok: false, message: "Missing expense id" };

  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, businessId: business.id },
    select: { id: true },
  });

  if (!existing) return { ok: false, message: "Expense not found" };

  await prisma.expense.delete({ where: { id: expenseId } });

  return { ok: true, message: "Expense deleted" };
}
