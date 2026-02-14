"use client";

import Link from "next/link";
import { useActionState } from "react";
import { customer_create, type CustomerCreateState } from "../actions/customer_create";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CustomerCreateState = { ok: false, message: "" };

export default function CustomerForm() {
  const [state, formAction, isPending] = useActionState(customer_create, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add customer</CardTitle>
        <CardDescription>
          Create a customer profile so you can quickly generate invoices and track payments.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="customer-create-form" action={formAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Customer name</Label>
              <Input id="name" name="name" placeholder="e.g. Ali Khan" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" name="email" type="email" placeholder="e.g. ali@gmail.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="e.g. +92..." />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" name="address" placeholder="Customer address" />
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
          <Link href="/customers">Cancel</Link>
        </Button>

        <Button form="customer-create-form" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save customer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
