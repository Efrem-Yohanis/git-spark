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
  ArrowDownRight,
  Wallet,
  Repeat,
  Award,
  Smartphone
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, Legend } from "recharts";

// Mock data for demonstration
const rewardDistributionData = [
  { rewards: "1x", customers: 4500, percentage: 35 },
  { rewards: "2x", customers: 3200, percentage: 25 },
  { rewards: "3x", customers: 2100, percentage: 16 },
  { rewards: "4x", customers: 1800, percentage: 14 },
  { rewards: "5x (limit)", customers: 1300, percentage: 10 },
];

const segmentData = [
  { name: "50-100 Birr", value: 45, color: "hsl(var(--primary))" },
  { name: "100+ Birr", value: 55, color: "hsl(var(--secondary))" },
];

const behaviorChangeData = [
  { period: "Week 1", mpesaBefore: 20, mpesaAfter: 35, bankBefore: 80, bankAfter: 65 },
  { period: "Week 2", mpesaBefore: 22, mpesaAfter: 48, bankBefore: 78, bankAfter: 52 },
  { period: "Week 3", mpesaBefore: 25, mpesaAfter: 62, bankBefore: 75, bankAfter: 38 },
  { period: "Week 4", mpesaBefore: 28, mpesaAfter: 75, bankBefore: 72, bankAfter: 25 },
];

const frequencyData = [
  { frequency: "Daily", customers: 1200 },
  { frequency: "2-3x/week", customers: 3500 },
  { frequency: "Weekly", customers: 4200 },
  { frequency: "Bi-weekly", customers: 2800 },
  { frequency: "Monthly", customers: 1200 },
];

export default function CBECampaign() {
  const totalTargeted = 45000;
  const rewardsDistributed = 12900;
  const rewardAmount = 11.5;
  const totalRewardAmount = rewardsDistributed * rewardAmount;
  const conversionRate = 68.5;
  const roi = 245;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CBE Campaign Reports
          </h1>
          <p className="text-muted-foreground mt-1">Bank to MPESA recharge conversion campaign analytics</p>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          {/* Campaign Performance Report */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Customers Targeted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalTargeted.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Bank recharge users</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Total Rewards Distributed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{rewardsDistributed.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Rewards claimed</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Reward Amount
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalRewardAmount.toLocaleString()} ETB</p>
                  <p className="text-sm text-muted-foreground mt-1">{rewardAmount} Birr × {rewardsDistributed.toLocaleString()} rewards</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Conversion Rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    Bank to MPESA switch
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Campaign ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{roi}%</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    Return on investment
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Avg Rewards per Customer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">2.8</p>
                  <p className="text-sm text-muted-foreground mt-1">Out of 5 max rewards</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Segmentation Report */}
          <TabsContent value="segmentation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    By Recharge Amount
                  </CardTitle>
                  <CardDescription>50-100 Birr vs 100+ Birr segments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={segmentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {segmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {segmentData.map((seg, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-sm">{seg.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5" />
                    By Bank Activity Frequency
                  </CardTitle>
                  <CardDescription>How often customers use bank for recharge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={frequencyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="frequency" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="customers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segment Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">High Value (100+ Birr)</p>
                    <p className="text-2xl font-bold mt-1">24,750</p>
                    <p className="text-sm text-green-500 mt-1">72% conversion rate</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Medium Value (50-100 Birr)</p>
                    <p className="text-2xl font-bold mt-1">20,250</p>
                    <p className="text-sm text-yellow-500 mt-1">64% conversion rate</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Frequent Users (2x+/week)</p>
                    <p className="text-2xl font-bold mt-1">8,900</p>
                    <p className="text-sm text-green-500 mt-1">85% conversion rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward Utilization Report */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardDescription>Reached 5-Reward Limit</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">1,300</p>
                  <p className="text-sm text-muted-foreground">Customers at max rewards</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardDescription>Average Rewards/Customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">2.8</p>
                  <Progress value={56} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription>Total Reward Value</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{totalRewardAmount.toLocaleString()} ETB</p>
                  <p className="text-sm text-muted-foreground">Campaign cost</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Reward Distribution Pattern
                </CardTitle>
                <CardDescription>Number of customers by reward count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rewardDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rewards" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="customers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                        {rewardDistributionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 4 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardDistributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Badge variant={idx === 4 ? "destructive" : "secondary"} className="w-20 justify-center">
                        {item.rewards}
                      </Badge>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-24 text-right">
                        {item.customers.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Change Report */}
          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    MPESA Usage Increase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">+168%</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                    After campaign participation
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Bank Recharge Reduction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">-65%</p>
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <ArrowDownRight className="h-4 w-4" />
                    After rewards
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Before/After MPESA Usage Comparison</CardTitle>
                <CardDescription>Weekly trend of payment method usage for rewarded customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={behaviorChangeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mpesaAfter" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="MPESA (After)"
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mpesaBefore" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="MPESA (Before)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bankAfter" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={3}
                        name="Bank (After)"
                        dot={{ fill: "hsl(var(--destructive))" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bankBefore" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Bank (Before)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Behavior Change Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-500">MPESA Recharge Increase</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Before Campaign</span>
                        <span>24 avg transactions/customer</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>After Campaign</span>
                        <span>64 avg transactions/customer</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-green-500">
                        <span>Change</span>
                        <span>+167% increase</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-500">Bank Recharge Reduction</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Before Campaign</span>
                        <span>76 avg transactions/customer</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>After Campaign</span>
                        <span>27 avg transactions/customer</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-red-500">
                        <span>Change</span>
                        <span>-64% decrease</span>
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