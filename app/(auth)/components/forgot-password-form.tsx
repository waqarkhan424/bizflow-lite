"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { auth_forgotPassword } from "../actions/auth_forgotPassword";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = { ok: false, message: "" };

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    auth_forgotPassword,
    initialState
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-lg items-center justify-center p-4">
        <Card className="w-full rounded-3xl border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="space-y-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground font-semibold">
                B
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold leading-tight">
                  Bizflow Lite
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Recover your account
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Forgot password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we’ll send you a reset link.
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="pl-9"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use the email you registered with.
                </p>
              </div>

              {state.message ? (
                <div
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    state.ok
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700",
                  ].join(" ")}
                >
                  {state.message}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send reset link"}
              </Button>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
