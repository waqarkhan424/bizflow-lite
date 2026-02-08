"use client";

import { useActionState } from "react";
import { profile_updateName, type ProfileUpdateNameState } from "../actions/profile_updateName";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ProfileUpdateNameState = { ok: false, message: "" };

export default function ProfileNameCard({defaultName, email}: {defaultName: string; email: string}) {
    
  const [state, formAction, isPending] = useActionState(profile_updateName, initialState);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">Email: {email}</div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" defaultValue={defaultName} placeholder="Your name" />
          </div>

          {state.message ? (
            <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
