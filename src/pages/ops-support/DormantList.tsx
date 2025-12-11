import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Moon, CalendarIcon, Table, Users, TrendingUp, BarChart3, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TableStatus = "idle" | "creating" | "completed";

interface TableProgress {
  stillOnDormant: { status: TableStatus; progress: number };
  backToActive: { status: TableStatus; progress: number };
  performance: { status: TableStatus; progress: number };
}

export default function DormantList() {
  const { toast } = useToast();
  const [tablePostfix, setTablePostfix] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [tableProgress, setTableProgress] = useState<TableProgress>({
    stillOnDormant: { status: "idle", progress: 0 },
    backToActive: { status: "idle", progress: 0 },
    performance: { status: "idle", progress: 0 },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const simulateProgress = (tableKey: keyof TableProgress) => {
    setTableProgress(prev => ({
      ...prev,
      [tableKey]: { status: "creating", progress: 0 }
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTableProgress(prev => ({
          ...prev,
          [tableKey]: { status: "completed", progress: 100 }
        }));
      } else {
        setTableProgress(prev => ({
          ...prev,
          [tableKey]: { status: "creating", progress }
        }));
      }
    }, 500);
  };

  const handleCreateActiveCustomerTable = () => {
    if (!fromDate || !toDate) {
      toast({ title: "Error", description: "Please select both From and To dates", variant: "destructive" });
      return;
    }
    toast({ title: "Creating Active Customer Table", description: `From ${format(fromDate, "PPP")} to ${format(toDate, "PPP")}` });
  };

  const handleCreateStillOnDormantTable = () => {
    if (!tablePostfix) {
      toast({ title: "Error", description: "Please enter table name postfix", variant: "destructive" });
      return;
    }
    simulateProgress("stillOnDormant");
    toast({ title: "Creating Still on Dormant Table", description: `Table: dormant_still_${tablePostfix}` });
  };

  const handleCreateBackToActiveTable = () => {
    if (!tablePostfix) {
      toast({ title: "Error", description: "Please enter table name postfix", variant: "destructive" });
      return;
    }
    simulateProgress("backToActive");
    toast({ title: "Creating Back to Active Table", description: `Table: back_to_active_${tablePostfix}` });
  };

  const handleCreatePerformanceTable = () => {
    if (!tablePostfix) {
      toast({ title: "Error", description: "Please enter table name postfix", variant: "destructive" });
      return;
    }
    simulateProgress("performance");
    toast({ title: "Creating Performance Table", description: `Table: performance_${tablePostfix}` });
  };

  const renderTableCard = (
    title: string,
    tableKey: keyof TableProgress,
    icon: React.ReactNode,
    onClick: () => void
  ) => {
    const { status, progress } = tableProgress[tableKey];
    const isCreating = status === "creating";
    const isCompleted = status === "completed";

    return (
      <Card className="border shadow-sm">
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-medium text-sm">{title}</span>
            </div>
            {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          </div>
          
          {(isCreating || isCompleted) && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {isCreating ? `Creating... ${Math.round(progress)}%` : "Completed"}
              </p>
            </div>
          )}
          
          <Button 
            onClick={onClick} 
            variant="secondary" 
            size="sm"
            className="w-full gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Table</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dormant List
          </h1>
          <p className="text-muted-foreground mt-1">Manage dormant accounts and users</p>
        </div>

        {/* Configuration Card */}
        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Set up table postfix and upload file</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tablePostfix">Table Name Postfix</Label>
                <Input
                  id="tablePostfix"
                  placeholder="Enter postfix (e.g., dec_2024)"
                  value={tablePostfix}
                  onChange={(e) => setTablePostfix(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileInput">File Input</Label>
                <Input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Active Customer Table Card */}
        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create Active Customer Table
            </CardTitle>
            <CardDescription>Select date range to create active customer table</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCreateActiveCustomerTable} className="gap-2">
                <Table className="h-4 w-4" />
                Create Active Customer Table
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Creation Actions Card */}
        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Table Creation Actions
            </CardTitle>
            <CardDescription>Create analysis tables based on dormant data</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderTableCard(
                "Still on Dormant Table",
                "stillOnDormant",
                <Moon className="h-4 w-4 text-muted-foreground" />,
                handleCreateStillOnDormantTable
              )}
              {renderTableCard(
                "Back to Active Table",
                "backToActive",
                <TrendingUp className="h-4 w-4 text-muted-foreground" />,
                handleCreateBackToActiveTable
              )}
              {renderTableCard(
                "Performance Table",
                "performance",
                <BarChart3 className="h-4 w-4 text-muted-foreground" />,
                handleCreatePerformanceTable
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
