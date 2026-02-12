import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/format";

import ExpenseEditButton from "./components/expense-edit-button";
import ExpenseDeleteButton from "./components/expense-delete-button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

function fmtMonth(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { business } = await requireBusiness();
  const sp = await searchParams;

  // month format: "YYYY-MM"
  const now = new Date();
  const monthStr =
    (sp.month ?? "").trim() ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [y, m] = monthStr.split("-").map((x) => Number(x));
  const monthDate = new Date(y, (m || 1) - 1, 1);

  const from = startOfMonth(monthDate);
  const to = endOfMonth(monthDate);

  const expenses = await prisma.expense.findMany({
    where: {
      businessId: business.id,
      date: { gte: from, lt: to },
    },
    orderBy: { date: "desc" },
  });

  const total = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const count = expenses.length;
  const avg = count ? Math.round(total / count) : 0;

  // prev/next month links
  const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
  const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track business spending by month.
          </p>
        </div>

        <Button asChild>
          <Link href="/expenses/new">Add expense</Link>
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Month</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form action="/expenses" className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-muted-foreground">Month</label>

            <input
              type="month"
              name="month"
              defaultValue={monthStr}
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />

            <Button type="submit" variant="secondary" size="sm">
              Apply
            </Button>
          </form>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/expenses?month=${fmtMonth(prev)}`}>Previous</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/expenses?month=${fmtMonth(next)}`}>Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total for {monthStr}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {money(total)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sum of all expenses in this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{count}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Total expense records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {money(avg)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Average per expense
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {expenses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No expenses in this month.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/expenses/new">Add your first expense</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {e.note || "Expense"}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant={e.category ? "secondary" : "outline"}>
                      {e.category || "No category"}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {e.date.toDateString()}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                  <p className="min-w-[90px] text-right font-semibold">
                    {money(e.amount ?? 0)}
                  </p>

                  <ExpenseEditButton
                    expense={{
                      id: e.id,
                      amount: e.amount,
                      date: e.date,
                      note: e.note,
                      category: e.category,
                    }}
                  />

                  <ExpenseDeleteButton expenseId={e.id} note={e.note ?? ""} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
