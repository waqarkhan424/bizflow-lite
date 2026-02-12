import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Point = { label: string; income: number; expenses: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildLine(points: number[], w: number, h: number, pad: number) {
  const max = Math.max(...points, 1);
  const min = 0;

  const stepX = (w - pad * 2) / Math.max(points.length - 1, 1);

  const toY = (v: number) => {
    const t = (v - min) / (max - min || 1);
    return pad + (1 - t) * (h - pad * 2);
  };

  const coords = points.map((v, i) => {
    const x = pad + i * stepX;
    const y = toY(v);
    return { x, y };
  });

  const d = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");

  return { d, coords, max };
}

export default function OverviewChart({title = "Overview", subtitle = "Last 6 months", data}: {title?: string; subtitle?: string; data: Point[]}) {
    
  const w = 640;
  const h = 220;
  const pad = 18;

  const incomes = data.map((d) => d.income);
  const expenses = data.map((d) => d.expenses);

  const incomeLine = buildLine(incomes, w, h, pad);
  const expenseLine = buildLine(expenses, w, h, pad);

  // Put both lines on same scale (use global max)
  const globalMax = Math.max(incomeLine.max, expenseLine.max, 1);

  const normalize = (vals: number[]) => vals.map((v) => (v / globalMax) * 1000);

  const incomeNorm = buildLine(normalize(incomes), w, h, pad);
  const expenseNorm = buildLine(normalize(expenses), w, h, pad);

  const last = data[data.length - 1];
  const lastIncome = last?.income ?? 0;
  const lastExpenses = last?.expenses ?? 0;
  const profit = lastIncome - lastExpenses;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">This month profit</p>
            <p className="text-sm font-semibold">{profit.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="rounded-xl border bg-muted/20 p-3">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px]">
            {/* grid */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = pad + (i * (h - pad * 2)) / 4;
              return (
                <line
                  key={i}
                  x1={pad}
                  x2={w - pad}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  opacity={0.08}
                />
              );
            })}

            {/* expenses line */}
            <path
              d={expenseNorm.d}
              fill="none"
              stroke="currentColor"
              opacity={0.45}
              strokeWidth={2.5}
            />

            {/* income line (primary) */}
            <path
              d={incomeNorm.d}
              fill="none"
              stroke="currentColor"
              opacity={0.9}
              strokeWidth={3}
            />

            {/* dots on last point */}
            {incomeNorm.coords.length ? (
              <>
                <circle
                  cx={incomeNorm.coords[incomeNorm.coords.length - 1].x}
                  cy={incomeNorm.coords[incomeNorm.coords.length - 1].y}
                  r={5}
                  fill="currentColor"
                />
                <circle
                  cx={expenseNorm.coords[expenseNorm.coords.length - 1].x}
                  cy={expenseNorm.coords[expenseNorm.coords.length - 1].y}
                  r={5}
                  fill="currentColor"
                  opacity={0.6}
                />
              </>
            ) : null}
          </svg>

          {/* legend */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Income
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/40" />
              Expenses
            </span>
          </div>

          {/* x labels */}
          <div className="mt-2 grid grid-cols-6 gap-2 text-[11px] text-muted-foreground">
            {data.slice(0, 6).map((d, i) => (
              <div key={i} className="truncate">
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
