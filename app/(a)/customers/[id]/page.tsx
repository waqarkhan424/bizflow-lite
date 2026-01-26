import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailsPage({params,}: {params: Promise<{ id: string }>}) {
    
  const { business } = await requireBusiness();
  const { id } = await params;

  const customer = await prisma.customer.findFirst({
    where: { id, businessId: business.id },
  });

  if (!customer) notFound();

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">Customer details</p>
        </div>

        <Link href="/customers" className="text-sm underline underline-offset-4 text-primary">
          Back
        </Link>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{customer.email || "—"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{customer.phone || "—"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium">{customer.address || "—"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="font-medium">{customer.createdAt.toDateString()}</p>
        </div>
      </div>
    </div>
  );
}
