import { requireBusiness } from "@/lib/require-business";
import BusinessSettingsForm from "./components/business-settings-form";

export default async function SettingsPage() {
  const { business } = await requireBusiness();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Business Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your business details used across the app.
        </p>
      </div>

      <BusinessSettingsForm
        business={{
          name: business.name,
          phone: business.phone,
          address: business.address,
          note: business.note,
        }}
      />
    </div>
  );
}
