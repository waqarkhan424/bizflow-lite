import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireBusiness();
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, businessId: business.id },
    include: { customer: true, items: { orderBy: { createdAt: "asc" } } },
  });

  if (!invoice) notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-sm text-muted-foreground">Invoice</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{invoice.number}</p>
          <p className="text-sm text-muted-foreground">Status: {invoice.status}</p>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Bill To</p>
          <p className="font-medium">{invoice.customer.name}</p>
          <p className="text-sm text-muted-foreground">{invoice.customer.email || ""}</p>
          <p className="text-sm text-muted-foreground">{invoice.customer.phone || ""}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Issue</p>
          <p className="font-medium">{invoice.issueDate.toDateString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Due</p>
          <p className="font-medium">{invoice.dueDate ? invoice.dueDate.toDateString() : "—"}</p>
        </div>
      </div>

      <hr className="my-6" />

      <div className="space-y-2">
        {invoice.items.map((it) => (
          <div key={it.id} className="flex justify-between">
            <div>
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {it.qty} • Rate: {it.rate}
              </p>
            </div>
            <p className="font-medium">{it.amount}</p>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      <div className="flex justify-end">
        <div className="w-60 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{invoice.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">{invoice.total}</span>
          </div>
        </div>
      </div>

      {invoice.notes ? (
        <>
          <hr className="my-6" />
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="text-sm">{invoice.notes}</p>
        </>
      ) : null}

      <script
        dangerouslySetInnerHTML={{
          __html: `window.onload = () => window.print();`,
        }}
      />
    </div>
  );
}
