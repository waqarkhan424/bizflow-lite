import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, monthLabel } from "@/lib/date";
import { money } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function parseMonth(monthStr: string) {
  // monthStr: "YYYY-MM"
  const [y, m] = monthStr.split("-").map((x) => Number(x));
  const safeY = Number.isFinite(y) ? y : new Date().getFullYear();
  const safeM = Number.isFinite(m) ? m : new Date().getMonth() + 1;
  return new Date(safeY, (safeM || 1) - 1, 1);
}

export default async function ReportsPage({searchParams}: {searchParams: Promise<{ month?: string }>}) {
    
  const { business } = await requireBusiness();
  const sp = await searchParams;

  const now = new Date();
  const monthStr =
    (sp.month ?? "").trim() || monthLabel(now); // uses lib/date.ts :contentReference[oaicite:2]{index=2}

  const monthDate = parseMonth(monthStr);
  const from = startOfMonth(monthDate);
  const to = endOfMonth(monthDate);

  // totals (fast)
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

  // small lists (nice UX)
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

  // prev/next month links
  const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
  const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

  const prevStr = monthLabel(prev);
  const nextStr = monthLabel(next);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Monthly income vs expenses and profit.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Month: {monthStr}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/reports?month=${prevStr}`}>Prev</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/reports?month=${monthLabel(now)}`}>This month</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/reports?month=${nextStr}`}>Next</Link>
          </Button>

          {/* Optional CSV export */}
          <Button asChild>
            <Link href={`/reports/export?month=${monthStr}`}>
              Export CSV
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Income (paid invoices)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{money(income)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{money(expenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit (income - expenses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{money(profit)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Paid invoices (latest)</CardTitle>
              <Link
                href="/invoices?status=paid"
                className="text-sm underline underline-offset-4 text-primary"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paidInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No paid invoices in this month.
              </p>
            ) : (
              paidInvoices.map((inv) => (
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
                      {inv.customer?.name ?? "—"} • {inv.issueDate.toDateString()}
                    </p>
                  </div>
                  <div className="font-medium">{money(inv.total ?? 0)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Expenses (latest)</CardTitle>
              <Link
                href={`/expenses?month=${monthStr}`}
                className="text-sm underline underline-offset-4 text-primary"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No expenses in this month.
              </p>
            ) : (
              monthExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 border rounded-lg p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{e.note || "Expense"}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {e.category || "No category"} • {e.date.toDateString()}
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
