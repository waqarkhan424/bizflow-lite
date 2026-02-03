"use client";

import { useActionState } from "react";
import { expense_create, type ExpenseCreateState } from "../actions/expense_create";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ExpenseCreateState = { ok: false, message: "" };

export default function ExpenseForm() {
  const [state, formAction, isPending] = useActionState(expense_create, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" min={1} placeholder="e.g. 2500" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input id="category" name="category" placeholder="e.g. Fuel, Rent, Internet" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input id="note" name="note" placeholder="e.g. Office dinner / Petrol" />
            </div>

            {state.message ? (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            ) : null}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
