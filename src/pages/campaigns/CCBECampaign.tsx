import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function CCBECampaign() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CCBE Campaign</h1>
        <p className="text-muted-foreground text-sm mt-1">Campaign management for CCBE</p>
      </div>

      <Card className="p-12 text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Coming Soon</p>
          <p className="text-sm text-muted-foreground">This feature is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
