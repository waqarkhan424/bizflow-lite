import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({title, value, hint, href, icon}: {title: string; value: string; hint?: string; href?: string; icon?: React.ReactNode}) {
  
  const inner = (
    <Card
      className={[
        "relative overflow-hidden",
        "border bg-background",
        href ? "hover:bg-accent/40 transition-colors" : "",
      ].join(" ")}
    >
      {/* subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/40" />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
            {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
          </div>

          {icon ? (
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              {icon}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
