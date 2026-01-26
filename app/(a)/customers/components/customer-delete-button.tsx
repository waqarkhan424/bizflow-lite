"use client";

import { useActionState, useEffect, useState } from "react";
import { customer_delete, type CustomerDeleteState } from "../actions/customer_delete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState: CustomerDeleteState = { ok: false, message: "" };

export default function CustomerDeleteButton({customerId, customerName}: {customerId: string; customerName: string}) {
    
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(customer_delete, initialState);

  // close dialog after success
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete customer?</DialogTitle>
          <DialogDescription>
            This will permanently delete <span className="font-medium">{customerName}</span>.
          </DialogDescription>
        </DialogHeader>

        {!state.ok && state.message ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : null}

        <form action={formAction}>
          <input type="hidden" name="customerId" value={customerId} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
