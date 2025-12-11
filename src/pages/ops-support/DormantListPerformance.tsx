import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function DormantListPerformance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Dormant List Performance
          </h1>
          <p className="text-muted-foreground mt-1">Track and analyze dormant list performance metrics</p>
        </div>

        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>View dormant list performance data and insights</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Dormant list performance analytics will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
