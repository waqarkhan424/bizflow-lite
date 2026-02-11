"use client";

import { auth_logout } from "@/app/(auth)/actions/auth_logout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function Topbar({businessName, userName}: {businessName: string; userName: string; userEmail: string }) {
  
  const displayName = userName?.trim() || "User";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur-xl shadow-sm">
      <div className="h-16 px-8 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex flex-col">
          <h2 className="text-base font-semibold tracking-tight">
            {businessName}
          </h2>
          <p className="text-xs text-muted-foreground">
            Welcome back{" "}
            <span className="font-medium text-foreground">
              {displayName}
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          
          {/* Workspace Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Active workspace
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer rounded-full border bg-background px-2 py-1 hover:bg-accent transition">
                
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {initials(displayName)}
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                {displayName}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <form action={auth_logout} className="w-full">
                <button className="flex w-full items-center px-2 py-2 text-sm hover:bg-accent rounded-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
