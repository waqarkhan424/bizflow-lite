import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import CustomerEditButton from "./customer-edit-button";
import CustomerDeleteButton from "./customer-delete-button";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function CustomerRow({
  customer,
}: {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}) {
  const title = customer.name?.trim() || "Unnamed";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex min-w-0 gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
            {initials(title)}
          </div>

          <div className="min-w-0">
            <Link
              href={`/customers/${customer.id}`}
              className="block font-medium leading-6 truncate hover:underline underline-offset-4"
            >
              {title}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {customer.email ? (
                <Badge variant="secondary" className="gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="max-w-[220px] truncate">{customer.email}</span>
                </Badge>
              ) : (
                <Badge variant="outline">No email</Badge>
              )}

              {customer.phone ? (
                <Badge variant="secondary" className="gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{customer.phone}</span>
                </Badge>
              ) : (
                <Badge variant="outline">No phone</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <CustomerEditButton customer={customer} />
          <CustomerDeleteButton customerId={customer.id} customerName={title} />
        </div>
      </div>
    </Card>
  );
}
