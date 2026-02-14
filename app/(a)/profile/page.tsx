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

  const name = dbUser?.name ?? user.name ?? "";
  const email = dbUser?.email ?? user.email;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account details and sessions.
          </p>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileNameCard defaultName={name} email={email} />
        <LogoutAllDevicesCard />
      </div>
    </div>
  );
}
