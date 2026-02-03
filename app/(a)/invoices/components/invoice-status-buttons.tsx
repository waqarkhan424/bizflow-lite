"use client";

import { useActionState } from "react";
import { invoice_set_status, type InvoiceStatusState } from "../actions/invoice_set_status";
import { Button } from "@/components/ui/button";

const initialState: InvoiceStatusState = { ok: false, message: "" };

export default function InvoiceStatusButtons({invoiceId, currentStatus}: {invoiceId: string; currentStatus: string}) {
    
  const [state, formAction, isPending] = useActionState(invoice_set_status, initialState);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        {state.message ? (
          <p className={`${state.ok ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
        ) : (
          <p className="text-muted-foreground">Change invoice status.</p>
        )}
      </div>

      <div className="flex gap-2">
        <form action={formAction}>
          <input type="hidden" name="invoiceId" value={invoiceId} />
          <input type="hidden" name="status" value="paid" />
          <Button type="submit" disabled={isPending || currentStatus === "paid"}>
            Mark paid
          </Button>
        </form>

        <form action={formAction}>
          <input type="hidden" name="invoiceId" value={invoiceId} />
          <input type="hidden" name="status" value="unpaid" />
          <Button type="submit" variant="outline" disabled={isPending || currentStatus === "unpaid"}>
            Mark unpaid
          </Button>
        </form>

        <form action={formAction}>
          <input type="hidden" name="invoiceId" value={invoiceId} />
          <input type="hidden" name="status" value="draft" />
          <Button type="submit" variant="outline" disabled={isPending || currentStatus === "draft"}>
            Mark draft
          </Button>
        </form>
      </div>
    </div>
  );
}
