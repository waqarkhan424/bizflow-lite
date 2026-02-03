import { prisma } from "@/lib/prisma";

/**
 * Generates next invoice number like INV-0001 per business.
 * Simple approach: count existing invoices and retry if collision happens.
 */
export async function generateInvoiceNumber(businessId: string) {
  const count = await prisma.invoice.count({ where: { businessId } });
  // next candidate based on count
  const next = count + 1;

  // helper
  const format = (n: number) => `INV-${String(n).padStart(4, "0")}`;

  // retry a few times in case of race condition
  for (let i = 0; i < 10; i++) {
    const candidate = format(next + i);

    const exists = await prisma.invoice.findFirst({
      where: { businessId, number: candidate },
      select: { id: true },
    });

    if (!exists) return candidate;
  }

  // fallback: use timestamp-based
  return `INV-${Date.now()}`;
}
