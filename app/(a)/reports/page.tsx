import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, monthLabel } from "@/lib/date";
import { money } from "@/lib/format";

import ReportsHeader from "./components/reports-header";
import ReportsSummaryCards from "./components/reports-summary-cards";
import PaidInvoicesCard from "./components/paid-invoices-card";
import MonthExpensesCard from "./components/month-expenses-card";
import ReportsBars from "./components/reports-bars";


function parseMonth(monthStr: string) {
  const [y, m] = monthStr.split("-").map((x) => Number(x));
  const safeY = Number.isFinite(y) ? y : new Date().getFullYear();
  const safeM = Number.isFinite(m) ? m : new Date().getMonth() + 1;
  return new Date(safeY, (safeM || 1) - 1, 1);
}

export default async function ReportsPage({searchParams}: {searchParams: Promise<{ month?: string }>}) {

  const { business } = await requireBusiness();

  const sp = await searchParams; 

  const now = new Date();
  const monthStr = (sp.month ?? monthLabel(now)).trim();

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

  const [paidInvoices, monthExpenses] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        businessId: business.id,
        status: "paid",
        issueDate: { gte: from, lt: to },
      },
      orderBy: { issueDate: "desc" },
      take: 10,
      select: {
        id: true,
        number: true,
        issueDate: true,
        total: true,
        customer: { select: { name: true } },
      },
    }),
    prisma.expense.findMany({
      where: {
        businessId: business.id,
        date: { gte: from, lt: to },
      },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        date: true,
        note: true,
        category: true,
      },
    }),
  ]);

  // prev/next month strings
  const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
  const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

  const prevStr = monthLabel(prev);
  const nextStr = monthLabel(next);
  const thisMonthStr = monthLabel(now);

  return (
  <div className="space-y-6">
    <ReportsHeader
      monthStr={monthStr}
      prevStr={prevStr}
      nextStr={nextStr}
      thisMonthStr={thisMonthStr}
    />

    <ReportsSummaryCards
      income={money(income)}
      expenses={money(expenses)}
      profit={money(profit)}
    />

    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <ReportsBars income={income} expenses={expenses} profit={profit} />
      </div>

      <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
        <PaidInvoicesCard invoices={paidInvoices} formatMoney={money} />
        <MonthExpensesCard expenses={monthExpenses} formatMoney={money} />
      </div>
    </div>
  </div>



  );
}
