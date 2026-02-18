"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { auth_login } from "../actions/auth_login";
import { LoginState } from "../schemas/login-schema";



const initialState: LoginState = { ok: false, message: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(auth_login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {/* Error / message */}
      {state?.message ? (
        <div
          className={[
            "rounded-xl border px-4 py-3 text-sm",
            state.ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </Button>

      <p className="text-xs text-muted-foreground">
        By continuing, you agree to our basic terms and privacy policy.
      </p>
    </form>
  );
}
