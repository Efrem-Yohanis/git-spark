import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, Database, Clock, Columns, Hash, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from state management or API
const getMockTableData = (tableName: string) => ({
  name: tableName,
  status: Math.random() > 0.3 ? "completed" : "failed",
  createdAt: "2025-12-13 10:15:32",
  timeTaken: "2.3s",
  rowCount: Math.floor(Math.random() * 500000) + 10000,
  columns: ["MSISDN", "CUSTOMER_ID"],
  sql: `CREATE TABLE ${tableName} AS (
  SELECT DISTINCT a.MSISDN
  FROM SOURCE_TABLE a
  WHERE a.MSISDN NOT IN (SELECT MSISDN FROM EXCLUDE_TABLE)
);`,
  parameters: {
    baseColumn: "MSISDN",
    filterType: "BASE",
    sourceTable: "SOURCE_TABLE_A",
  },
});

export default function TableDetailPage() {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const decodedName = decodeURIComponent(tableName || "");
  const tableData = getMockTableData(decodedName);
  
  const [newTableName, setNewTableName] = useState(decodedName);
  const [baseColumn, setBaseColumn] = useState(tableData.parameters.baseColumn);
  const [filterType, setFilterType] = useState(tableData.parameters.filterType);
  const [isRunning, setIsRunning] = useState(false);

  const handleRerun = async () => {
    if (!newTableName) {
      toast({
        title: "Missing Table Name",
        description: "Please enter a table name.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Table Creation Started",
      description: `Creating table: ${newTableName}`,
    });
    
    setIsRunning(false);
  };

  const isFailed = tableData.status === "failed";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/base-preparation")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{decodedName}</h1>
            <p className="text-muted-foreground">Table Details & Re-run Options</p>
          </div>
          <div className="ml-auto">
            {tableData.status === "completed" ? (
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Failed
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table Information */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Table Information
              </CardTitle>
              <CardDescription>Details about this table creation</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="font-medium">{tableData.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time Taken</p>
                    <p className="font-medium">{tableData.timeTaken}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Columns className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Columns</p>
                    <p className="font-medium">{tableData.columns.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Row Count</p>
                    <p className="font-medium">
                      {tableData.status === "completed" 
                        ? tableData.rowCount.toLocaleString() 
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold">SQL Query Used</Label>
                <pre className="mt-2 p-3 bg-muted/50 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                  {tableData.sql}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Re-run with Different Parameters */}
          <Card className="border-2">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {isFailed ? "Retry Table Creation" : "Create Copy with New Parameters"}
              </CardTitle>
              <CardDescription>
                {isFailed 
                  ? "Fix parameters and retry the failed table creation"
                  : "Create a new table with modified parameters"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isFailed && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    This table creation failed. Update parameters below and retry.
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-semibold">
                  {isFailed ? "Table Name (Retry)" : "New Table Name"}
                </Label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value.toUpperCase())}
                  placeholder="Enter table name..."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {isFailed 
                    ? "You can keep the same name or change it"
                    : "Enter a different name to create a copy"
                  }
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Base Column</Label>
                <Select value={baseColumn} onValueChange={setBaseColumn}>
                  <SelectTrigger className="mt-1 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="MSISDN">MSISDN</SelectItem>
                    <SelectItem value="CUSTOMER_ID">CUSTOMER_ID</SelectItem>
                    <SelectItem value="ACCOUNT_ID">ACCOUNT_ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold">Filter Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="mt-1 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="BASE">BASE</SelectItem>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="NOT IN">NOT IN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button
                onClick={handleRerun}
                className="w-full h-12 gap-2"
                disabled={isRunning || !newTableName}
              >
                <Play className="h-4 w-4" />
                {isRunning 
                  ? "Creating..." 
                  : isFailed 
                    ? "RETRY TABLE CREATION" 
                    : "CREATE TABLE WITH NEW PARAMETERS"
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
