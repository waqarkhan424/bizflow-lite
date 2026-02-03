import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import InvoiceStatusButtons from "../components/invoice-status-buttons";

export default async function InvoiceDetailsPage({params}: {params: Promise<{ id: string }>}) {
    
  const { business } = await requireBusiness();
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: business.id },
    include: {
      customer: true,
      items: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.number}</h1>
          <p className="text-sm text-muted-foreground">
            {invoice.customer.name} • Status: {invoice.status}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}/print`}
            className="text-sm underline underline-offset-4 text-primary"
            target="_blank"
          >
            Print
          </Link>

          <Link href="/invoices" className="text-sm underline underline-offset-4 text-primary">
            Back
          </Link>
        </div>
      </div>

      <InvoiceStatusButtons invoiceId={invoice.id} currentStatus={invoice.status} />

      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{invoice.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {invoice.customer.email || "No email"} • {invoice.customer.phone || "No phone"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Dates</p>
            <p className="font-medium">Issue: {invoice.issueDate.toDateString()}</p>
            <p className="text-sm text-muted-foreground">
              Due: {invoice.dueDate ? invoice.dueDate.toDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <p className="font-medium">Items</p>

          <div className="space-y-2">
            {invoice.items.map((it) => (
              <div key={it.id} className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {it.qty} • Rate: {it.rate}
                  </p>
                </div>
                <div className="font-medium">{it.amount}</div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{invoice.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{invoice.total}</span>
            </div>
          </div>

          {invoice.notes ? (
            <div className="border-t pt-3">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
