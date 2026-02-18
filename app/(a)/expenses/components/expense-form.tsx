"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { expense_create, type ExpenseCreateState } from "../actions/expense_create";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ExpenseCreateState = { ok: false, message: "" };

const SUGGESTED_CATEGORIES = [
  "Fuel",
  "Rent",
  "Internet",
  "Utilities",
  "Office",
  "Food",
  "Travel",
];

export default function ExpenseForm() {
  const [state, formAction, isPending] = useActionState(expense_create, initialState);

  const today = useMemo(() => {
    // yyyy-mm-dd for <input type="date" />
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [category, setCategory] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add expense</CardTitle>
        <CardDescription>
          Enter amount + date, optionally add category and note for better reporting.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="expense-create-form" action={formAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={1}
                placeholder="e.g. 2500"
                required
              />
              <p className="text-xs text-muted-foreground">
                Tip: enter total amount (no commas).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={today} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g. Fuel, Rent, Internet"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTED_CATEGORIES.map((c) => {
                  const active = category.trim().toLowerCase() === c.toLowerCase();
                  return (
                    <Button
                      key={c}
                      type="button"
                      size="sm"
                      variant={active ? "default" : "secondary"}
                      onClick={() => setCategory(c)}
                      className="h-8 rounded-full"
                    >
                      {c}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input id="note" name="note" placeholder="e.g. Office dinner / Petrol" />
            </div>

            {state.message ? (
              <p className={`text-sm sm:col-span-2 ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button asChild type="button" variant="outline">
          <Link href="/expenses">Cancel</Link>
        </Button>

        <Button form="expense-create-form" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save expense"}
        </Button>
      </CardFooter>
    </Card>
  );
}
