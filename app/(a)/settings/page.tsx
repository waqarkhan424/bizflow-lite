
import { requireBusiness } from "@/lib/require-business";
import BusinessSettingsForm from "./components/business-settings-form";
import ChangePasswordCard from "./components/change-password-card";
import DeleteAccountCard from "./components/delete-account-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const { business, user } = await requireBusiness();

  return (
    <div className="space-y-6">
      {/* Header (same style as other pages) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your business details, security, and account actions.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">On this page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <a
                href="#business"
                className="block rounded-lg px-2 py-2 hover:bg-accent transition"
              >
                Business details
                <p className="text-xs text-muted-foreground">
                  Name, phone, address, invoice note
                </p>
              </a>

              <a
                href="#security"
                className="block rounded-lg px-2 py-2 hover:bg-accent transition"
              >
                Security
                <p className="text-xs text-muted-foreground">
                  Change your password
                </p>
              </a>

              <a
                href="#danger"
                className="block rounded-lg px-2 py-2 hover:bg-accent transition"
              >
                Danger zone
                <p className="text-xs text-muted-foreground">
                  Permanently delete account
                </p>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>

              <div className="rounded-xl border bg-muted/40 p-3">
                <p className="text-sm font-medium">Tip</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use a strong password. After changing it, you’ll be logged out
                  from all sessions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right content */}
        <div className="lg:col-span-8 space-y-6">
          <section id="business" className="scroll-mt-24">
            <BusinessSettingsForm
              business={{
                name: business.name,
                phone: business.phone,
                address: business.address,
                note: business.note,
              }}
            />
          </section>

          <section id="security" className="scroll-mt-24">
            <ChangePasswordCard />
          </section>

          <section id="danger" className="scroll-mt-24">
            <DeleteAccountCard />
          </section>
        </div>
      </div>
    </div>
  );
}
