"use client";

import { useActionState } from "react";
import { customer_create, type CustomerCreateState } from "../actions/customer_create";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: CustomerCreateState = { ok: false, message: "" };

export default function CustomerForm() {
  const [state, formAction, isPending] = useActionState(customer_create, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Customer</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
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

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" name="address" placeholder="Customer address" />
            </div>

            {state.message && (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            )}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Customer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
