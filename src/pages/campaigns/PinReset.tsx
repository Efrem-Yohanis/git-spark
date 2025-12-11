import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function PinReset() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-primary" />
            Pin Reset
          </h1>
          <p className="text-muted-foreground mt-1">GA Pin Reset Campaign Management</p>
        </div>

        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle>Pin Reset Campaign</CardTitle>
            <CardDescription>Manage pin reset campaigns for GA customers</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Pin Reset campaign management content will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
