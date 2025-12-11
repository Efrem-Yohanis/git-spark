import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, TrendingUp, Users, UserPlus, Smartphone, Download, UserMinus, ArrowUpCircle, Clock, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface MetricConfig {
  title: string;
  slug: string;
  icon: React.ElementType;
  apiEndpoint?: string;
  color: string;
}

const metrics: MetricConfig[] = [
  { title: "Active Total", slug: "active-total", icon: TrendingUp, apiEndpoint: "/api/active-users/card-view", color: "chart-1" },
  { title: "Active New", slug: "active-new", icon: UserPlus, apiEndpoint: "/api/new-customers/card-view", color: "chart-2" },
  { title: "Active Existing", slug: "active-existing", icon: Users, apiEndpoint: "/api/active-existing/card-view", color: "chart-3" },
  { title: "Active Total Transacting", slug: "active-total-transacting", icon: TrendingUp, color: "chart-4" },
  { title: "Active Existing Transacting", slug: "active-existing-transacting", icon: TrendingUp, color: "chart-5" },
  { title: "Active New Transacting", slug: "active-new-transacting", icon: UserPlus, color: "chart-1" },
  { title: "Active Micro Merchants", slug: "active-micro-merchants", icon: Users, color: "chart-2" },
  { title: "Active Unified Merchants", slug: "active-unified-merchants", icon: Users, color: "chart-3" },
  { title: "Active App Users", slug: "active-app-users", icon: Smartphone, color: "chart-4" },
  { title: "App Downloads", slug: "app-downloads", icon: Download, color: "chart-5" },
  { title: "Non-Gross Adds", slug: "non-gross-adds", icon: UserMinus, color: "chart-1" },
  { title: "Gross Adds", slug: "gross-adds", icon: UserPlus, color: "chart-2" },
  
];

interface CardData {
  daily_count: number;
  "30day_count": number;
  "90day_count": number;
  data_retrieved_at: string;
}

type Period = "daily" | "30-day" | "90-day";

const generateMockValue = (period: Period) => {
  if (period === "daily") {
    return Math.floor(Math.random() * 5000) + 10000;
  } else if (period === "30-day") {
    return Math.floor(Math.random() * 150000) + 300000;
  } else {
    return Math.floor(Math.random() * 450000) + 900000;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [metricData, setMetricData] = useState<Record<string, CardData>>({});

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const newData: Record<string, CardData> = {};

    try {
      const metricsWithApi = metrics.filter(m => m.apiEndpoint);
      const promises = metricsWithApi.map(async (metric) => {
        try {
          const response = await fetch(`${API_BASE_URL}${metric.apiEndpoint}`);
          if (response.ok) {
            const data = await response.json();
            newData[metric.slug] = data;
          }
        } catch (error) {
          console.error(`Error fetching ${metric.title}:`, error);
        }
      });

      await Promise.all(promises);
      setMetricData(newData);
      setLastRefresh(new Date());
      
      toast({
        title: "Data Refreshed",
        description: "All metrics have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh some metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const getMetricValue = (metric: MetricConfig): number => {
    const data = metricData[metric.slug];
    if (data) {
      if (period === "daily") return data.daily_count;
      if (period === "30-day") return data["30day_count"];
      if (period === "90-day") return data["90day_count"];
    }
    return generateMockValue(period);
  };

  const periodLabel = period === "daily" ? "Daily" : period === "30-day" ? "30 Day" : "90 Day";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-3xl -z-10" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MPESA CVM Dashboard
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Real-time overview of all key metrics
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Last Refresh Time */}
            {lastRefresh && (
              <div className="flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last refresh:</span>
                <span className="font-medium text-foreground">
                  {format(lastRefresh, "MMM dd, HH:mm:ss")}
                </span>
              </div>
            )}

            {/* Filter Dropdown */}
            <div className="relative">
              <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <SelectTrigger className="w-48 bg-card shadow-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    <SelectValue placeholder="Select period" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-md border-border/50 shadow-elegant">
                  <SelectItem value="daily" className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                    <div className="flex flex-col">
                      <span className="font-medium">Daily View</span>
                      <span className="text-xs text-muted-foreground">Today's metrics</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="30-day" className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                    <div className="flex flex-col">
                      <span className="font-medium">30-Day View</span>
                      <span className="text-xs text-muted-foreground">Monthly overview</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="90-day" className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                    <div className="flex flex-col">
                      <span className="font-medium">90-Day View</span>
                      <span className="text-xs text-muted-foreground">Quarterly analysis</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={fetchAllData}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-elegant transition-all duration-300 hover:shadow-card-hover"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              {loading ? "Refreshing..." : "Refresh All"}
            </Button>
          </div>
        </div>
      </div>

      {/* Period Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
          Showing {periodLabel} Data
        </span>
        <span className="text-sm text-muted-foreground">
          {metrics.length} metrics tracked
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const value = getMetricValue(metric);
          const hasApiData = !!metricData[metric.slug];

          return (
            <Card
              key={metric.slug}
              onClick={() => navigate(`/metric/${metric.slug}`)}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "bg-gradient-card border-border/50 shadow-card hover:shadow-card-hover",
                "hover:-translate-y-1 hover:border-primary/30",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              {/* Status Indicator */}
              <div className={cn(
                "absolute top-3 right-3 w-2 h-2 rounded-full",
                hasApiData ? "bg-green-500" : "bg-amber-500",
                "shadow-sm"
              )} />

              <CardHeader className="pb-2 relative">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    "bg-gradient-subtle border border-primary/10 group-hover:border-primary/30",
                    "group-hover:scale-110"
                  )}>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {metric.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="relative pt-0">
                <div className="mt-2">
                  {loading && !metricData[metric.slug] ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        {value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {periodLabel} count
                      </p>
                    </>
                  )}
                </div>

                {/* Click Indicator */}
                <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>View details</span>
                  <svg
                    className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}