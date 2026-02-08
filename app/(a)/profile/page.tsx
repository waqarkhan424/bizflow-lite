import { requireBusiness } from "@/lib/require-business";
import { prisma } from "@/lib/prisma";
import ProfileNameCard from "./components/profile-name-card";
import LogoutAllDevicesCard from "./components/logout-all-devices-card";

export default async function ProfilePage() {
  const { user } = await requireBusiness();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Update your account info.</p>
      </div>

      <ProfileNameCard
        defaultName={dbUser?.name ?? ""}
        email={dbUser?.email ?? user.email}
      />

      <LogoutAllDevicesCard />
    </div>
  );
}
