import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Gift, 
  DollarSign, 
  TrendingUp, 
  Target, 
  PieChart, 
  BarChart3, 
  ArrowUpRight,
  Clock,
  Calendar,
  Ban,
  UserCheck,
  Activity,
  Wallet,
  LineChart as LineChartIcon,
  CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";

// Mock data
const tierPerformanceData = [
  { tier: "High Value", targeted: 8500, reactivated: 4250, rate: 50 },
  { tier: "Medium Value", targeted: 15000, reactivated: 6000, rate: 40 },
  { tier: "Low Value", targeted: 21500, reactivated: 5375, rate: 25 },
];

const responseTimingData = [
  { day: "Day 1", reactivations: 2500 },
  { day: "Day 2", reactivations: 3200 },
  { day: "Day 3", reactivations: 2800 },
  { day: "Day 4", reactivations: 1500 },
  { day: "Day 5", reactivations: 1200 },
  { day: "Day 6", reactivations: 900 },
  { day: "Day 7+", reactivations: 3525 },
];

const dailyPerformanceData = [
  { date: "Dec 1", daily: 1200, cumulative: 1200 },
  { date: "Dec 2", daily: 1450, cumulative: 2650 },
  { date: "Dec 3", daily: 1100, cumulative: 3750 },
  { date: "Dec 4", daily: 1650, cumulative: 5400 },
  { date: "Dec 5", daily: 1350, cumulative: 6750 },
  { date: "Dec 6", daily: 1800, cumulative: 8550 },
  { date: "Dec 7", daily: 2100, cumulative: 10650 },
  { date: "Dec 8", daily: 1750, cumulative: 12400 },
  { date: "Dec 9", daily: 1400, cumulative: 13800 },
  { date: "Dec 10", daily: 1825, cumulative: 15625 },
];

const exclusionData = [
  { reason: "Staff Members", count: 2500, color: "hsl(var(--primary))" },
  { reason: "Already Rewarded", count: 8000, color: "hsl(var(--secondary))" },
  { reason: "Still Active", count: 12000, color: "hsl(220, 70%, 50%)" },
  { reason: "Invalid MSISDN", count: 1500, color: "hsl(var(--destructive))" },
];

const transactionTypeData = [
  { type: "P2P Transfer", percentage: 35 },
  { type: "Bill Payment", percentage: 25 },
  { type: "Airtime Purchase", percentage: 20 },
  { type: "Merchant Payment", percentage: 15 },
  { type: "Cash Out", percentage: 5 },
];

const regionPerformanceData = [
  { region: "Addis Ababa", targeted: 18000, reactivated: 8100, rate: 45 },
  { region: "Oromia", targeted: 12000, reactivated: 4200, rate: 35 },
  { region: "Amhara", targeted: 8000, reactivated: 2400, rate: 30 },
  { region: "SNNPR", targeted: 4500, reactivated: 1350, rate: 30 },
  { region: "Other", targeted: 2500, reactivated: 575, rate: 23 },
];

