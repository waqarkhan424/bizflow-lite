import Link from "next/link";
import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

function isOverdue(dueDate: Date | null, status: string) {
  if (!dueDate) return false;
  if (status === "paid") return false;
  return dueDate < new Date();
}

function statusBadgeClass(status: string, overdue: boolean) {
  if (overdue) return "bg-destructive/10 text-destructive border-destructive/20";
  if (status === "paid") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  if (status === "unpaid") return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  if (status === "draft") return "bg-muted text-muted-foreground";
  return "bg-muted text-muted-foreground";
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const { business } = await requireBusiness();
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const status = (sp.status ?? "").trim(); // draft|paid|unpaid|overdue|""
  const q = (sp.q ?? "").trim();

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

  const filtered =
    status === "overdue" ? invoices.filter((inv) => isOverdue(inv.dueDate, inv.status)) : invoices;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildLink = (params: Partial<{ page: number; status: string; q: string }>) => {
    const p = new URLSearchParams();
    p.set("page", String(params.page ?? page));
    if ((params.status ?? status) !== "") p.set("status", params.status ?? status);
    if ((params.q ?? q) !== "") p.set("q", params.q ?? q);
    return `/invoices?${p.toString()}`;
  };

  const statusTabs = ["", "draft", "unpaid", "paid", "overdue"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">Search, filter, and manage your invoices.</p>
        </div>

        <Button asChild>
          <Link href="/invoices/new">New invoice</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form className="flex w-full gap-2" action="/invoices">
              <input type="hidden" name="status" value={status} />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search by invoice number or customer..."
                className="lg:max-w-md"
              />
              <Button variant="secondary" type="submit">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {statusTabs.map((s) => {
                const active = s === status;
                return (
                  <Link
                    key={s || "all"}
                    href={buildLink({ status: s, page: 1 })}
                    className={[
                      "rounded-full border px-3 py-1 text-sm transition",
                      active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent",
                    ].join(" ")}
                  >
                    {s === "" ? "All" : s}
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No invoices found.</p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/invoices/new">Create your first invoice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invoices</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Due</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((inv) => {
                    const overdue = isOverdue(inv.dueDate, inv.status);
                    return (
                      <tr key={inv.id} className="border-b last:border-b-0 hover:bg-accent/40">
                        <td className="px-4 py-3">
                          <Link
                            href={`/invoices/${inv.id}`}
                            className="font-medium underline underline-offset-4"
                          >
                            {inv.number}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(inv.createdAt).toDateString()}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium">{inv.customer?.name ?? "—"}</div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant="outline" className={statusBadgeClass(inv.status, overdue)}>
                            {overdue ? "overdue" : inv.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {inv.dueDate ? new Date(inv.dueDate).toDateString() : "—"}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right font-semibold">{inv.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
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
          className={`rounded-md border px-3 py-1 ${
            page === totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
