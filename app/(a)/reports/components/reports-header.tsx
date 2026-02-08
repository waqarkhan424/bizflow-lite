import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsHeader({monthStr, prevStr, nextStr, thisMonthStr}: {monthStr: string; prevStr: string; nextStr: string; thisMonthStr: string}) {
  
  return (
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
          <Link href={`/reports?month=${thisMonthStr}`}>This month</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href={`/reports?month=${nextStr}`}>Next</Link>
        </Button>

        {/* Optional CSV export */}
        <Button asChild>
          <Link href={`/reports/export?month=${monthStr}`}>Export CSV</Link>
        </Button>
      </div>
    </div>
  );
}
