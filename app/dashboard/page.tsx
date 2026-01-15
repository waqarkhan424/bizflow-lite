import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{user.name ? `, ${user.name}` : ""}! You are logged in.
      </p>
    </div>
  );
}
