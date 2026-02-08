import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MonthExpense = {
  id: string;
  amount: number | null;
  date: Date;
  note: string | null;
  category: string | null;
};

export default function MonthExpensesCard({expenses, formatMoney}: {expenses: MonthExpense[]; formatMoney: (n: number) => string}) {
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Expenses (this month)</CardTitle>
          <Link
            href="/expenses"
            className="text-sm underline underline-offset-4 text-primary"
          >
            View all
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses.</p>
        ) : (
          expenses.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-3 border rounded-lg p-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{e.note || "Expense"}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {e.category || "No category"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {e.date.toDateString()}
                </p>
              </div>
              <div className="font-medium">{formatMoney(e.amount ?? 0)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
