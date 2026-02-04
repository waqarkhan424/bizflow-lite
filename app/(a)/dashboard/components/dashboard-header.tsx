
export default function DashboardHeader({userName, businessName, monthLabel}: { userName?: string | null; businessName: string; monthLabel: string;}) {
    
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{userName ? `, ${userName}` : ""}! Business:{" "}
        <span className="font-medium text-foreground">{businessName}</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Month: {monthLabel}</p>
    </div>
  );
}
