import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link, Calendar, Users, Clock, DollarSign, Target, Rocket, Gift, Smartphone, CreditCard, X, Database, Copy, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableConfig {
  id: string;
  label: string;
  icon: any;
  borderColor: string;
  fields: { [key: string]: string };
}

interface TableStatus {
  name: string;
  status: "pending" | "running" | "completed" | "error";
  time: number;
  parameters: string;
}

interface JoinConfig {
  id: string;
  tableId: string;
  joinType: "JOIN" | "LEFT JOIN";
  joinKey: string;
}

const availableTables = [
  { id: "vlr", label: "VLR ATTACHMENT", icon: Link, borderColor: "border-l-blue-500", alias: "vlr" },
  { id: "registered", label: "REGISTERED BEFORE", icon: Calendar, borderColor: "border-l-purple-500", alias: "reg" },
  { id: "active", label: "ACTIVE USERS", icon: Users, borderColor: "border-l-green-500", alias: "act" },
  { id: "inactive", label: "INACTIVE USERS", icon: Clock, borderColor: "border-l-orange-500", alias: "inact" },
  { id: "balance", label: "BALANCE THRESHOLD", icon: DollarSign, borderColor: "border-l-yellow-500", alias: "bal" },
  { id: "targeted", label: "TARGETED USERS", icon: Target, borderColor: "border-l-red-500", alias: "tgt" },
  { id: "rewarded", label: "REWARDED", icon: Gift, borderColor: "border-l-pink-500", alias: "rwd" },
  { id: "gsm", label: "GSM USAGE", icon: Smartphone, borderColor: "border-l-cyan-500", alias: "gsm" },
  { id: "topup", label: "MPESA TOP UP", icon: CreditCard, borderColor: "border-l-indigo-500", alias: "topup" },
];

