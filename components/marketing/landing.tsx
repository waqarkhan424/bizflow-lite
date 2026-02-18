import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowRight,
  Receipt,
  Users,
  BarChart3,
  Wallet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step({
  no,
  title,
  desc,
}: {
  no: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
          {no}
        </div>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* same style vibe as your auth pages background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--muted-foreground)/0.12)_1px,transparent_0)] [background-size:22px_22px] opacity-40" />

      {/* Top Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Bizflow Lite</div>
            <div className="text-xs text-muted-foreground">Simple business tracking</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <Badge variant="secondary" className="rounded-full">
              <ShieldCheck className="mr-2 h-3.5 w-3.5" />
              Single owner • Fast • Clean
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Run your small business with clarity.
            </h1>

            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Track customers, invoices, and expenses. See monthly profit in seconds —
              without complicated setup.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="rounded-2xl">
                <Link href="/register">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="rounded-2xl">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
              <span className="rounded-full border bg-background px-3 py-1">Invoices</span>
              <span className="rounded-full border bg-background px-3 py-1">Expenses</span>
              <span className="rounded-full border bg-background px-3 py-1">Reports</span>
              <span className="rounded-full border bg-background px-3 py-1">Export ready</span>
            </div>
          </div>

          {/* Right Side “Preview” */}
          <div className="relative">
            <div className="rounded-3xl border bg-background/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">This month snapshot</div>
                  <div className="text-xs text-muted-foreground">Example preview</div>
                </div>
                <Badge className="rounded-full" variant="secondary">
                  Live-style UI
                </Badge>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Income</div>
                  <div className="mt-1 text-xl font-semibold">120,000</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Expenses</div>
                  <div className="mt-1 text-xl font-semibold">45,000</div>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Profit</div>
                  <div className="mt-1 text-xl font-semibold">75,000</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Invoice INV-0032</div>
                      <div className="text-xs text-muted-foreground">Paid • Today</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">18,000</div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Expense</div>
                      <div className="text-xs text-muted-foreground">Transport • Yesterday</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">2,500</div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>

        {/* Features */}
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Everything you need</h2>
              <p className="text-sm text-muted-foreground">
                Clean modules that match your app: Customers, Invoices, Expenses, Reports.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              icon={Users}
              title="Customers"
              desc="Keep your customer list organized with search and pagination."
            />
            <FeatureCard
              icon={Receipt}
              title="Invoices"
              desc="Create invoices, track status, and keep billing consistent."
            />
            <FeatureCard
              icon={Wallet}
              title="Expenses"
              desc="Record spending with date, category, and notes."
            />
            <FeatureCard
              icon={BarChart3}
              title="Reports"
              desc="See monthly performance: income, expenses, profit."
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start in minutes. No heavy setup.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Step
              no="1"
              title="Create account"
              desc="Sign up and login from your device."
            />
            <Step
              no="2"
              title="Add business"
              desc="Set your business name, phone, address, and invoice note."
            />
            <Step
              no="3"
              title="Track & view reports"
              desc="Add customers, invoices, expenses — then see monthly profit."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <div className="rounded-3xl border bg-background/70 p-8 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Ready to build your business flow?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your account and start tracking today.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild size="lg" className="rounded-2xl">
                  <Link href="/register">
                    Get started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-2xl">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Bizflow Lite</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            Simple • Professional • Fast
          </span>
        </footer>
      </main>
    </div>
  );
}
