import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaidInvoice = {
  id: string;
  number: string;
  issueDate: Date;
  total: number | null;
  customer: { name: string } | null;
};

export default function PaidInvoicesCard({invoices, formatMoney}: {invoices: PaidInvoice[]; formatMoney: (n: number) => string}) {
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Paid invoices (this month)</CardTitle>
          <Link
            href="/invoices"
            className="text-sm underline underline-offset-4 text-primary"
          >
            View all
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No paid invoices.</p>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-start justify-between gap-3 border rounded-lg p-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{inv.number}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {inv.customer?.name ?? "No customer"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {inv.issueDate.toDateString()}
                </p>
              </div>
              <div className="font-medium">{formatMoney(inv.total ?? 0)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
