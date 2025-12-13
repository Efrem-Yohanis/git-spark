import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, X, FileCode2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { RefreshControl } from "@/components/RefreshControl";
import { toast } from "sonner";

export interface SQLQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
  type: string;
  createdAt: Date;
}

// Mock data
const initialQueries: SQLQuery[] = [
  {
    id: "1",
    title: "30D Active New Customers (Txn-Based)",
    description: "Returns all customers who performed their first transaction in the last 30 days. A customer is considered new if their first-ever transaction date is within the rolling 30-day period.",
    sql: `WITH date_series AS (
    SELECT TRUNC(SYSDATE - LEVEL) AS end_date
    FROM dual
    CONNECT BY LEVEL <= 30
),
first_txn AS (
    SELECT
        SUBSTR(ds_customer_msisdn, -9) AS customer_id,
        MIN(TRUNC(ord_endtime)) AS first_txn_date
    FROM mpesa.fct_mst_txn_transaction_info
    WHERE ord_initiator_mnemonic = 'CUSTOMER'
    GROUP BY SUBSTR(ds_customer_msisdn, -9)
)
SELECT
    f.customer_id,
    f.first_txn_date
FROM first_txn f
WHERE f.first_txn_date >= TRUNC(SYSDATE - 30);`,
    type: "Customer Analytics",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    title: "Active Customers Monthly",
    description: "Counts unique active customers per month based on transaction activity.",
    sql: `SELECT 
    TRUNC(ord_endtime, 'MM') AS month,
    COUNT(DISTINCT SUBSTR(ds_customer_msisdn, -9)) AS active_customers
FROM mpesa.fct_mst_txn_transaction_info
WHERE ord_initiator_mnemonic = 'CUSTOMER'
GROUP BY TRUNC(ord_endtime, 'MM')
ORDER BY month DESC;`,
    type: "Customer Analytics",
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "3",
    title: "Active Users Daily Trend",
    description: "Daily trend of active users over the last 30 days.",
    sql: `SELECT 
    TRUNC(ord_endtime) AS txn_date,
    COUNT(DISTINCT SUBSTR(ds_customer_msisdn, -9)) AS daily_active
FROM mpesa.fct_mst_txn_transaction_info
WHERE ord_endtime >= SYSDATE - 30
GROUP BY TRUNC(ord_endtime)
ORDER BY txn_date;`,
    type: "Trend Analysis",
    createdAt: new Date("2024-11-20"),
  },
  {
    id: "4",
    title: "Activity Summary SQL",
    description: "Comprehensive activity summary including transaction counts and amounts.",
    sql: `SELECT 
    TRUNC(ord_endtime) AS activity_date,
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM mpesa.fct_mst_txn_transaction_info
WHERE ord_endtime >= SYSDATE - 7
GROUP BY TRUNC(ord_endtime)
ORDER BY activity_date DESC;`,
    type: "Summary Reports",
    createdAt: new Date("2024-12-05"),
  },
  {
    id: "5",
    title: "Top Up Revenue Analysis",
    description: "Analyzes top-up transactions and revenue by region.",
    sql: `SELECT 
    region,
    COUNT(*) AS topup_count,
    SUM(amount) AS total_revenue
FROM mpesa.fct_topup_transactions
WHERE txn_date >= SYSDATE - 30
GROUP BY region
ORDER BY total_revenue DESC;`,
    type: "Revenue Analysis",
    createdAt: new Date("2024-12-08"),
  },
];

const sqlTypes = ["All Types", "Customer Analytics", "Trend Analysis", "Summary Reports", "Revenue Analysis"];

export default function SQLQueryLibrary() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState<SQLQuery[]>(initialQueries);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState("All Types");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuery, setNewQuery] = useState({ title: "", description: "", sql: "" });
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart search with Levenshtein distance for fuzzy matching
  const levenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  };

  // Get search suggestions sorted by relevance
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    
    return queries
      .map(query => {
        const title = query.title.toLowerCase();
        const startsWithScore = title.startsWith(term) ? 0 : 100;
        const includesScore = title.includes(term) ? 0 : 50;
        const distance = levenshteinDistance(term, title.substring(0, term.length));
        return { query, score: startsWithScore + includesScore + distance };
      })
      .filter(item => item.score < 150)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map(item => item.query);
  }, [searchTerm, queries]);

  // Filter queries
  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      const matchesSearch = !searchTerm.trim() || 
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All Types" || query.type === selectedType;
      const matchesDate = !dateFilter || 
        format(query.createdAt, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd");
      return matchesSearch && matchesType && matchesDate;
    });
  }, [searchTerm, selectedType, dateFilter, queries]);

  // Pagination
  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  const handleSelectSuggestion = (query: SQLQuery) => {
    setSearchTerm(query.title);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All Types");
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  const handleAddQuery = () => {
    if (!newQuery.title.trim() || !newQuery.sql.trim()) {
      toast.error("Title and SQL are required");
      return;
    }

    const query: SQLQuery = {
      id: String(Date.now()),
      title: newQuery.title.trim(),
      description: newQuery.description.trim(),
      sql: newQuery.sql.trim(),
      type: "Customer Analytics",
      createdAt: new Date(),
    };

    setQueries([query, ...queries]);
    setNewQuery({ title: "", description: "", sql: "" });
    setIsDialogOpen(false);
    toast.success("SQL query added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SQL Query Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse and manage stored SQL queries</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshControl 
            lastRefreshed={lastRefreshed} 
            onRefresh={handleRefresh} 
            isRefreshing={isRefreshing} 
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add SQL Query
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New SQL Query</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title"
                    placeholder="Enter query title..."
                    value={newQuery.title}
                    onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Enter query description..."
                    value={newQuery.description}
                    onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sql">SQL *</Label>
                  <Textarea 
                    id="sql"
                    placeholder="Enter SQL query..."
                    value={newQuery.sql}
                    onChange={(e) => setNewQuery({ ...newQuery, sql: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddQuery}>Save Query</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Smart Search */}
        <div className="relative flex-1" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
              setCurrentPage(1);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-9"
          />
          {/* Auto-suggestion dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
              {suggestions.map((query) => (
                <button
                  key={query.id}
                  onClick={() => handleSelectSuggestion(query)}
                  className="w-full px-4 py-2 text-left hover:bg-accent text-sm transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  <span className="font-medium">{query.title}</span>
                  <span className="text-muted-foreground ml-2">— {query.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {sqlTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-48">
              <Calendar className="h-4 w-4 mr-2" />
              {dateFilter ? format(dateFilter, "MMM dd, yyyy") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={dateFilter}
              onSelect={(date) => { setDateFilter(date); setCurrentPage(1); }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {(searchTerm || selectedType !== "All Types" || dateFilter) && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Query List */}
      <div className="space-y-3">
        {paginatedQueries.length === 0 ? (
          <Card className="p-8 text-center">
            <FileCode2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No SQL queries found matching your criteria.</p>
          </Card>
        ) : (
          paginatedQueries.map((query) => (
            <Card
              key={query.id}
              className="cursor-pointer hover:border-primary/50 transition-all duration-200 hover:shadow-md"
              onClick={() => navigate(`/sql-query/${query.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{query.title}</h3>
                      <Badge variant="secondary" className="shrink-0">{query.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{query.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(query.createdAt, "MMM dd, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
