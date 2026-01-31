"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account_delete, type AccountDeleteState } from "../actions/account_delete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AccountDeleteState = { ok: false, message: "" };

export default function DeleteAccountCard() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(account_delete, initialState);

  // after delete, move user to login
  useEffect(() => {
    if (state.ok) router.push("/login");
  }, [state.ok, router]);

  return (
    <Card className="max-w-2xl border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This will permanently delete your account, business, customers, and sessions.
          </p>

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">Type "delete" to confirm</Label>
              <Input id="confirm" name="confirm" placeholder="delete" required />
            </div>

            {state.message ? (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            ) : null}

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete my account"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
