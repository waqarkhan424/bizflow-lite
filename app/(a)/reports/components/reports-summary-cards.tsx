import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-muted/40" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>

          <div className="rounded-xl border bg-background p-2 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0" />
    </Card>
  );
}

export default function ReportsSummaryCards({
  income,
  expenses,
  profit,
}: {
  income: string;
  expenses: string;
  profit: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Income (paid)"
        value={income}
        hint="Total paid invoices"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatCard
        label="Expenses"
        value={expenses}
        hint="Total spending"
        icon={<Wallet className="h-5 w-5" />}
      />
      <StatCard
        label="Profit"
        value={profit}
        hint="Income − expenses"
        icon={<TrendingDown className="h-5 w-5" />}
      />
    </div>
  );
}
