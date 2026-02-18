import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "../components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Soft background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute left-1/2 top-[-120px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <Card className="w-full overflow-hidden rounded-3xl border bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Left panel (desktop) */}
              <div className="hidden md:block bg-muted/30 p-10">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-semibold">
                    B
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-tight">
                      Bizflow Lite
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invoices • Expenses • Reports
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <p className="text-sm font-medium">What you can do:</p>

                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      Track paid/unpaid invoices and monthly income
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      Add expenses and see profit instantly
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      Keep your customer list organized
                    </li>
                  </ul>

                  <div className="mt-8 rounded-2xl border bg-background p-4">
                    <p className="text-sm font-medium">Tip</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep your invoices updated to get accurate reports.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right panel (form) */}
              <div className="p-6 sm:p-10">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Sign in to continue to your workspace.
                  </p>
                </div>

                <div className="mt-8">
                  <LoginForm />
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Don’t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary underline underline-offset-4"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
