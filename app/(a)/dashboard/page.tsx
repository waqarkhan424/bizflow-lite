import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, monthLabel } from "@/lib/date";
import { money } from "@/lib/format";

import DashboardHeader from "./components/dashboard-header";
import StatsGrid from "./components/stats-grid";
import RecentInvoicesCard from "./components/recent-invoices-card";
import RecentExpensesCard from "./components/recent-expenses-card";
import OverviewChart from "./components/overview-chart";

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default async function DashboardPage() {
  const { user, business } = await requireBusiness();

  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);
  const month = monthLabel(now);

  const paidAgg = await prisma.invoice.aggregate({
    where: {
      businessId: business.id,
      status: "paid",
      issueDate: { gte: from, lt: to },
    },
    _sum: { total: true },
  });

  const expAgg = await prisma.expense.aggregate({
    where: {
      businessId: business.id,
      date: { gte: from, lt: to },
    },
    _sum: { amount: true },
  });

  const unpaidCount = await prisma.invoice.count({
    where: { businessId: business.id, status: "unpaid" },
  });

  const [recentInvoices, recentExpenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: { select: { name: true } } },
    }),
    prisma.expense.findMany({
      where: { businessId: business.id },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const income = paidAgg._sum.total ?? 0;
  const expenses = expAgg._sum.amount ?? 0;
  const profit = income - expenses;

  // ---- overview (last 6 months) ----
  const start6 = startOfMonth(addMonths(now, -5));
  const end6 = endOfMonth(now);

  const [paidInvoices6, expenses6] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        businessId: business.id,
        status: "paid",
        issueDate: { gte: start6, lt: end6 },
      },
      select: { total: true, issueDate: true },
    }),
    prisma.expense.findMany({
      where: {
        businessId: business.id,
        date: { gte: start6, lt: end6 },
      },
      select: { amount: true, date: true },
    }),
  ]);

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = addMonths(start6, i);
    return {
      key: monthKey(d),
      label: d.toLocaleString("en-US", { month: "short" }),
      income: 0,
      expenses: 0,
    };
  });

  const map = new Map(months.map((m) => [m.key, m]));

  for (const inv of paidInvoices6) {
    const k = monthKey(new Date(inv.issueDate));
    const bucket = map.get(k);
    if (bucket) bucket.income += inv.total ?? 0;
  }

  for (const e of expenses6) {
    const k = monthKey(new Date(e.date));
    const bucket = map.get(k);
    if (bucket) bucket.expenses += e.amount ?? 0;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={user?.name}
        businessName={business.name}
        monthLabel={month}
      />

      <StatsGrid
        income={money(income)}
        expenses={money(expenses)}
        profit={money(profit)}
        unpaidCount={String(unpaidCount)}
        monthLabel={month}
      />

      {/* nicer middle layout */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart
            data={months.map((m) => ({
              label: m.label,
              income: m.income,
              expenses: m.expenses,
            }))}
            subtitle="Income vs Expenses (last 6 months)"
          />
        </div>

        <div className="lg:col-span-1">
          <RecentExpensesCard expenses={recentExpenses} formatMoney={money} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentInvoicesCard invoices={recentInvoices} formatMoney={money} />
        {/* keep second card, or later we can replace with “Top customers” */}
        <RecentExpensesCard expenses={recentExpenses} formatMoney={money} />
      </div>
    </div>
  );
}
