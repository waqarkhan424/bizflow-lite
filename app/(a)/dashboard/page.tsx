import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

function money(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function StatCard({title,value,hint,href}: {title: string; value: string; hint?: string; href?: string}) {
  
  const inner = (
    <Card className={href ? "hover:bg-accent/40 transition-colors" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold">{value}</div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default async function DashboardPage() {
  const { user, business } = await requireBusiness();

  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);

  // 1) Income (month) = sum of PAID invoices in this month
  // Using issueDate (because you already store issueDate on invoice_create)
  const paidAgg = await prisma.invoice.aggregate({
    where: {
      businessId: business.id,
      status: "paid",
      issueDate: { gte: from, lt: to },
    },
    _sum: { total: true },
  });

  // 2) Expenses (month) = sum of expenses in this month
  const expAgg = await prisma.expense.aggregate({
    where: {
      businessId: business.id,
      date: { gte: from, lt: to },
    },
    _sum: { amount: true },
  });

  // 3) Unpaid invoices count (all time)
  const unpaidCount = await prisma.invoice.count({
    where: { businessId: business.id, status: "unpaid" },
  });

  // 4) Recent activity
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

  const monthLabel = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome{user?.name ? `, ${user.name}` : ""}! Business:{" "}
          <span className="font-medium text-foreground">{business.name}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Month: {monthLabel}
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Income (month)"
          value={money(income)}
          hint="Paid invoices in this month"
          href="/invoices?status=paid"
        />
        <StatCard
          title="Expenses (month)"
          value={money(expenses)}
          hint="Expenses in this month"
          href={`/expenses?month=${monthLabel}`}
        />
        <StatCard
          title="Profit (month)"
          value={money(profit)}
          hint="Income - Expenses"
        />
        <StatCard
          title="Unpaid invoices"
          value={String(unpaidCount)}
          hint="Invoices still unpaid"
          href="/invoices?status=unpaid"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent invoices */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent invoices</CardTitle>
              <Link
                href="/invoices"
                className="text-sm underline underline-offset-4 text-primary"
              >
                View all
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            ) : (
              recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-start justify-between gap-3 border rounded-lg p-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-medium underline underline-offset-4 truncate block"
                    >
                      {inv.number}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate">
                      {inv.customer?.name ?? "—"} • {inv.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Issue: {inv.issueDate.toDateString()}
                    </p>
                  </div>
                  <div className="font-medium">{money(inv.total ?? 0)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent expenses</CardTitle>
              <Link
                href="/expenses"
                className="text-sm underline underline-offset-4 text-primary"
              >
                View all
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses yet.</p>
            ) : (
              recentExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 border rounded-lg p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {e.note || "Expense"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {e.category || "No category"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.date.toDateString()}
                    </p>
                  </div>
                  <div className="font-medium">{money(e.amount ?? 0)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
