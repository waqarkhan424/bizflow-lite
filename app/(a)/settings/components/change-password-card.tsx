"use client";

import { useActionState } from "react";
import { password_change, type PasswordChangeState } from "../actions/password_change";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: PasswordChangeState = { ok: false, message: "" };

export default function ChangePasswordCard() {
  const [state, formAction, isPending] = useActionState(password_change, initialState);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" name="newPassword" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>

          {state.message ? (
            <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
