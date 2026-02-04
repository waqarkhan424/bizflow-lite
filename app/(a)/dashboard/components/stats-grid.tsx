import StatCard from "./stat-card";

export default function StatsGrid({income, expenses, profit, unpaidCount, monthLabel}: { income: string;  expenses: string;  profit: string; unpaidCount: string; monthLabel: string}) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Income (month)"
        value={income}
        hint="Paid invoices in this month"
        href="/invoices?status=paid"
      />
      <StatCard
        title="Expenses (month)"
        value={expenses}
        hint="Expenses in this month"
        href={`/expenses?month=${monthLabel}`}
      />
      <StatCard 
       title="Profit (month)"
       value={profit} 
       hint="Income - Expenses" 
       />
      <StatCard
        title="Unpaid invoices"
        value={unpaidCount}
        hint="Invoices still unpaid"
        href="/invoices?status=unpaid"
      />
    </div>
  );
}
