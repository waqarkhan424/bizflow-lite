import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import InvoiceForm from "../components/invoice-form";

export default async function NewInvoicePage() {
  const { business } = await requireBusiness();

  const customers = await prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true },
  });

  return <InvoiceForm customers={customers} />;
}
