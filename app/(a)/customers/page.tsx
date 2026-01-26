import { requireBusiness } from "@/lib/require-business";
import CustomerDeleteButton from "./components/customer-delete-button";
import CustomerEditButton from "./components/customer-edit-button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CustomersPage() {
  const { business } = await requireBusiness();

  const customers = await prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link
          href="/customers/new"
          className="text-sm underline underline-offset-4 text-primary"
        >
          Add customer
        </Link>
      </div>

      {customers.length === 0 ? (
        <p className="text-muted-foreground">No customers yet.</p>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <div 
            key={c.id} 
            className="border rounded-lg p-4 flex items-start justify-between gap-4"
            >
            <div> 
              <Link 
               href={`/customers/${c.id}`}
               className="font-medium underline underline-offset-4">
              {c.name}
              </Link>

              <p className="text-sm text-muted-foreground">
                {c.email || "No email"} • {c.phone || "No phone"}
              </p>
              </div> 


              <div className="flex items-center gap-2">

             <CustomerEditButton
                  customer={{
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    address: c.address,
                  }}
                />




              <CustomerDeleteButton customerId={c.id} customerName={c.name} />
           </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
