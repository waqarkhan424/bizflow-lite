"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { customer_update, type CustomerUpdateState } from "../actions/customer_update";
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

type CustomerEditButtonProps = {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
};

const initialState: CustomerUpdateState = { ok: false, message: "" };

export default function CustomerEditButton({ customer }: CustomerEditButtonProps) {
    
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(customer_update, initialState);

  // close dialog after success
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  // key trick: when you open dialog, inputs should show current values
  const defaults = useMemo(() => {
    return {
      name: customer.name ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
    };
  }, [customer]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
          <DialogDescription>Update customer details and save.</DialogDescription>
        </DialogHeader>

        {!state.ok && state.message ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : null}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="customerId" value={customer.id} />

          <div className="space-y-2">
            <Label htmlFor={`name-${customer.id}`}>Customer Name</Label>
            <Input
              id={`name-${customer.id}`}
              name="name"
              placeholder="e.g. Ali Khan"
              required
              defaultValue={defaults.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`email-${customer.id}`}>Email (optional)</Label>
            <Input
              id={`email-${customer.id}`}
              name="email"
              type="email"
              placeholder="e.g. ali@gmail.com"
              defaultValue={defaults.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`phone-${customer.id}`}>Phone (optional)</Label>
            <Input
              id={`phone-${customer.id}`}
              name="phone"
              placeholder="e.g. +92..."
              defaultValue={defaults.phone}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`address-${customer.id}`}>Address (optional)</Label>
            <Input
              id={`address-${customer.id}`}
              name="address"
              placeholder="Customer address"
              defaultValue={defaults.address}
            />
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
