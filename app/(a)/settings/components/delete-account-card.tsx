
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account_delete, type AccountDeleteState } from "../actions/account_delete";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDesc,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState: AccountDeleteState = { ok: false, message: "" };

export default function DeleteAccountCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(account_delete, initialState);

  // after delete, move user to login
  useEffect(() => {
    if (state.ok) router.push("/login");
  }, [state.ok, router]);

  // close dialog on success
  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Deleting your account is permanent. This will remove your business, customers, and sessions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium">Delete account</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You will not be able to undo this action.
          </p>
        </div>

        {state.message && !state.ok ? (
          <p className="mt-3 text-sm text-red-600">{state.message}</p>
        ) : null}
      </CardContent>

      <CardFooter className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDesc>
                This will permanently delete your account, business, customers, and sessions.
                To confirm, type <span className="font-medium">delete</span> below.
              </DialogDesc>
            </DialogHeader>

            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirm">Type "delete" to confirm</Label>
                <Input id="confirm" name="confirm" placeholder="delete" required />
              </div>

              {state.message && !state.ok ? (
                <p className="text-sm text-red-600">{state.message}</p>
              ) : null}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" variant="destructive" disabled={isPending}>
                  {isPending ? "Deleting..." : "Yes, delete"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
