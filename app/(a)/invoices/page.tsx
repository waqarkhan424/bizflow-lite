import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

function isOverdue(dueDate: Date | null, status: string) {
  if (!dueDate) return false;
  if (status === "paid") return false;
  return dueDate < new Date();
}

export default async function InvoicesPage({searchParams}: {searchParams: Promise<{ page?: string; status?: string; q?: string }>}) {
    
  const { business } = await requireBusiness();
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const status = (sp.status ?? "").trim(); // draft|paid|unpaid|overdue|""
  const q = (sp.q ?? "").trim();

  // base where
  const where: any = { businessId: business.id };

  if (status && status !== "overdue") where.status = status;

  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { customer: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: { customer: { select: { name: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  // handle overdue filter after fetch (simple + safe)
  const filtered = status === "overdue"
    ? invoices.filter((inv) => isOverdue(inv.dueDate, inv.status))
    : invoices;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildLink = (params: Partial<{ page: number; status: string; q: string }>) => {
    const p = new URLSearchParams();
    p.set("page", String(params.page ?? page));
    if ((params.status ?? status) !== "") p.set("status", params.status ?? status);
    if ((params.q ?? q) !== "") p.set("q", params.q ?? q);
    return `/invoices?${p.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">Search and manage invoices.</p>
        </div>

        <Link href="/invoices/new" className="text-sm underline underline-offset-4 text-primary">
          New invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form className="flex gap-2" action="/invoices">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by INV number or customer"
            className="h-9 w-full sm:w-80 rounded-md border bg-transparent px-3 text-sm"
          />
          <button className="h-9 rounded-md border px-3 text-sm">Search</button>
        </form>

        <div className="flex flex-wrap gap-2 text-sm">
          {["", "draft", "unpaid", "paid", "overdue"].map((s) => (
            <Link
              key={s || "all"}
              href={buildLink({ status: s, page: 1 })}
              className={`rounded-md border px-3 py-1 ${
                (s === status) ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              {s === "" ? "All" : s}
            </Link>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No invoices found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
              <div>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="font-medium underline underline-offset-4"
                >
                  {inv.number}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {inv.customer?.name ?? "—"} • Status: {inv.status}
                  {isOverdue(inv.dueDate, inv.status) ? " • OVERDUE" : ""}
                </p>
              </div>

              <div className="text-sm font-medium">{inv.total}</div>
            </div>
          ))}
        </div>
      )}

      {/* Simple pagination (same style as your customers) */}
      <div className="flex items-center justify-center gap-2">
        <Link
          href={buildLink({ page: Math.max(1, page - 1) })}
          className={`rounded-md border px-3 py-1 ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
        >
          Previous
        </Link>

        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </span>

        <Link
          href={buildLink({ page: Math.min(totalPages, page + 1) })}
          className={`rounded-md border px-3 py-1 ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
