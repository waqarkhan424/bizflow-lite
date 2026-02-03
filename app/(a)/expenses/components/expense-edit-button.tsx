"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { expense_update, type ExpenseUpdateState } from "../actions/expense_update";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Expense = {
  id: string;
  amount: number;
  date: Date;
  note: string | null;
  category: string | null;
};

const initialState: ExpenseUpdateState = { ok: false, message: "" };

function toDateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ExpenseEditButton({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(expense_update, initialState);

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  const defaults = useMemo(() => {
    return {
      amount: String(expense.amount ?? 0),
      date: toDateInputValue(new Date(expense.date)),
      category: expense.category ?? "",
      note: expense.note ?? "",
    };
  }, [expense]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit expense</DialogTitle>
          <DialogDescription>Update expense details and save.</DialogDescription>
        </DialogHeader>

        {!state.ok && state.message ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : null}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="expenseId" value={expense.id} />

          <div className="space-y-2">
            <Label htmlFor={`amount-${expense.id}`}>Amount</Label>
            <Input
              id={`amount-${expense.id}`}
              name="amount"
              type="number"
              min={1}
              defaultValue={defaults.amount}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`date-${expense.id}`}>Date</Label>
            <Input id={`date-${expense.id}`} name="date" type="date" defaultValue={defaults.date} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`category-${expense.id}`}>Category (optional)</Label>
            <Input id={`category-${expense.id}`} name="category" defaultValue={defaults.category} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`note-${expense.id}`}>Note (optional)</Label>
            <Input id={`note-${expense.id}`} name="note" defaultValue={defaults.note} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
