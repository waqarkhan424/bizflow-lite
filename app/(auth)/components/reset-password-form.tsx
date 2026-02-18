"use client";

import { useActionState } from "react";
import Link from "next/link";
import { auth_resetPassword } from "../actions/auth_resetPassword";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Lock, ShieldCheck, ArrowRight, KeyRound } from "lucide-react";

const initialState = { ok: false, message: "" };

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(auth_resetPassword, initialState);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--muted-foreground)/0.12)_1px,transparent_0)] [background-size:22px_22px] opacity-40" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left: Intro panel */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure password update
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Reset your password
              </h1>

              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Choose a strong new password to protect your Bizflow Lite account.
                After updating, you can login again.
              </p>

              <div className="grid gap-3 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border bg-background/70 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Use a strong password</p>
                    <p className="text-sm text-muted-foreground">
                      Mix letters, numbers, and symbols for better security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border bg-background/70 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
                    <KeyRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">One-time secure link</p>
                    <p className="text-sm text-muted-foreground">
                      This reset link is unique and should be used once.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                Tip: avoid using your name, phone number, or easy patterns.
              </div>
            </div>
          </div>

          {/* Right: Form card */}
          <Card className="relative w-full overflow-hidden rounded-3xl border bg-background/70 shadow-sm backdrop-blur">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Set a new password to continue
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full">
                  Account
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {!token ? (
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-medium text-red-600">Missing token</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please open the reset link from your email again.
                  </p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="token" value={token} />

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter a new password"
                      required
                      className="h-11 rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      Make it at least 8 characters (stronger is better).
                    </p>
                  </div>

                  {state.message && (
                    <div
                      className={`rounded-2xl border p-3 text-sm ${
                        state.ok
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {state.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      "Updating..."
                    ) : (
                      <>
                        Update password <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="rounded-2xl border bg-background p-4 text-center">
                <div className="text-sm text-muted-foreground">
                  Remember your password?
                </div>
                <Link
                  href="/login"
                  className="mt-1 inline-flex items-center justify-center text-sm font-medium text-primary underline underline-offset-4"
                >
                  Go to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
