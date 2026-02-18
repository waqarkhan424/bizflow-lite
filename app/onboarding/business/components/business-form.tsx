"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { business_upsert, type BusinessUpsertState } from "../actions/business_upsert";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ArrowRight, Building2, Check, MapPin, Phone, ReceiptText } from "lucide-react";

const initialState: BusinessUpsertState = { ok: false, message: "" };

function RowHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>;
}

export default function BusinessForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(business_upsert, initialState);

  useEffect(() => {
    if (state.ok) router.push("/dashboard");
  }, [state.ok, router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-muted/30">
      {/* soft background (same vibe as login) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_10%,hsl(var(--primary)/0.16),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
          {/* Left: onboarding intro */}
          <div className="hidden lg:block">
            <Badge variant="secondary" className="rounded-full">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Onboarding
            </Badge>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Let’s set up your business
            </h1>

            <p className="mt-2 text-sm text-muted-foreground max-w-prose">
              This information will be used on invoices and reports. You can edit it later from
              <span className="font-medium text-foreground"> Settings</span>.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl border bg-background/60 p-4">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Professional invoices</p>
                  <p className="text-xs text-muted-foreground">
                    Your business name + note can appear on the invoice footer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border bg-background/60 p-4">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Better reporting</p>
                  <p className="text-xs text-muted-foreground">
                    Helps keep your dashboard & reports consistent and clean.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border bg-background/60 p-4">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Takes less than a minute</p>
                  <p className="text-xs text-muted-foreground">
                    Only the business name is required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-semibold">
                    B
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-tight">Bizflow Lite</p>
                    <p className="text-xs text-muted-foreground">Business setup</p>
                  </div>
                </div>

                <Badge variant="outline" className="rounded-full">
                  Step 1 of 1
                </Badge>
              </div>

              <div className="pt-2">
                <CardTitle className="text-2xl tracking-tight">Business details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add the basics now. You can update anytime in Settings.
                </p>
              </div>

              {/* tiny progress bar */}
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 w-3/5 rounded-full bg-primary" />
              </div>
            </CardHeader>

            <CardContent className="pb-8">
              <form action={formAction} className="space-y-4">
                {/* Business name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Business name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Bizflow Lite"
                      required
                      className="h-11 pl-10 rounded-xl"
                      autoFocus
                    />
                  </div>
                  <RowHint>This appears on invoices and inside your app.</RowHint>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="e.g. +92 300 1234567"
                      className="h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Office address (optional)"
                      className="h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Invoice note */}
                <div className="space-y-2">
                  <Label htmlFor="note">Invoice footer note (optional)</Label>
                  <div className="relative">
                    <ReceiptText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="note"
                      name="note"
                      placeholder="e.g. Thank you for your business!"
                      className="h-11 pl-10 rounded-xl"
                    />
                  </div>
                  <RowHint>Shown at the bottom of printed invoices (later).</RowHint>
                </div>

                {/* message */}
                {state.message ? (
                  <div
                    className={[
                      "rounded-2xl border p-3 text-sm",
                      state.ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700",
                    ].join(" ")}
                  >
                    {state.message}
                  </div>
                ) : null}

                {/* submit */}
                <Button className="w-full h-11 rounded-2xl" type="submit" disabled={isPending}>
                  {isPending ? (
                    "Saving…"
                  ) : (
                    <>
                      Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By continuing, you’re setting up your workspace for invoices, customers, expenses, and reports.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
