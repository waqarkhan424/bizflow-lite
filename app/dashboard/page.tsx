
import { requireUser } from "@/lib/require-user";
import { auth_logout } from "../(auth)/actions/auth_logout";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
 const user = await requireUser();

  return (
    <div className="min-h-screen p-6 space-y-4">

  <div className="flex items-center justify-between">
  <div>
  <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{user?.name ? `, ${user.name}` : ""}! You are logged in.
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