export default function BasePreparation() {
  const { toast } = useToast();
  const [postfix, setPostfix] = useState("NOV29");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TableConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  
  // SQL Builder state
  const [baseTable, setBaseTable] = useState<string>("");
  const [joins, setJoins] = useState<JoinConfig[]>([]);
  const [generatedSQL, setGeneratedSQL] = useState<string>("");

  const handleAddTable = () => {
    if (!selectedTableId) return;
    
    const table = availableTables.find(t => t.id === selectedTableId);
    if (!table) return;
    
    // Check if already added
    if (selectedTables.some(t => t.id === selectedTableId)) {
      toast({
        title: "Already Added",
        description: "This table is already in your configuration.",
        variant: "destructive"
      });
      return;
    }

    const newTable: TableConfig = {
      ...table,
      fields: { field1: "", field2: "" }
    };
    
    setSelectedTables([...selectedTables, newTable]);
    setSelectedTableId("");
  };

  const handleRemoveTable = (tableId: string) => {
    setSelectedTables(selectedTables.filter(t => t.id !== tableId));
  };

  const updateTableField = (tableId: string, fieldName: string, value: string) => {
    setSelectedTables(selectedTables.map(table => 
      table.id === tableId 
        ? { ...table, fields: { ...table.fields, [fieldName]: value } }
        : table
    ));
  };

  const getAllTables = () => {
    return selectedTables.map(table => ({
      name: `${table.label.replace(/ /g, "_")}_${postfix}`,
      status: "pending" as const,
      time: 0,
      parameters: `${table.fields.field1 || "N/A"}, ${table.fields.field2 || "N/A"}`
    }));
  };

  const handleGenerate = () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Tables Selected",
        description: "Please select at least one table to generate.",
        variant: "destructive"
      });
      return;
    }

    const tables = getAllTables();
    // Add PIN RESET BASE as final table
    tables.push({
      name: `PIN_RESET_BASE_${postfix}`,
      status: "pending",
      time: 0,
      parameters: "All pre-requisite tables"
    });

    setTableStatuses(tables);
    setIsGenerating(true);
    setStartTime(Date.now());
    
    toast({
      title: "Starting Generation",
      description: `Generating ${tables.length} base tables...`,
    });

    simulateTableGeneration(tables.length);
  };

  const simulateTableGeneration = (tableCount: number) => {
    const completionTimes = Array(tableCount).fill(0).map(() => Math.floor(Math.random() * 10000) + 5000);
    
    completionTimes.forEach((time, index) => {
      setTimeout(() => {
        setTableStatuses(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: "running", time: 0 };
          return updated;
        });

        const interval = setInterval(() => {
          setTableStatuses(prev => {
            const updated = [...prev];
            if (updated[index].status === "running") {
              updated[index] = { ...updated[index], time: updated[index].time + 1 };
            }
            return updated;
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          setTableStatuses(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], status: "completed", time: time / 1000 };
            return updated;
          });

          if (index === completionTimes.length - 1) {
            setIsGenerating(false);
            toast({
              title: "Generation Complete",
              description: "All base tables have been successfully created!",
            });
          }
        }, time);
      }, index * 2000);
    });
  };

  const getStatusBadge = (status: TableStatus["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">🟢 Completed</Badge>;
      case "running":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">🟡 Running</Badge>;
      case "pending":
        return <Badge variant="secondary">⚪ Pending</Badge>;
      case "error":
        return <Badge variant="destructive">🔴 Error</Badge>;
    }
  };

  // SQL Builder functions
  const addJoin = () => {
    const newJoin: JoinConfig = {
      id: `join_${Date.now()}`,
      tableId: "",
      joinType: "JOIN",
      joinKey: "msisdn",
    };
    setJoins([...joins, newJoin]);
  };

  const removeJoin = (joinId: string) => {
    setJoins(joins.filter(j => j.id !== joinId));
  };

  const updateJoin = (joinId: string, field: keyof JoinConfig, value: string) => {
    setJoins(joins.map(j => 
      j.id === joinId ? { ...j, [field]: value } : j
    ));
  };

  const generateSQL = () => {
    if (!baseTable) {
      toast({
        title: "Select Base Table",
        description: "Please select a base table first.",
        variant: "destructive"
      });
      return;
    }

    const baseTableData = availableTables.find(t => t.id === baseTable);
    if (!baseTableData) return;

    const baseTableName = `${baseTableData.label.replace(/ /g, "_")}_${postfix}`;
    const baseAlias = baseTableData.alias;

    let sql = `SELECT \n  ${baseAlias}.*`;
    
    // Add selected columns from joined tables
    joins.forEach(join => {
      const joinTable = availableTables.find(t => t.id === join.tableId);
      if (joinTable) {
        sql += `,\n  ${joinTable.alias}.*`;
      }
    });

    sql += `\nFROM ${baseTableName} ${baseAlias}`;

    // Add joins
    joins.forEach(join => {
      const joinTable = availableTables.find(t => t.id === join.tableId);
      if (joinTable && join.joinKey) {
        const joinTableName = `${joinTable.label.replace(/ /g, "_")}_${postfix}`;
        sql += `\n${join.joinType} ${joinTableName} ${joinTable.alias}`;
        sql += `\n  ON ${baseAlias}.${join.joinKey} = ${joinTable.alias}.${join.joinKey}`;
      }
    });

    sql += ";";
    setGeneratedSQL(sql);
    
    toast({
      title: "SQL Generated",
      description: "Your SQL query has been generated successfully.",
    });
  };

  const copySQL = () => {
    navigator.clipboard.writeText(generatedSQL);
    toast({
      title: "Copied!",
      description: "SQL copied to clipboard.",
    });
  };

  const completedTables = tableStatuses.filter(t => t.status === "completed").length;
  const availableToSelect = availableTables.filter(
    table => !selectedTables.some(st => st.id === table.id)
  );
  const availableForJoin = availableTables.filter(
    table => table.id !== baseTable && !joins.some(j => j.tableId === table.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Base Preparation Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Configure and generate base tables</p>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-elegant">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                ⚙️ BASE TABLE CONFIGURATION
              </CardTitle>
              <CardDescription>Select tables and configure parameters</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="postfix" className="text-base font-semibold">Table Postfix</Label>
                  <Input 
                    id="postfix"
                    type="text" 
                    value={postfix} 
                    onChange={(e) => setPostfix(e.target.value.toUpperCase())} 
                    placeholder="e.g., NOV29"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Appended to all table names</p>
                </div>

                <div>
                  <Label className="text-base font-semibold">Add Tables</Label>
                  <div className="flex gap-2 mt-2">
                    <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                      <SelectTrigger className="flex-1 bg-background">
                        <SelectValue placeholder="Select a table to add..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {availableToSelect.map(table => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTable} disabled={!selectedTableId}>
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedTables.length === 0 
                      ? "No tables selected"
                      : `${selectedTables.length} table(s) selected`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedTables.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTables.map(table => {
                const Icon = table.icon;
                return (
                  <Card key={table.id} className={`border-l-4 ${table.borderColor}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {table.label}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveTable(table.id)}
                          disabled={isGenerating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Field 1</Label>
                        <Input 
                          type="text" 
                          value={table.fields.field1} 
                          onChange={(e) => updateTableField(table.id, "field1", e.target.value)}
                          placeholder="Enter field 1"
                          disabled={isGenerating}
                        />
                      </div>
                      <div>
                        <Label>Field 2</Label>
                        <Input 
                          type="text" 
                          value={table.fields.field2} 
                          onChange={(e) => updateTableField(table.id, "field2", e.target.value)}
                          placeholder="Enter field 2"
                          disabled={isGenerating}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {selectedTables.length > 0 && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full h-14 text-lg gap-2"
                  disabled={isGenerating}
                >
                  <Rocket className="h-5 w-5" />
                  {isGenerating ? "GENERATING..." : "GENERATE ALL BASE TABLES"}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Create {selectedTables.length + 1} table(s) with specified parameters
                </p>
              </CardContent>
            </Card>
          )}

          {isGenerating && (
            <Card className="border-2 shadow-elegant animate-fade-in">
              <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📊 PROGRESS TRACKING
                  </CardTitle>
                  <Badge variant="outline" className="text-base">
                    {completedTables}/{tableStatuses.length} Tables
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Overall Status</p>
                      <p className="text-lg font-semibold mt-1">
                        {completedTables === tableStatuses.length ? "🟢 Complete" : "🟡 Running"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Elapsed Time</p>
                      <p className="text-lg font-semibold mt-1">{Math.floor((Date.now() - startTime) / 1000)}s</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Total Execution</p>
                      <p className="text-lg font-semibold mt-1">
                        {completedTables === tableStatuses.length 
                          ? `${Math.floor((Date.now() - startTime) / 1000)}s` 
                          : "-"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  {tableStatuses.map((table, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{table.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{table.parameters}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(table.status)}
                            <p className="text-sm font-mono min-w-[60px] text-right">
                              {table.status === "completed" && `${table.time}s`}
                              {table.status === "running" && `${table.time}s...`}
                              {table.status === "pending" && "-"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SQL Builder Section */}
          <Card className="border-2 shadow-elegant">
            <CardHeader className="border-b bg-gradient-to-r from-cyan-500/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                SQL JOIN BUILDER
              </CardTitle>
              <CardDescription>Create custom SQL queries by combining tables with different join types</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Base Table Selection */}
              <div>
                <Label className="text-base font-semibold">Base Table (FROM)</Label>
                <Select value={baseTable} onValueChange={setBaseTable}>
                  <SelectTrigger className="mt-2 bg-background">
                    <SelectValue placeholder="Select base table..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {availableTables.map(table => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.label}_{postfix}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add Join Button */}
              {baseTable && (
                <Button 
                  variant="outline" 
                  onClick={addJoin}
                  disabled={availableForJoin.length === 0}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Join
                </Button>
              )}

              {/* Join Cards */}
              {joins.length > 0 && (
                <div className="space-y-4">
                  {joins.map((join, index) => {
                    const joinTable = availableTables.find(t => t.id === join.tableId);
                    return (
                      <Card key={join.id} className={`border-l-4 ${join.joinType === "LEFT JOIN" ? "border-l-orange-500" : "border-l-green-500"}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Join Type */}
                              <div>
                                <Label className="text-sm">Join Type</Label>
                                <Select 
                                  value={join.joinType} 
                                  onValueChange={(value) => updateJoin(join.id, "joinType", value as "JOIN" | "LEFT JOIN")}
                                >
                                  <SelectTrigger className="mt-1 bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background z-50">
                                    <SelectItem value="JOIN">
                                      <span className="flex items-center gap-2">
                                        <Badge className="bg-green-500 text-xs">INNER JOIN</Badge>
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="LEFT JOIN">
                                      <span className="flex items-center gap-2">
                                        <Badge className="bg-orange-500 text-xs">LEFT JOIN</Badge>
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Table Selection */}
                              <div>
                                <Label className="text-sm">Table</Label>
                                <Select 
                                  value={join.tableId} 
                                  onValueChange={(value) => updateJoin(join.id, "tableId", value)}
                                >
                                  <SelectTrigger className="mt-1 bg-background">
                                    <SelectValue placeholder="Select table..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background z-50">
                                    {availableTables
                                      .filter(t => t.id !== baseTable && !joins.some(j => j.id !== join.id && j.tableId === t.id))
                                      .map(table => (
                                        <SelectItem key={table.id} value={table.id}>
                                          {table.label}_{postfix}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Join Key */}
                              <div>
                                <Label className="text-sm">Join Key</Label>
                                <Input 
                                  value={join.joinKey}
                                  onChange={(e) => updateJoin(join.id, "joinKey", e.target.value)}
                                  placeholder="e.g., msisdn"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeJoin(join.id)}
                              className="mt-6"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Visual Join Indicator */}
                          {joinTable && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{availableTables.find(t => t.id === baseTable)?.alias}</Badge>
                              <ArrowRight className="h-4 w-4" />
                              <Badge variant="outline" className={join.joinType === "LEFT JOIN" ? "border-orange-500" : "border-green-500"}>
                                {join.joinType}
                              </Badge>
                              <ArrowRight className="h-4 w-4" />
                              <Badge variant="outline">{joinTable.alias}</Badge>
                              <span className="ml-2">ON {join.joinKey}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Generate SQL Button */}
              {baseTable && (
                <Button 
                  onClick={generateSQL}
                  className="w-full gap-2"
                >
                  <Database className="h-4 w-4" />
                  Generate SQL
                </Button>
              )}

              {/* Generated SQL Output */}
              {generatedSQL && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Generated SQL</Label>
                    <Button variant="outline" size="sm" onClick={copySQL} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea 
                    value={generatedSQL}
                    readOnly
                    className="font-mono text-sm min-h-[200px] bg-muted/50"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
