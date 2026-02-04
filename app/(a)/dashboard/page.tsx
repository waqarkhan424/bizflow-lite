
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, monthLabel } from "@/lib/date";
import { money } from "@/lib/format";
import DashboardHeader from "./components/dashboard-header";
import StatsGrid from "./components/stats-grid";
import RecentInvoicesCard from "./components/recent-invoices-card";
import RecentExpensesCard from "./components/recent-expenses-card";



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


      <div className="grid gap-4 lg:grid-cols-2">
        <RecentInvoicesCard invoices={recentInvoices} formatMoney={money} />
        <RecentExpensesCard expenses={recentExpenses} formatMoney={money} />
      </div>

    </div>
  );
}
