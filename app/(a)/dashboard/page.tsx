
import { requireBusiness } from "@/lib/require-business";

export default async function DashboardPage() {
  const { user, business } = await requireBusiness();

  return (
    <div className="space-y-4">

  <div>
  <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{user?.name ? `, ${user.name}` : ""}! Business:{" "}
        <span className="font-medium text-foreground">{business.name}</span>

      </p>
   </div>

    </div>

  );
}
