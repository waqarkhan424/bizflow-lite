import { auth_logout } from "@/app/(auth)/actions/auth_logout";
import { Button } from "@/components/ui/button";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function Topbar({businessName, userName}: {businessName: string; userName: string; userEmail: string;}) {
  
  const displayName = userName?.trim() || "User";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="h-14 px-6 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{businessName}</p>
          <p className="text-xs text-muted-foreground truncate">
            Welcome back, <span className="text-foreground">{displayName}</span>
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border px-2 py-1 bg-background">
              Workspace
            </span>
            <span className="rounded-full border px-2 py-1 bg-background">
              Active
            </span>
          </div>

          <div className="h-9 w-9 rounded-full border bg-background grid place-items-center text-xs font-semibold">
            {initials(displayName)}
          </div>

          <form action={auth_logout}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
