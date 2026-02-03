"use server";

import { prisma } from "@/lib/prisma";
import { requireBusiness } from "@/lib/require-business";
import { redirect } from "next/navigation";

export type ExpenseCreateState = { ok: boolean; message: string };

export async function expense_create(_prev: ExpenseCreateState, formData: FormData): Promise<ExpenseCreateState> {
    
  const { business } = await requireBusiness();

  const amount = Math.round(Number(formData.get("amount") ?? 0));
  const dateRaw = String(formData.get("date") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: "Amount is required" };
  if (!dateRaw) return { ok: false, message: "Date is required" };

  const date = new Date(dateRaw);

  await prisma.expense.create({
    data: {
      businessId: business.id,
      amount,
      date,
      category: category || null,
      note: note || null,
    },
  });

  redirect("/expenses");
}
