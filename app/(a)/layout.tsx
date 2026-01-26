import { requireBusiness } from "@/lib/require-business";
import AppShell from "./components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, business } = await requireBusiness();

  return (
    <AppShell
      userName={user?.name ?? ""}
      userEmail={user.email}
      businessName={business.name}
    >
      {children}
    </AppShell>
  );
}
