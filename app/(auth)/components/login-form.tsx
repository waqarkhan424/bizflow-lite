"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth_login } from "../actions/auth_login";
import type { LoginState } from "../schemas/login-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const initialState: LoginState = {
  ok: false,
  message: "",
};

export default function LoginForm({ registered = false }: { registered?: boolean }) {
  const [state, formAction, isPending] = useActionState(auth_login, initialState);

  const router = useRouter();
  const searchParams = useSearchParams();



    useEffect(() => {
    if (!registered) return;

    const hasRegistered = searchParams.get("registered") === "1";
    if (!hasRegistered) return;

    // Remove only the "registered" param, keep others if any
    const params = new URLSearchParams(searchParams.toString());
    params.delete("registered");

    const query = params.toString();
    const nextUrl = query ? `/login?${query}` : "/login";

    router.replace(nextUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">

          {registered && !state.message && (
              <p className="text-sm text-green-600">
                Account created successfully. Please log in.
              </p>
            )}



            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
               placeholder="Password"
                required
              />
            </div>


        {state.message && (
              <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </p>
            )}



            <Button type="submit" className="w-full"  disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline underline-offset-4">
                Create account
              </Link>
            </div>


          </form>
        </CardContent>
      </Card>
    </div>
  );
}
