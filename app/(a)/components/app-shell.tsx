import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({children, businessName, userName, userEmail}: {children: React.ReactNode; businessName: string; userName: string; userEmail: string}) {

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 border-r min-h-screen">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <Topbar
            businessName={businessName}
            userName={userName}
            userEmail={userEmail}
          />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
