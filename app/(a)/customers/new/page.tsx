import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { requireBusiness } from "@/lib/require-business";
import CustomerForm from "../components/customer-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function NewCustomerPage() {
  await requireBusiness(); // protect this route

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add customer</h1>
          <p className="text-sm text-muted-foreground">
            Save customer details for invoices, payments, and future records.
          </p>
        </div>

        <Button asChild variant="outline" className="w-fit">
          <Link href="/customers" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to customers
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CustomerForm />
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md border p-2">
                <Info className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Tips</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Name is required (used on invoices).</li>
                  <li>• Email/phone help for contact and records.</li>
                  <li>• You can edit or delete customers anytime.</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-medium">Next step</p>
            <p className="mt-1 text-sm text-muted-foreground">
              After creating a customer, you can create an invoice from the invoices page.
            </p>
            <div className="mt-3">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/invoices/new">Create invoice</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
