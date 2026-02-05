import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "@/lib/date";

function parseMonth(monthStr: string) {
  const [y, m] = monthStr.split("-").map((x) => Number(x));
  const safeY = Number.isFinite(y) ? y : new Date().getFullYear();
  const safeM = Number.isFinite(m) ? m : new Date().getMonth() + 1;
  return new Date(safeY, (safeM || 1) - 1, 1);
}

export async function GET(req: Request) {
    
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!business) {
    return new NextResponse("Business not found", { status: 404 });
  }

  const url = new URL(req.url);
  const monthStr = (url.searchParams.get("month") ?? "").trim();
  if (!monthStr) {
    return new NextResponse("Missing month (YYYY-MM)", { status: 400 });
  }

  const monthDate = parseMonth(monthStr);
  const from = startOfMonth(monthDate);
  const to = endOfMonth(monthDate);

  const [paidAgg, expenseAgg] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        businessId: business.id,
        status: "paid",
        issueDate: { gte: from, lt: to },
      },
      _sum: { total: true },
    }),
    prisma.expense.aggregate({
      where: {
        businessId: business.id,
        date: { gte: from, lt: to },
      },
      _sum: { amount: true },
    }),
  ]);

  const income = paidAgg._sum.total ?? 0;
  const expenses = expenseAgg._sum.amount ?? 0;
  const profit = income - expenses;

  const csv =
    `month,income,expenses,profit\n` +
    `${monthStr},${income},${expenses},${profit}\n`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bizflow-report-${monthStr}.csv"`,
    },
  });
}
