import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

import CustomersPagination from "./components/customers-pagination";
import CustomerRow from "./components/customer-row";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { business } = await requireBusiness();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const q = (sp.q ?? "").trim();
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    businessId: business.id,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
            <Badge variant="secondary" className="rounded-full">
              {total}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your customers, quickly edit details, and keep your invoices organized.
          </p>
        </div>

        <Button asChild>
          <Link href="/customers/new">Add customer</Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, or phone…"
            className="sm:max-w-md"
          />
          <div className="flex items-center gap-2">
            <Button type="submit" variant="secondary">
              Search
            </Button>

            {/* Clear */}
            {q ? (
              <Button asChild variant="ghost">
                <Link href="/customers">Clear</Link>
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {/* List */}
      {customers.length === 0 ? (
        <Card className="p-10">
          <div className="space-y-2 text-center">
            <p className="text-base font-medium">No customers found</p>
            <p className="text-sm text-muted-foreground">
              {q ? "Try a different search term." : "Add your first customer to start creating invoices."}
            </p>
            <div className="pt-2">
              <Button asChild>
                <Link href="/customers/new">Add customer</Link>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <CustomerRow
              key={c.id}
              customer={{
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
              }}
            />
          ))}

          <CustomersPagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
