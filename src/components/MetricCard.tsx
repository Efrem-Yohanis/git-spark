import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  period: "daily" | "30-day" | "90-day";
  onNavigate?: () => void;
}

const generateMockValue = (period: "daily" | "30-day" | "90-day") => {
  if (period === "daily") {
    return Math.floor(Math.random() * 5000) + 10000;
  } else if (period === "30-day") {
    return Math.floor(Math.random() * 150000) + 300000;
  } else {
    return Math.floor(Math.random() * 450000) + 900000;
  }
};

export function MetricCard({ title, period, onNavigate }: MetricCardProps) {
  const value = generateMockValue(period);
  const periodLabel = period === "daily" ? "Daily" : period === "30-day" ? "30-Day" : "90-Day";

  return (
    <Card className="group relative overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border/50 animate-fade-in bg-gradient-card" onClick={onNavigate}>
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <CardHeader className="pb-3 relative">
        <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="bg-gradient-subtle rounded-xl p-6 text-center border border-primary/10 group-hover:border-primary/20 transition-colors">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">{periodLabel}</p>
          <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