export default function WinbackChurner() {
  const totalTargeted = 45000;
  const reactivated = 15625;
  const reactivationRate = ((reactivated / totalTargeted) * 100).toFixed(1);
  const totalRewardsPaid = 180187;
  const avgHistoricalTxn = 24;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Winback Churner Reports
          </h1>
          <p className="text-muted-foreground mt-1">Churned customer reactivation campaign analytics</p>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="exclusion">Exclusion</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          {/* Campaign Performance Summary */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Targeted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalTargeted.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Churned customers</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Reactivated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{reactivated.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    Customers returned
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Reactivation Rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{reactivationRate}%</p>
                  <Progress value={parseFloat(reactivationRate)} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Rewards Paid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalRewardsPaid.toLocaleString()} ETB</p>
                  <p className="text-sm text-muted-foreground">Total payout</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Avg Historical Txn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{avgHistoricalTxn}</p>
                  <p className="text-sm text-muted-foreground">Per targeted customer</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
                    <p className="text-sm font-medium">High Value Tier</p>
                    <p className="text-2xl font-bold text-green-500">50%</p>
                    <p className="text-xs text-muted-foreground">Reactivation rate</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Clock className="h-6 w-6 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Peak Response</p>
                    <p className="text-2xl font-bold text-blue-500">Day 2</p>
                    <p className="text-xs text-muted-foreground">3,200 reactivations</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Target className="h-6 w-6 text-purple-500 mb-2" />
                    <p className="text-sm font-medium">Best Region</p>
                    <p className="text-2xl font-bold text-purple-500">Addis Ababa</p>
                    <p className="text-xs text-muted-foreground">45% reactivation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Segmentation Analysis */}
          <TabsContent value="segmentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance by Customer Value Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tier" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="targeted" fill="hsl(var(--muted-foreground))" name="Targeted" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="reactivated" fill="hsl(var(--primary))" name="Reactivated" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Performance by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionPerformanceData.map((region, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{region.region}</span>
                        <span className="text-sm">
                          {region.reactivated.toLocaleString()} / {region.targeted.toLocaleString()}
                          <Badge variant="outline" className="ml-2">{region.rate}%</Badge>
                        </span>
                      </div>
                      <Progress value={region.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tierPerformanceData.map((tier, idx) => (
                <Card key={idx} className={`border-l-4 ${idx === 0 ? "border-l-green-500" : idx === 1 ? "border-l-yellow-500" : "border-l-orange-500"}`}>
                  <CardHeader className="pb-2">
                    <CardDescription>{tier.tier} Users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{tier.rate}%</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.reactivated.toLocaleString()} of {tier.targeted.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timing & Response Patterns */}
          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Days Taken to Reactivate
                </CardTitle>
                <CardDescription>Distribution of response timing after campaign start</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTimingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reactivations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription>Peak Response Period</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">Day 2</p>
                  <p className="text-sm text-muted-foreground">3,200 reactivations</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription>First 3 Days Response</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">54%</p>
                  <p className="text-sm text-muted-foreground">of all reactivations</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardDescription>Optimal Follow-up</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">Day 3-4</p>
                  <p className="text-sm text-muted-foreground">Recommended timing</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ROI & Business Impact */}
          <TabsContent value="roi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost of Rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">180,187 ETB</p>
                  <p className="text-sm text-muted-foreground">Total campaign cost</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Revenue from Reactivated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">892,500 ETB</p>
                  <p className="text-sm text-muted-foreground">30-day revenue</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Net Revenue Impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">+712,313 ETB</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    Profit
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Campaign ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">395%</p>
                  <p className="text-sm text-muted-foreground">Return on investment</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-500 mb-4">Reactivated Customers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Avg Monthly Transactions</span>
                        <span className="font-semibold">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Transaction Value</span>
                        <span className="font-semibold">245 ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Annual Revenue</span>
                        <span className="font-semibold text-green-500">52,920 ETB</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="font-semibold text-red-500 mb-4">Still-Churned Customers</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly Transactions</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Value</span>
                        <span className="font-semibold">0 ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Annual Revenue</span>
                        <span className="font-semibold text-red-500">0 ETB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>30-Day Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={78} className="h-4" />
                  </div>
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  12,187 of 15,625 reactivated customers remained active after 30 days
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exclusion Analysis */}
          <TabsContent value="exclusion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5" />
                  Exclusion Breakdown
                </CardTitle>
                <CardDescription>Why customers were excluded from campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={exclusionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="count"
                          label={({ reason, count }) => `${reason}: ${count.toLocaleString()}`}
                        >
                          {exclusionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {exclusionData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.reason}</span>
                        </div>
                        <span className="font-semibold">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Potential Expansion Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Previously Rewarded Pool</h4>
                    <p className="text-2xl font-bold">8,000</p>
                    <p className="text-sm text-muted-foreground">
                      Consider for next campaign cycle (90+ days since last reward)
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Recently Active Exclusions</h4>
                    <p className="text-2xl font-bold">12,000</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor for potential churn signals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Performance Tracking */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Daily Reactivation Rates
                </CardTitle>
                <CardDescription>Cumulative performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="cumulative" 
                        fill="hsl(var(--primary) / 0.2)"
                        stroke="hsl(var(--primary))"
                        name="Cumulative"
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="daily" 
                        fill="hsl(var(--secondary))" 
                        name="Daily"
                        radius={[4, 4, 0, 0]}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Best Day</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Dec 7</p>
                  <p className="text-sm text-green-500">2,100 reactivations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Daily</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1,563</p>
                  <p className="text-sm text-muted-foreground">Reactivations/day</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-sm text-muted-foreground">Campaign duration</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Current Total</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{reactivated.toLocaleString()}</p>
                  <p className="text-sm text-green-500">{reactivationRate}% rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavioral Insights */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>First Transaction Types After Reactivation</CardTitle>
                <CardDescription>What types of transactions reactivated customers perform first</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionTypeData.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-sm font-semibold">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription>Avg Transaction Value</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">245 ETB</p>
                  <p className="text-sm text-muted-foreground">Returning customers</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription>Avg Transactions/Month</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">After reactivation</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardDescription>Service Diversity</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">3.2</p>
                  <p className="text-sm text-muted-foreground">Avg services used</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Pattern After Reactivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Most Active Days</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monday</span>
                        <Badge>22%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Friday</span>
                        <Badge>19%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Saturday</span>
                        <Badge>18%</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Peak Hours</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Morning (8-11 AM)</span>
                        <Badge variant="secondary">28%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Afternoon (12-3 PM)</span>
                        <Badge variant="secondary">35%</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Evening (5-8 PM)</span>
                        <Badge variant="secondary">25%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}