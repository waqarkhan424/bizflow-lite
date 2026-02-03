"use client";

import { useActionState, useEffect, useState } from "react";
import { expense_delete, type ExpenseDeleteState } from "../actions/expense_delete";
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

const initialState: ExpenseDeleteState = { ok: false, message: "" };

export default function ExpenseDeleteButton({ expenseId, note }: { expenseId: string; note: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(expense_delete, initialState);

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
          <DialogTitle>Delete expense?</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium">{note || "this expense"}</span>.
          </DialogDescription>
        </DialogHeader>

        {!state.ok && state.message ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : null}

        <form action={formAction}>
          <input type="hidden" name="expenseId" value={expenseId} />

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
