import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function ReportsHeader({
  monthStr,
  prevStr,
  nextStr,
  thisMonthStr,
}: {
  monthStr: string;
  prevStr: string;
  nextStr: string;
  thisMonthStr: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* LEFT */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>

          <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {monthStr}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Monthly income vs expenses and profit.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/reports?month=${prevStr}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Link>
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/reports?month=${thisMonthStr}`}>This month</Link>
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/reports?month=${nextStr}`}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>

        <Button size="sm" asChild>
          <Link href={`/reports/export?month=${monthStr}`}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Link>
        </Button>
      </div>
    </div>
  );
}
