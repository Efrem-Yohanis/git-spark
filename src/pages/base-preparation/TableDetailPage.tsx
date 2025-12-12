import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Database, Clock, Hash, Columns, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API/state
const mockTableDetails = {
  tableName: "ACTIVE_CUSTOMERS_NOV29",
  columns: ["msisdn", "activation_date", "last_activity", "status", "balance"],
  rowCount: 125432,
  creationTime: 12.5,
  createdAt: "2024-01-15T10:30:00Z",
  request: {
    table_name: "ACTIVE_CUSTOMERS_NOV29",
    data_from: "2024-01-31",
    active_for: 30,
  },
  sql: `CREATE TABLE ACTIVE_CUSTOMERS_NOV29 AS
SELECT msisdn, activation_date, last_activity, status, balance
FROM customers
WHERE last_activity >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);`,
};

export default function TableDetailPage() {
  const { tableName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newTableName, setNewTableName] = useState(`${tableName}_copy`);

  const handleCopyTable = () => {
    if (!newTableName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid table name.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Table Creation Started",
      description: `Creating table "${newTableName}"...`,
    });

    // Simulate table creation
    setTimeout(() => {
      toast({
        title: "Table Created",
        description: `Table "${newTableName}" has been created successfully.`,
      });
    }, 2000);
  };

  const copySQL = () => {
    navigator.clipboard.writeText(mockTableDetails.sql);
    toast({
      title: "Copied!",
      description: "SQL copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="w-full px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Table Details
            </h1>
            <p className="text-muted-foreground mt-1">{tableName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Table Name</p>
                  <p className="font-semibold text-lg">{mockTableDetails.tableName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Columns className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Columns</p>
                  <p className="font-semibold text-lg">{mockTableDetails.columns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Hash className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Row Count</p>
                  <p className="font-semibold text-lg">{mockTableDetails.rowCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creation Time</p>
                  <p className="font-semibold text-lg">{mockTableDetails.creationTime}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Columns className="h-5 w-5" />
                Column Details
              </CardTitle>
              <CardDescription>List of all columns in this table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockTableDetails.columns.map((col, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                    {col}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Parameters
              </CardTitle>
              <CardDescription>Original request used to create this table</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(mockTableDetails.request, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SQL Query
                </CardTitle>
                <CardDescription>The SQL used to generate this table</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={copySQL} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy SQL
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 p-4 rounded-lg text-sm font-mono overflow-auto whitespace-pre-wrap">
              {mockTableDetails.sql}
            </pre>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Create Copy
            </CardTitle>
            <CardDescription>Create a new table with the same structure and data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="newTableName">New Table Name</Label>
                <Input
                  id="newTableName"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value.toUpperCase())}
                  placeholder="Enter new table name..."
                  className="mt-2"
                />
              </div>
              <Button onClick={handleCopyTable} className="gap-2">
                <Copy className="h-4 w-4" />
                Create Table
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
