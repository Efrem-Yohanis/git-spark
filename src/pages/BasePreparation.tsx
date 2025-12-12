import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, Calendar, Users, Clock, DollarSign, Target, Rocket, Gift, X, Database, Copy, Plus, ArrowRight, Building2, Wallet, Eye, Hash, Columns } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActiveCustomersForm } from "@/components/base-preparation/ActiveCustomersForm";
import { VlrAttachedForm } from "@/components/base-preparation/VlrAttachedForm";
import { DateFormatForm } from "@/components/base-preparation/DateFormatForm";
import { BalanceThresholdForm } from "@/components/base-preparation/BalanceThresholdForm";
import { TargetedCustomersForm } from "@/components/base-preparation/TargetedCustomersForm";
import { RewardedFromAccountForm } from "@/components/base-preparation/RewardedFromAccountForm";

interface TableConfig {
  id: string;
  label: string;
  icon: any;
  borderColor: string;
  formType: string;
  fields: any;
}

interface TableStatus {
  name: string;
  status: "pending" | "running" | "completed" | "error";
  time: number;
  parameters: string;
  columns: string[];
  rowCount: number;
}

interface JoinConfig {
  id: string;
  tableId: string;
  joinType: "JOIN" | "LEFT JOIN";
  joinKey: string;
}

const availableTables = [
  { id: "active", label: "ACTIVE CUSTOMERS", icon: Users, borderColor: "border-l-green-500", alias: "act", formType: "active_customers", columns: ["msisdn", "activation_date", "last_activity", "status"] },
  { id: "vlr", label: "VLR ATTACHED CUSTOMERS", icon: Link, borderColor: "border-l-blue-500", alias: "vlr", formType: "vlr_attached", columns: ["msisdn", "vlr_id", "attach_date", "detach_date"] },
  { id: "registered", label: "REGISTERED MPESA", icon: Calendar, borderColor: "border-l-purple-500", alias: "reg", formType: "date_format", columns: ["msisdn", "registration_date", "kyc_status"] },
  { id: "balance", label: "BALANCE THRESHOLD", icon: DollarSign, borderColor: "border-l-yellow-500", alias: "bal", formType: "balance_threshold", columns: ["msisdn", "balance", "last_update"] },
  { id: "targeted", label: "TARGETED CUSTOMERS", icon: Target, borderColor: "border-l-red-500", alias: "tgt", formType: "targeted_customers", columns: ["msisdn", "campaign_id", "target_date"] },
  { id: "rewarded", label: "REWARDED CUSTOMERS", icon: Gift, borderColor: "border-l-pink-500", alias: "rwd", formType: "date_format", columns: ["msisdn", "reward_date", "reward_amount"] },
  { id: "cbe_topup", label: "CBE TOP UP", icon: Building2, borderColor: "border-l-cyan-500", alias: "cbe", formType: "date_format", columns: ["msisdn", "topup_date", "amount", "channel"] },
  { id: "reward_from_account", label: "REWARD FROM ACCOUNT", icon: Wallet, borderColor: "border-l-indigo-500", alias: "rfa", formType: "reward_from_account", columns: ["msisdn", "account_number", "reward_date"] },
];

const getInitialFields = (formType: string) => {
  switch (formType) {
    case "active_customers":
      return { table_name: "", data_from: undefined, active_for: "" };
    case "vlr_attached":
      return { table_name: "", day_from: "", day_to: "" };
    case "date_format":
      return { table_name: "", data_format: "", date: undefined, date_start: undefined, date_end: undefined };
    case "balance_threshold":
      return { table_name: "", balance_threshold: "", comparison: "" };
    case "targeted_customers":
      return { table_name: "", data_from: undefined, targeted_for_last: "" };
    case "reward_from_account":
      return { table_name: "", account_number: "" };
    default:
      return {};
  }
};

