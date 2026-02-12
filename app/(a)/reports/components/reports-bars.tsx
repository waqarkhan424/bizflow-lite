import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportsBars({
  income,
  expenses,
  profit,
}: {
  income: number;
  expenses: number;
  profit: number;
}) {
  const max = Math.max(income, expenses, Math.max(profit, 0));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">This month overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual comparison of your totals.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <BarRow label="Income" value={income} max={max} />
        <BarRow label="Expenses" value={expenses} max={max} />
        <BarRow label="Profit" value={profit} max={max} />
      </CardContent>
    </Card>
  );
}
