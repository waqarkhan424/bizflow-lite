"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { invoice_create, type InvoiceCreateState } from "../actions/invoice_create";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CustomerOption = { id: string; name: string; email: string | null };

const initialState: InvoiceCreateState = { ok: false, message: "" };

function centsFromInput(value: string) {
  // simple: user types like 1000 means "1000" (PKR integer)
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}

function moneyPKR(n: number) {
  // UI-only formatting (keep it simple, no decimals)
  try {
    return new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(n);
  }
}

export default function InvoiceForm({ customers }: { customers: CustomerOption[] }) {
  const [state, formAction, isPending] = useActionState(invoice_create, initialState);

  const [items, setItems] = useState([{ name: "", qty: 1, rate: 0 }]); // rate is integer

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.qty || 0) * (it.rate || 0), 0);
  }, [items]);

  const total = subtotal;

  function addRow() {
    setItems((prev) => [...prev, { name: "", qty: 1, rate: 0 }]);
  }

  function removeRow(index: number) {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ name: "", qty: 1, rate: 0 }];
    });
  }

  function updateRow(index: number, patch: Partial<(typeof items)[number]>) {
    setItems((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Create invoice</h1>
          <p className="text-sm text-muted-foreground">
            Pick a customer, add line items, and save. You can change status later.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/invoices">Back</Link>
          </Button>
          {/* Primary action outside the form (uses form attribute) */}
          <Button form="invoice-create-form" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create invoice"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Main form */}
        <div className="lg:col-span-2 space-y-6">
          <form id="invoice-create-form" action={formAction} className="space-y-6">
            {/* Basics */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer */}
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer</Label>
                    <select
                      id="customerId"
                      name="customerId"
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select a customer…
                      </option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                          {c.email ? ` — ${c.email}` : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Only customers belonging to your business can be selected.
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      defaultValue="unpaid"
                    >
                      <option value="draft">Draft</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Start as <span className="font-medium">Unpaid</span> (recommended).
                    </p>
                  </div>

                  {/* Issue date */}
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue date</Label>
                    <Input id="issueDate" name="issueDate" type="date" />
                  </div>

                  {/* Due date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date (optional)</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Line items</CardTitle>
                <Button type="button" variant="outline" onClick={addRow}>
                  Add item
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                <div className="space-y-3">
                  {items.map((it, index) => {
                    const amount = (it.qty || 0) * (it.rate || 0);

                    return (
                      <div
                        key={index}
                        className="rounded-lg border p-3 md:p-0 md:border-0 md:rounded-none"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start md:items-center">
                          {/* Name */}
                          <div className="md:col-span-6 space-y-2 md:space-y-0">
                            <Label className="md:hidden">Item</Label>
                            <Input
                              name="itemName"
                              placeholder="e.g. Website design"
                              value={it.name}
                              onChange={(e) => updateRow(index, { name: e.target.value })}
                            />
                          </div>

                          {/* Qty */}
                          <div className="md:col-span-2 space-y-2 md:space-y-0">
                            <Label className="md:hidden">Qty</Label>
                            <Input
                              name="itemQty"
                              type="number"
                              min={0}
                              value={it.qty}
                              onChange={(e) => updateRow(index, { qty: Number(e.target.value || 0) })}
                            />
                          </div>

                          {/* Rate */}
                          <div className="md:col-span-2 space-y-2 md:space-y-0">
                            <Label className="md:hidden">Rate</Label>
                            <Input
                              name="itemRate"
                              inputMode="numeric"
                              placeholder="0"
                              value={String(it.rate)}
                              onChange={(e) => updateRow(index, { rate: centsFromInput(e.target.value) })}
                            />
                          </div>

                          {/* Amount + remove */}
                          <div className="md:col-span-2 flex md:justify-end items-center gap-2">
                            <div className="w-full md:w-auto md:min-w-[120px] text-left md:text-right">
                              <p className="text-xs text-muted-foreground md:hidden">Amount</p>
                              <p className="font-medium">{moneyPKR(amount)}</p>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeRow(index)}
                              className="shrink-0"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Totals are calculated as <span className="font-medium">qty × rate</span>. Tax/discount can be added later.
                </p>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input id="notes" name="notes" placeholder="Extra notes for the customer (e.g. payment terms)" />
              </CardContent>
            </Card>

            {/* Inline feedback (kept) */}
            {state.message ? (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
            ) : null}

            {/* Mobile submit (since top-right button is visible but this helps flow) */}
            <div className="lg:hidden">
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create invoice"}
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT: Summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{moneyPKR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">{moneyPKR(total)}</span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <Button form="invoice-create-form" type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating..." : "Create invoice"}
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/invoices">Cancel</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you don’t have customers yet, create one first from{" "}
                  <span className="font-medium">Customers</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