export default function BasePreparation() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [postfix, setPostfix] = useState("NOV29");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TableConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [generatedTables, setGeneratedTables] = useState<TableStatus[]>([]);
  
  // SQL Builder state
  const [baseTable, setBaseTable] = useState<string>("");
  const [joins, setJoins] = useState<JoinConfig[]>([]);
  const [generatedSQL, setGeneratedSQL] = useState<string>("");
  const [sqlTableName, setSqlTableName] = useState<string>("");

  const handleAddTable = () => {
    if (!selectedTableId) return;
    
    const table = availableTables.find(t => t.id === selectedTableId);
    if (!table) return;
    
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
      fields: getInitialFields(table.formType)
    };
    
    setSelectedTables([...selectedTables, newTable]);
    setSelectedTableId("");
  };

  const handleRemoveTable = (tableId: string) => {
    setSelectedTables(selectedTables.filter(t => t.id !== tableId));
    // Also remove from SQL builder if it was selected
    if (baseTable === tableId) {
      setBaseTable("");
      setJoins([]);
      setGeneratedSQL("");
    }
    setJoins(joins.filter(j => j.tableId !== tableId));
  };

  const updateTableFields = (tableId: string, fields: any) => {
    setSelectedTables(selectedTables.map(table => 
      table.id === tableId ? { ...table, fields } : table
    ));
  };

  const getParametersSummary = (table: TableConfig) => {
    const { fields, formType } = table;
    switch (formType) {
      case "active_customers":
        return `${fields.table_name || "N/A"}, ${fields.active_for || "N/A"} days`;
      case "vlr_attached":
        return `${fields.table_name || "N/A"}, Days ${fields.day_from || "N/A"}-${fields.day_to || "N/A"}`;
      case "date_format":
        return `${fields.table_name || "N/A"}, ${fields.data_format || "N/A"}`;
      case "balance_threshold":
        return `${fields.table_name || "N/A"}, ${fields.comparison || "N/A"} ${fields.balance_threshold || "N/A"}`;
      case "targeted_customers":
        return `${fields.table_name || "N/A"}, ${fields.targeted_for_last || "N/A"} days`;
      case "reward_from_account":
        return `${fields.table_name || "N/A"}, Account: ${fields.account_number || "N/A"}`;
      default:
        return "N/A";
    }
  };

  const getTableColumns = (tableId: string) => {
    const table = availableTables.find(t => t.id === tableId);
    return table?.columns || [];
  };

  const getAllTables = () => {
    return selectedTables.map(table => ({
      name: table.fields.table_name || `${table.label.replace(/ /g, "_")}_${postfix}`,
      status: "pending" as const,
      time: 0,
      parameters: getParametersSummary(table),
      columns: getTableColumns(table.id),
      rowCount: 0,
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
    
    // Add SQL builder table if configured
    if (sqlTableName && baseTable) {
      tables.push({
        name: sqlTableName,
        status: "pending",
        time: 0,
        parameters: "SQL Join Result",
        columns: getJoinedColumns(),
        rowCount: 0,
      });
    }

    setTableStatuses(tables);
    setIsGenerating(true);
    setStartTime(Date.now());
    
    toast({
      title: "Starting Generation",
      description: `Generating ${tables.length} base tables...`,
    });

    simulateTableGeneration(tables);
  };

  const getJoinedColumns = () => {
    const baseTableData = availableTables.find(t => t.id === baseTable);
    let columns = [...(baseTableData?.columns || [])];
    
    joins.forEach(join => {
      const joinTable = availableTables.find(t => t.id === join.tableId);
      if (joinTable) {
        columns = [...columns, ...joinTable.columns.filter(c => !columns.includes(c))];
      }
    });
    
    return columns;
  };

  const simulateTableGeneration = (tables: TableStatus[]) => {
    const completionTimes = tables.map(() => Math.floor(Math.random() * 10000) + 5000);
    const rowCounts = tables.map(() => Math.floor(Math.random() * 500000) + 10000);
    
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
            updated[index] = { 
              ...updated[index], 
              status: "completed", 
              time: time / 1000,
              rowCount: rowCounts[index]
            };
            return updated;
          });

          // Add to generated tables for tracking
          setGeneratedTables(prev => {
            const newTable = {
              ...tables[index],
              status: "completed" as const,
              time: time / 1000,
              rowCount: rowCounts[index]
            };
            return [...prev, newTable];
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
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "running":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Running</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };

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

    const baseTableConfig = selectedTables.find(t => t.id === baseTable);
    if (!baseTableConfig) return;

    const baseTableName = baseTableConfig.fields.table_name || `${baseTableConfig.label.replace(/ /g, "_")}_${postfix}`;
    const baseTableData = availableTables.find(t => t.id === baseTable);
    const baseAlias = baseTableData?.alias || "t1";

    let sql = `SELECT \n  ${baseAlias}.*`;
    
    joins.forEach(join => {
      const joinTableData = availableTables.find(t => t.id === join.tableId);
      if (joinTableData) {
        sql += `,\n  ${joinTableData.alias}.*`;
      }
    });

    sql += `\nFROM ${baseTableName} ${baseAlias}`;

    joins.forEach(join => {
      const joinTableConfig = selectedTables.find(t => t.id === join.tableId);
      const joinTableData = availableTables.find(t => t.id === join.tableId);
      if (joinTableConfig && joinTableData && join.joinKey) {
        const joinTableName = joinTableConfig.fields.table_name || `${joinTableConfig.label.replace(/ /g, "_")}_${postfix}`;
        sql += `\n${join.joinType} ${joinTableName} ${joinTableData.alias}`;
        sql += `\n  ON ${baseAlias}.${join.joinKey} = ${joinTableData.alias}.${join.joinKey}`;
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

  const renderTableForm = (table: TableConfig) => {
    const { formType, fields, id } = table;
    const updateFields = (newFields: any) => updateTableFields(id, newFields);

    switch (formType) {
      case "active_customers":
        return <ActiveCustomersForm fields={fields} onChange={updateFields} disabled={isGenerating} />;
      case "vlr_attached":
        return <VlrAttachedForm fields={fields} onChange={updateFields} disabled={isGenerating} />;
      case "date_format":
        return <DateFormatForm fields={fields} onChange={updateFields} disabled={isGenerating} tableLabel={table.label} />;
      case "balance_threshold":
        return <BalanceThresholdForm fields={fields} onChange={updateFields} disabled={isGenerating} />;
      case "targeted_customers":
        return <TargetedCustomersForm fields={fields} onChange={updateFields} disabled={isGenerating} />;
      case "reward_from_account":
        return <RewardedFromAccountForm fields={fields} onChange={updateFields} disabled={isGenerating} />;
      default:
        return null;
    }
  };

  const completedTables = tableStatuses.filter(t => t.status === "completed").length;
  const availableToSelect = availableTables.filter(
    table => !selectedTables.some(st => st.id === table.id)
  );
  
  // Only selected tables are available for SQL builder
  const availableForSQLBuilder = selectedTables;
  const availableForJoin = selectedTables.filter(
    table => table.id !== baseTable && !joins.some(j => j.tableId === table.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="w-full px-6 py-6 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <CardContent>
                      {renderTableForm(table)}
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
                        {completedTables === tableStatuses.length ? "Complete" : "Running"}
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

          {/* SQL Builder Section - Only visible when tables are selected */}
          {selectedTables.length > 0 && (
            <Card className="border-2 shadow-elegant">
              <CardHeader className="border-b bg-gradient-to-r from-cyan-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SQL JOIN BUILDER
                </CardTitle>
                <CardDescription>Create custom SQL queries by combining your selected tables</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-semibold">Result Table Name</Label>
                    <Input
                      value={sqlTableName}
                      onChange={(e) => setSqlTableName(e.target.value.toUpperCase())}
                      placeholder={`e.g., JOINED_BASE_${postfix}`}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Name for the joined result table</p>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Base Table (FROM)</Label>
                    <Select value={baseTable} onValueChange={setBaseTable}>
                      <SelectTrigger className="mt-2 bg-background">
                        <SelectValue placeholder="Select base table..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {availableForSQLBuilder.map(table => {
                          const tableData = availableTables.find(t => t.id === table.id);
                          return (
                            <SelectItem key={table.id} value={table.id}>
                              {table.fields.table_name || `${table.label.replace(/ /g, "_")}_${postfix}`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {baseTable && (
                  <div>
                    <Label className="text-base font-semibold">Add Tables (JOIN)</Label>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        onClick={addJoin}
                        disabled={availableForJoin.length === 0}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Join Table
                      </Button>
                      {availableForJoin.length === 0 && (
                        <p className="text-sm text-muted-foreground self-center">All selected tables are already added</p>
                      )}
                    </div>
                  </div>
                )}

                {joins.length > 0 && (
                  <div className="space-y-4">
                    {joins.map((join) => {
                      const joinTableConfig = selectedTables.find(t => t.id === join.tableId);
                      const joinTableData = availableTables.find(t => t.id === join.tableId);
                      return (
                        <Card key={join.id} className={`border-l-4 ${join.joinType === "LEFT JOIN" ? "border-l-orange-500" : "border-l-green-500"}`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                      {selectedTables
                                        .filter(t => t.id !== baseTable && !joins.some(j => j.id !== join.id && j.tableId === t.id))
                                        .map(table => (
                                          <SelectItem key={table.id} value={table.id}>
                                            {table.fields.table_name || `${table.label.replace(/ /g, "_")}_${postfix}`}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>

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
                            
                            {joinTableData && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{availableTables.find(t => t.id === baseTable)?.alias}</Badge>
                                <ArrowRight className="h-4 w-4" />
                                <Badge variant="outline" className={join.joinType === "LEFT JOIN" ? "border-orange-500" : "border-green-500"}>
                                  {join.joinType}
                                </Badge>
                                <ArrowRight className="h-4 w-4" />
                                <Badge variant="outline">{joinTableData.alias}</Badge>
                                <span className="ml-2">ON {join.joinKey}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {baseTable && (
                  <Button 
                    onClick={generateSQL}
                    variant="outline"
                    className="gap-2"
                  >
                    <Database className="h-4 w-4" />
                    Preview SQL
                  </Button>
                )}

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
                      className="font-mono text-sm min-h-[150px] bg-muted/50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          {selectedTables.length > 0 && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full h-14 text-lg gap-2"
                  disabled={isGenerating}
                >
                  <Rocket className="h-5 w-5" />
                  {isGenerating ? "GENERATING..." : "GENERATE ALL TABLES"}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Create {selectedTables.length + (sqlTableName && baseTable ? 1 : 0)} table(s) with specified parameters
                </p>
              </CardContent>
            </Card>
          )}

          {/* Table Generation Tracking */}
          {generatedTables.length > 0 && (
            <Card className="border-2 shadow-elegant">
              <CardHeader className="border-b bg-gradient-to-r from-green-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  TABLE GENERATION TRACKING
                </CardTitle>
                <CardDescription>History of all generated tables</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Table Name
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Columns className="h-4 w-4" />
                            Columns
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Time Taken
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Row Count
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedTables.map((table, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{table.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {table.columns.slice(0, 3).map((col, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {col}
                                </Badge>
                              ))}
                              {table.columns.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{table.columns.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{table.time.toFixed(1)}s</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono">{table.rowCount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/base-preparation/table/${encodeURIComponent(table.name)}`)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
