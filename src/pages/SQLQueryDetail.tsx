import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshControl } from "@/components/RefreshControl";
import type { SQLQuery } from "./SQLQueryLibrary";

// Mock data (same as in SQLQueryLibrary)
const mockQueries: SQLQuery[] = [
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

// SQL syntax highlighting
const highlightSQL = (sql: string) => {
  const keywords = /\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|DISTINCT|COUNT|SUM|AVG|MIN|MAX|TRUNC|SUBSTR|WITH|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|INDEX|TABLE|VIEW|LEVEL|CONNECT BY|DUAL|SYSDATE)\b/gi;
  const strings = /('[^']*')/g;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const comments = /(--.*$|\/\*[\s\S]*?\*\/)/gm;
  
  let highlighted = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  highlighted = highlighted.replace(comments, '<span class="text-muted-foreground italic">$1</span>');
  highlighted = highlighted.replace(strings, '<span class="text-green-500">$1</span>');
  highlighted = highlighted.replace(keywords, '<span class="text-blue-500 font-semibold">$1</span>');
  highlighted = highlighted.replace(numbers, '<span class="text-amber-500">$1</span>');
  
  return highlighted;
};

export default function SQLQueryDetail() {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const query = mockQueries.find(q => q.id === queryId);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);
  
  if (!query) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/sql-query-library")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">SQL Query not found.</p>
        </Card>
      </div>
    );
  }

  const handleCopySQL = () => {
    navigator.clipboard.writeText(query.sql);
    toast.success("SQL copied to clipboard");
  };

  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.info("Delete functionality coming soon");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sql-query-library")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{query.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{query.type}</p>
          </div>
        </div>
        <RefreshControl 
          lastRefreshed={lastRefreshed} 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
        />
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{query.description}</p>
        </CardContent>
      </Card>

      {/* SQL Code */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">SQL Code</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopySQL}>
              <Copy className="h-4 w-4 mr-2" />
              Copy SQL
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              <code dangerouslySetInnerHTML={{ __html: highlightSQL(query.sql) }} />
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
