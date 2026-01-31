import { requireBusiness } from "@/lib/require-business";
import BusinessSettingsForm from "./components/business-settings-form";
import ChangePasswordCard from "./components/change-password-card";
import DeleteAccountCard from "./components/delete-account-card";

export default async function SettingsPage() {
  const { business } = await requireBusiness();

  return (
    <div className="space-y-6">

      <div> 
       <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your business and account settings.
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

    <ChangePasswordCard />

      <DeleteAccountCard />

    </div>
  );
}
