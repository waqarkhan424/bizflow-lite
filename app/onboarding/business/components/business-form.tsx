"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { business_upsert, type BusinessUpsertState } from "../actions/business_upsert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: BusinessUpsertState = { ok: false, message: "" };

export default function BusinessForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(business_upsert, initialState);

  useEffect(() => {
    if (state.ok) router.push("/dashboard");
  }, [state.ok, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Business Setup</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input id="name" name="name" placeholder="e.g. BizFlow Lite" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="e.g. +92..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input id="address" name="address" placeholder="Office address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input id="note" name="note" placeholder="Invoice footer note" />
            </div>

            {state.message && (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            )}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
