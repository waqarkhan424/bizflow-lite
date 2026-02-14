"use client";

import { useActionState } from "react";
import {
  profile_updateName,
  type ProfileUpdateNameState,
} from "../actions/profile_updateName";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Mail, UserRound, CheckCircle2, AlertTriangle } from "lucide-react";

const initialState: ProfileUpdateNameState = { ok: false, message: "" };

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function ProfileNameCard({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const displayName = defaultName?.trim() || "User";
  const [state, formAction, isPending] = useActionState(
    profile_updateName,
    initialState
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-muted-foreground" />
          Account details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        {/* Mini header row */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {initials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="font-medium leading-tight truncate">{displayName}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={defaultName}
              placeholder="Your name"
            />
          </div>

          {/* Feedback */}
          {state.message ? (
            <div
              className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                state.ok
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {state.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4" />
              )}
              <p>{state.message}</p>
            </div>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
