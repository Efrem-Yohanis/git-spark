import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, Loader2, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const metricTitles: Record<string, string> = {
  "active-total": "Active Total",
  "active-new": "Active New",
  "active-existing": "Active Existing",
  "active-total-transacting": "Active Total Transacting",
  "active-existing-transacting": "Active Existing Transacting",
  "active-new-transacting": "Active New Transacting",
  "active-micro-merchants": "Active Micro Merchants",
  "active-unified-merchants": "Active Unified Merchants",
  "active-app-users": "Active App Users",
  "app-downloads": "App Downloads",
  "non-gross-adds": "Non-Gross Adds",
  "gross-adds": "Gross Adds",
  "top-up": "Top Up",
};

// API endpoint mapping for each metric
const metricApiEndpoints: Record<string, { cardView: string; data: string }> = {
  "active-total": {
    cardView: "/api/active-users/card-view",
    data: "/api/active-users/data",
  },
  "active-new": {
    cardView: "/api/new-customers/card-view",
    data: "/api/new-customers/data",
  },
  "active-existing": {
    cardView: "/api/active-existing/card-view",
    data: "/api/active-existing/data",
  },
};

interface CardViewData {
  daily_count: number;
  "30day_count": number;
  "90day_count": number;
  data_retrieved_at: string;
}

interface ChartDataItem {
  date: string;
  value: number;
}

export default function MetricDetail() {
  const { metricId } = useParams();
  const { toast } = useToast();
  const [chartPeriod, setChartPeriod] = useState("30-day");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [frequency, setFrequency] = useState<string>("daily");

  // Data states
  const [cardData, setCardData] = useState<CardViewData | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const metricTitle = metricTitles[metricId || ""] || "Metric";
  const apiEndpoints = metricId ? metricApiEndpoints[metricId] : null;
  const hasApiIntegration = !!apiEndpoints;

  // Fetch card view data
  const fetchCardData = useCallback(async () => {
    if (!apiEndpoints) return;
    setLoadingCards(true);
    try {
      const response = await fetch(`${API_BASE_URL}${apiEndpoints.cardView}`);
      if (!response.ok) throw new Error("Failed to fetch card data");
      const data: CardViewData = await response.json();
      setCardData(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching card data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch card data from server",
        variant: "destructive",
      });
    } finally {
      setLoadingCards(false);
    }
  }, [apiEndpoints, toast]);

  // Fetch chart/table data
  const fetchChartData = useCallback(async () => {
    if (!apiEndpoints) return;
    setLoadingChart(true);
    try {
      const params = new URLSearchParams();

      if (chartPeriod === "daily") {
        params.append("period", "daily");
      } else if (chartPeriod === "30-day") {
        params.append("period", "30day");
      } else if (chartPeriod === "90-day") {
        params.append("period", "90day");
      } else if (chartPeriod === "custom" && startDate && endDate) {
        params.append("period", "custom");
        params.append("start_date", format(startDate, "yyyy-MM-dd"));
        params.append("end_date", format(endDate, "yyyy-MM-dd"));
        params.append("frequency", frequency);
      } else {
        setLoadingChart(false);
        return;
      }

      const url = `${API_BASE_URL}${apiEndpoints.data}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch chart data");
      
      const data = await response.json();
      
      // Handle response format: { results: [...], period, frequency, data_retrieved_at }
      if (data.results && Array.isArray(data.results)) {
        setChartData(data.results);
      } else if (Array.isArray(data)) {
        setChartData(data);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch chart data from server",
        variant: "destructive",
      });
    } finally {
      setLoadingChart(false);
    }
  }, [apiEndpoints, chartPeriod, startDate, endDate, frequency, toast]);

  // Refresh all data
  const handleRefresh = useCallback(() => {
    fetchCardData();
    fetchChartData();
  }, [fetchCardData, fetchChartData]);

  // Initial load and on period change
  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Fallback mock data for non-active-total metrics
  const generateMockData = (period: string) => {
    if (period === "daily") {
      return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: Math.floor(Math.random() * 5000) + 10000,
      }));
    } else if (period === "30-day") {
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: Math.floor(Math.random() * 5000) + 10000,
      }));
    } else {
      return Array.from({ length: 3 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 150000) + 300000,
      }));
    }
  };

  // Card values
  const dailyValue = hasApiIntegration && cardData ? cardData.daily_count : 0;
  const thirtyDayValue = hasApiIntegration && cardData ? cardData["30day_count"] : 0;
  const ninetyDayValue = hasApiIntegration && cardData ? cardData["90day_count"] : 0;

  // Chart data (use API data for integrated metrics, mock for others)
  const displayChartData = hasApiIntegration ? chartData : generateMockData(chartPeriod);
  const mean = chartPeriod === "30-day" && displayChartData.length > 0 
    ? displayChartData.reduce((acc, d) => acc + d.value, 0) / displayChartData.length 
    : null;

  // Export to Excel function
  const handleExportExcel = () => {
    const exportData = displayChartData.map((row) => ({
      Date: row.date,
      Value: row.value,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, metricTitle);

    // Generate filename with metric name and date
    const filename = `${metricTitle.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, filename);

    toast({
      title: "Export successful",
      description: `Data exported to ${filename}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{metricTitle}</h2>
          <p className="text-muted-foreground mt-1">Detailed analysis and trends</p>
        </div>
        {hasApiIntegration && (
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-sm text-muted-foreground">
                Last Refresh: {format(lastRefresh, "PPpp")}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loadingCards || loadingChart}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", (loadingCards || loadingChart) && "animate-spin")} />
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Top Section - Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCards ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <p className="text-3xl font-bold text-primary">{dailyValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Today's value</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">30-Day</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCards ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <p className="text-3xl font-bold text-primary">{thirtyDayValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Sum of last 30 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">90-Day</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCards ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <p className="text-3xl font-bold text-primary">{ninetyDayValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Sum of last 90 days</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs - Chart & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Analysis</CardTitle>
              <Select value={chartPeriod} onValueChange={setChartPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (7 days)</SelectItem>
                  <SelectItem value="30-day">30-Day</SelectItem>
                  <SelectItem value="90-day">90-Day (3 months)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {chartPeriod === "custom" && (
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-4">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {loadingChart ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={displayChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    {mean && <ReferenceLine y={mean} stroke="hsl(var(--accent))" strokeDasharray="3 3" label="Mean" />}
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]}>
                      <LabelList 
                        dataKey="value" 
                        position="top" 
                        formatter={(value: number) => value.toLocaleString()}
                        style={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportExcel}
                  disabled={displayChartData.length === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
              {loadingChart ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        {displayChartData.map((row, idx) => (
                          <TableHead key={idx} className="text-right">{row.date}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Metric Value</TableCell>
                        {displayChartData.map((row, idx) => (
                          <TableCell key={idx} className="text-right font-medium">{row.value.toLocaleString()}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
