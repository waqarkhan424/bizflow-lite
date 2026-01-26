
import { requireBusiness } from "@/lib/require-business";
import { auth_logout } from "@/app/(auth)/actions/auth_logout";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { user, business } = await requireBusiness();

  return (
    <div className="space-y-4">

  <div className="flex items-center justify-between">
  <div>
  <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{user?.name ? `, ${user.name}` : ""}! Business:{" "}
        <span className="font-medium text-foreground">{business.name}</span>

      </p>
   </div>

    <form action={auth_logout}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
    </div>
    </div>

  );
}
