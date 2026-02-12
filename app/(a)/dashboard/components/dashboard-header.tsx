import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({userName, businessName, monthLabel}: { userName?: string | null; businessName: string; monthLabel: string;}) {
    
  return (
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Welcome{userName ? `, ${userName}` : ""} —{" "}
          <span className="font-medium text-foreground">{businessName}</span>
        </p>

        <p className="mt-1 text-xs text-muted-foreground">Month: {monthLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/invoices/new">New invoice</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/expenses/new">Add expense</Link>
        </Button>

        <Button asChild variant="ghost">
          <Link href="/reports">View reports</Link>
        </Button>
      </div>
    </div>






  );
}




