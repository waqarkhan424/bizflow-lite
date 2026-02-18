"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { auth_login } from "../actions/auth_login";
import type { LoginState } from "../schemas/login-schema";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const initialState: LoginState = { ok: false, message: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(auth_login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-muted/30 relative overflow-hidden">
      {/* soft background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_40rem_at_50%_10%,hsl(var(--primary)/0.18),transparent_60%)]" />

      <Card className="w-full max-w-md rounded-3xl shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-semibold">
              B
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold leading-tight truncate">
                Bizflow Lite
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Login to continue
              </p>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {/* Email */}
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
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary underline underline-offset-4"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-muted-foreground hover:bg-accent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox />
              Remember me
            </label>

            {/* Message */}
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
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary underline underline-offset-4"
              >
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
