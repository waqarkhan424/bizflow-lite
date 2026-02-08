import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsSummaryCards({income, expenses, profit}: {income: string; expenses: string; profit: string}) {
  
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Income (paid)</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{income}</CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Expenses</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{expenses}</CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Profit</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{profit}</CardContent>
      </Card>
    </div>
  );
}
