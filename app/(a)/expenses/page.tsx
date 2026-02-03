import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import ExpenseEditButton from "./components/expense-edit-button";
import ExpenseDeleteButton from "./components/expense-delete-button";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

export default async function ExpensesPage({searchParams}: {searchParams: Promise<{ month?: string }>}) {
    
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

  // prev/next month links
  const prev = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
  const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);

  const fmtMonth = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track business spending by month.
          </p>
        </div>

        <Link
          href="/expenses/new"
          className="text-sm underline underline-offset-4 text-primary"
        >
          Add expense
        </Link>
      </div>

      {/* Month filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form action="/expenses" className="flex gap-2 items-center">
          <label className="text-sm text-muted-foreground">Month</label>
          <input
            type="month"
            name="month"
            defaultValue={monthStr}
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
          />
          <button className="h-9 rounded-md border px-3 text-sm">Apply</button>
        </form>

        <div className="flex gap-2 text-sm">
          <Link
            href={`/expenses?month=${fmtMonth(prev)}`}
            className="rounded-md border px-3 py-1 hover:bg-accent"
          >
            Previous
          </Link>
          <Link
            href={`/expenses?month=${fmtMonth(next)}`}
            className="rounded-md border px-3 py-1 hover:bg-accent"
          >
            Next
          </Link>
        </div>
      </div>

      {/* Total */}
      <div className="border rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total for {monthStr}</p>
        <p className="font-semibold">{total}</p>
      </div>

      {expenses.length === 0 ? (
        <p className="text-muted-foreground">No expenses in this month.</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="border rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{e.note || "Expense"}</p>
                <p className="text-sm text-muted-foreground">
                  {e.category || "No category"} • {e.date.toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-medium">{e.amount}</p>

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
          ))}
        </div>
      )}
    </div>
  );
}
