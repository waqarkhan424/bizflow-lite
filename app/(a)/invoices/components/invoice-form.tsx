"use client";

import { useActionState, useMemo, useState } from "react";
import { invoice_create, type InvoiceCreateState } from "../actions/invoice_create";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CustomerOption = { id: string; name: string; email: string | null };

const initialState: InvoiceCreateState = { ok: false, message: "" };

function centsFromInput(value: string) {
  // simple: user types like 1000 means "1000" (you can later support decimals)
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}

export default function InvoiceForm({ customers }: { customers: CustomerOption[] }) {
  const [state, formAction, isPending] = useActionState(invoice_create, initialState);

  const [items, setItems] = useState([
    { name: "", qty: 1, rate: 0 }, // rate in cents (or PKR as integer)
  ]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.qty * it.rate), 0);
  }, [items]);

  const total = subtotal;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Invoice</h1>
        <p className="text-sm text-muted-foreground">Create an invoice for a customer.</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Customer */}
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                name="customerId"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select customer
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.email ? ` (${c.email})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                defaultValue="unpaid"
              >
                <option value="draft">Draft</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" name="issueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (optional)</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Items</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setItems((prev) => [...prev, { name: "", qty: 1, rate: 0 }])}
                >
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={idx} className="grid gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <Label className="sr-only">Item name</Label>
                      <Input
                        placeholder="Item name (e.g. Web Design)"
                        value={it.name}
                        onChange={(e) => {
                          const v = e.target.value;
                          setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, name: v } : x)));
                        }}
                      />
                      {/* hidden inputs for server action */}
                      <input type="hidden" name="itemName" value={it.name} />
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="sr-only">Qty</Label>
                      <Input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => {
                          const v = Math.max(1, Number(e.target.value || 1));
                          setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: v } : x)));
                        }}
                      />
                      <input type="hidden" name="itemQty" value={String(it.qty)} />
                    </div>

                    <div className="sm:col-span-3">
                      <Label className="sr-only">Rate</Label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Rate"
                        value={it.rate}
                        onChange={(e) => {
                          const v = centsFromInput(e.target.value);
                          setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, rate: v } : x)));
                        }}
                      />
                      <input type="hidden" name="itemRate" value={String(it.rate)} />
                    </div>

                    <div className="sm:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                        disabled={items.length === 1}
                        title={items.length === 1 ? "At least one item required" : "Remove"}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{total}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  (Right now totals are simple: qty × rate. Later you can add tax/discount.)
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input id="notes" name="notes" placeholder="Extra notes for customer" />
            </div>

            {state.message ? (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            ) : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create invoice"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
