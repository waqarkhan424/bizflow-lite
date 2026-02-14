"use client";

import { useActionState } from "react";
import { business_update, type BusinessUpdateState } from "../actions/business_update";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: BusinessUpdateState = { ok: false, message: "" };

export default function BusinessSettingsForm({
  business,
}: {
  business: {
    name: string;
    phone: string | null;
    address: string | null;
    note: string | null;
  };
}) {
  const [state, formAction, isPending] = useActionState(business_update, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business details</CardTitle>
        <CardDescription>
          This information appears on invoices and helps customers recognize your business.
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Vertex Solutions"
              required
              defaultValue={business.name ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g. +92..."
                defaultValue={business.phone ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                name="address"
                placeholder="Office address"
                defaultValue={business.address ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Invoice note (optional)</Label>
            <Input
              id="note"
              name="note"
              placeholder="Shown in invoice footer"
              defaultValue={business.note ?? ""}
            />
          </div>

          {state.message ? (
            <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
              {state.message}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
