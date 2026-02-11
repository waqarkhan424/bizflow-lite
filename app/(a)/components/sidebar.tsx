"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard, Users, Receipt, Wallet, BarChart3, User, Settings } from "lucide-react";

const navMain = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Expenses", href: "/expenses", icon: Wallet },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const navAccount = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavItem({href, label, icon: Icon, active}: {href: string; label: string; icon: React.ElementType; active: boolean }) {

  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 items-center justify-center rounded-lg border",
          active
            ? "border-sidebar-border bg-background"
            : "border-transparent bg-transparent group-hover:border-sidebar-border group-hover:bg-background",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="truncate">{label}</span>

      {active ? (
        <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
      ) : null}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-background px-3 py-3">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-semibold">
            B
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-tight truncate">Bizflow Lite</p>
            <p className="text-xs text-muted-foreground truncate">
              Invoices • Expenses • Reports
            </p>
          </div>
        </div>

        {/* Nav */}
        <div className="mt-6 space-y-6">
          <div>
            <p className="px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Workspace
            </p>
            <nav className="mt-2 space-y-1">
              {navMain.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.href)}
                />
              ))}
            </nav>
          </div>

          <div>
            <p className="px-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Account
            </p>
            <nav className="mt-2 space-y-1">
              {navAccount.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.href)}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-sidebar-border bg-background p-3">
          <p className="text-sm font-medium">Tip</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep invoices updated to see accurate profit.
          </p>
        </div>
      </div>
    </div>
  );
}
