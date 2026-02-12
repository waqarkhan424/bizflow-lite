import StatCard from "./stat-card";
import { ArrowUpRight, Wallet, TrendingUp, AlertCircle } from "lucide-react";

export default function StatsGrid({income, expenses, profit, unpaidCount, monthLabel}: {income: string; expenses: string; profit: string; unpaidCount: string; monthLabel: string;}) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Income (month)"
        value={income}
        hint="Paid invoices in this month"
        href="/invoices?status=paid"
        icon={<ArrowUpRight className="h-5 w-5" />}
      />
      <StatCard
        title="Expenses (month)"
        value={expenses}
        hint="Expenses in this month"
        href={`/expenses?month=${monthLabel}`}
        icon={<Wallet className="h-5 w-5" />}
      />
      <StatCard
        title="Profit (month)"
        value={profit}
        hint="Income − Expenses"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatCard
        title="Unpaid invoices"
        value={unpaidCount}
        hint="Invoices still unpaid"
        href="/invoices?status=unpaid"
        icon={<AlertCircle className="h-5 w-5" />}
      />
    </div>
  );
}
