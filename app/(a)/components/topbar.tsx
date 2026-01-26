import { auth_logout } from "@/app/(auth)/actions/auth_logout";
import { Button } from "@/components/ui/button";

export default function Topbar({ businessName, userName, userEmail}: {businessName: string; userName: string; userEmail: string}) {

  return (
    <header className="border-b bg-background">
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{businessName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {userName ? `${userName} • ` : ""}
            {userEmail}
          </p>
        </div>

        <form action={auth_logout}>
          <Button type="submit" variant="outline" size="sm">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
