"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ─── Mock Data ────────────────────────────────────────────────────────────────

// Last 30 days of daily revenue (Mon–Fri ~$2,500–$5,000, weekends ~$800–$1,500)
const last30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 25);
  d.setDate(d.getDate() - (29 - i));
  return d;
});

const dailyRevenueValues = [
  1100, 3820, 4210, 3650, 4480, 3970, 4620,
  1250, 900,  4110, 3780, 4330, 3940, 4750,
  1050, 1300, 3600, 4090, 3870, 4420, 3750,
  1180, 980,  4280, 4010, 3660, 4540, 3900,
  4720, 3847,
];

const dailyRevenueLabels = last30Days.map((d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
);

// Last 14 days jobs: completed vs cancelled
const last14Days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 2, 25);
  d.setDate(d.getDate() - (13 - i));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

const jobsCompleted = [11, 14, 13, 12, 15, 9, 7, 13, 14, 12, 16, 13, 14, 14];
const jobsCancelled = [1, 2, 1, 2, 1, 1, 0, 1, 2, 1, 1, 2, 1, 2];

// Today's job table
const todaysJobs = [
  { date: "Mar 25", tech: "Marcus Webb", customer: "Sunrise Bakery", service: "General Pest", status: "Completed" },
  { date: "Mar 25", tech: "Daria Chen", customer: "Patterson Residence", service: "Rodent Control", status: "Completed" },
  { date: "Mar 25", tech: "Jake Torres", customer: "Westwood Apts", service: "Mosquito Service", status: "Completed" },
  { date: "Mar 25", tech: "Marcus Webb", customer: "Choi Family", service: "Ant/Spider", status: "Completed" },
  { date: "Mar 25", tech: "Aisha Patel", customer: "Lakeview Office Park", service: "Termite Treatment", status: "Completed" },
  { date: "Mar 25", tech: "Troy Simmons", customer: "Green Thumb Nursery", service: "General Pest", status: "Scheduled" },
  { date: "Mar 25", tech: "Daria Chen", customer: "Rivera Residence", service: "Bed Bug Treatment", status: "Scheduled" },
  { date: "Mar 25", tech: "Jake Torres", customer: "Summit Storage", service: "Rodent Control", status: "Cancelled" },
];

// Technicians
const techNames = ["Marcus Webb", "Daria Chen", "Jake Torres", "Aisha Patel", "Troy Simmons"];
const techJobs = [22, 19, 18, 15, 12];
const techData = [
  { name: "Marcus Webb", jobs: 22, revenue: 6380, completion: "95.7%", avgDuration: "48 min" },
  { name: "Daria Chen", jobs: 19, revenue: 5510, completion: "92.1%", avgDuration: "52 min" },
  { name: "Jake Torres", jobs: 18, revenue: 4950, completion: "90.0%", avgDuration: "55 min" },
  { name: "Aisha Patel", jobs: 15, revenue: 5775, completion: "93.8%", avgDuration: "61 min" },
  { name: "Troy Simmons", jobs: 12, revenue: 3480, completion: "88.2%", avgDuration: "44 min" },
];

// Ticket size — last 12 months
const ticketMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const avgTicketValues = [238, 241, 245, 248, 252, 255, 258, 261, 265, 268, 271, 274];

// Service type table
const serviceTypes = [
  { type: "General Pest", avgTicket: "$198", jobs: 89, revenue: "$17,622" },
  { type: "Termite Treatment", avgTicket: "$620", jobs: 12, revenue: "$7,440" },
  { type: "Rodent Control", avgTicket: "$345", jobs: 28, revenue: "$9,660" },
  { type: "Mosquito Service", avgTicket: "$155", jobs: 47, revenue: "$7,285" },
  { type: "Bed Bug Treatment", avgTicket: "$890", jobs: 8, revenue: "$7,120" },
  { type: "Ant/Spider", avgTicket: "$175", jobs: 34, revenue: "$5,950" },
];

// Receivables aging
const agingLabels = ["Current", "1–30 Days", "31–60 Days", "60+ Days"];
const agingValues = [12840, 4220, 1890, 780];
const agingColors = [
  "rgba(34, 197, 94, 0.8)",
  "rgba(234, 179, 8, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(239, 68, 68, 0.8)",
];
const agingBorderColors = [
  "rgba(34, 197, 94, 1)",
  "rgba(234, 179, 8, 1)",
  "rgba(249, 115, 22, 1)",
  "rgba(239, 68, 68, 1)",
];

// Overdue accounts
const overdueAccounts = [
  { name: "Ridgeway Properties LLC", amount: "$840", days: 67, lastContact: "Mar 12" },
  { name: "Sunbelt Retail Group", amount: "$620", days: 45, lastContact: "Mar 18" },
  { name: "Johnson Residence", amount: "$198", days: 38, lastContact: "Mar 20" },
  { name: "TechHub Coworking", amount: "$412", days: 72, lastContact: "Mar 8" },
  { name: "Maple Grove HOA", amount: "$990", days: 31, lastContact: "Mar 22" },
  { name: "Blue Sky Bistro", amount: "$245", days: 58, lastContact: "Mar 14" },
  { name: "Cascade Storage", amount: "$355", days: 44, lastContact: "Mar 17" },
  { name: "Whitmore Family", amount: "$175", days: 33, lastContact: "Mar 21" },
];

// Service area zip codes
const zipData = [
  { zip: "30305", area: "Buckhead", customers: 68, jobsMTD: 94, revMTD: "$14,820" },
  { zip: "30319", area: "Brookhaven", customers: 54, jobsMTD: 78, revMTD: "$12,350" },
  { zip: "30327", area: "Sandy Springs N.", customers: 49, jobsMTD: 71, revMTD: "$11,490" },
  { zip: "30338", area: "Dunwoody", customers: 45, jobsMTD: 63, revMTD: "$10,240" },
  { zip: "30067", area: "Marietta E.", customers: 38, jobsMTD: 55, revMTD: "$8,970" },
  { zip: "30022", area: "Alpharetta S.", customers: 36, jobsMTD: 51, revMTD: "$8,320" },
  { zip: "30342", area: "North Atlanta", customers: 32, jobsMTD: 46, revMTD: "$7,440" },
  { zip: "30350", area: "Peachtree Corners", customers: 28, jobsMTD: 39, revMTD: "$6,380" },
  { zip: "30092", area: "Norcross", customers: 24, jobsMTD: 34, revMTD: "$5,510" },
  { zip: "30144", area: "Kennesaw", customers: 21, jobsMTD: 29, revMTD: "$4,720" },
];

const zipRevenueRaw = [14820, 12350, 11490, 10240, 8970, 8320, 7440, 6380];
const zipRevenueLabels = zipData.slice(0, 8).map((z) => z.zip);

// ─── Chart Options Helpers ────────────────────────────────────────────────────

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
  },
};

const noLegendOptions = {
  ...baseOptions,
  plugins: { legend: { display: false } },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Current: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function OverdueBadge({ days }: { days: number }) {
  const cls =
    days >= 60
      ? "bg-red-100 text-red-700"
      : days >= 30
      ? "bg-orange-100 text-orange-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {days}d overdue
    </span>
  );
}

// ─── Tab trigger class helper ─────────────────────────────────────────────────

const tabTriggerClass =
  "text-xs font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-0 data-[state=inactive]:border data-[state=inactive]:border-border/50 data-[state=inactive]:text-muted-foreground hover:bg-accent hover:text-accent-foreground";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PestControlPage() {
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pest Control Operations Dashboard</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-muted-foreground">FieldRoutes · Live Data (Simulated)</p>
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Live
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last synced: Today 6:00 AM</span>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</p>
                  <p className="text-2xl font-bold">$3,847</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center text-xs text-green-600 mt-2 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +12% vs yesterday
              </div>
            </CardContent>
          </Card>

          {/* Jobs Today */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jobs Today</p>
                  <p className="text-2xl font-bold">14 / 16</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-blue-500" />
                87.5% completion rate
              </div>
            </CardContent>
          </Card>

          {/* Active Customers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                  <p className="text-2xl font-bold">412</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center text-xs text-blue-600 mt-2 font-medium">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +3 new today
              </div>
            </CardContent>
          </Card>

          {/* Avg Ticket */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Ticket</p>
                  <p className="text-2xl font-bold">$274</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="flex items-center text-xs text-yellow-600 mt-2 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                +$18 vs last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-7 h-14 bg-muted/50 rounded-xl p-2 gap-1">
              {["revenue", "jobs", "technicians", "retention", "ticket", "receivables", "area"].map((tab, i) => {
                const labels = ["Revenue", "Jobs", "Technicians", "Retention", "Ticket Size", "Receivables", "Service Area"];
                return (
                  <TabsTrigger key={tab} value={tab} className={tabTriggerClass}>
                    {labels[i]}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* ── Tab 1: Revenue ── */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue — Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={{
                      labels: dailyRevenueLabels,
                      datasets: [
                        {
                          label: "Revenue ($)",
                          data: dailyRevenueValues,
                          backgroundColor: "rgba(59, 130, 246, 0.8)",
                          borderColor: "rgba(59, 130, 246, 1)",
                          borderWidth: 1,
                          borderRadius: 3,
                        },
                      ],
                    }}
                    options={{
                      ...noLegendOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (v) => `$${Number(v).toLocaleString()}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-green-600">$61,240</p>
                  <p className="text-xs text-muted-foreground mt-1">March 2026 (MTD)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold">$54,880</p>
                  <p className="text-xs text-muted-foreground mt-1">February 2026</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">YoY Growth</p>
                  <p className="text-2xl font-bold text-green-600">+11.6%</p>
                  <p className="text-xs text-muted-foreground mt-1">vs March 2025</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Tab 2: Jobs ── */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed vs Cancelled — Last 14 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={{
                      labels: last14Days,
                      datasets: [
                        {
                          label: "Completed",
                          data: jobsCompleted,
                          backgroundColor: "rgba(34, 197, 94, 0.8)",
                          borderColor: "rgba(34, 197, 94, 1)",
                          borderWidth: 1,
                          borderRadius: 3,
                        },
                        {
                          label: "Cancelled / No-Show",
                          data: jobsCancelled,
                          backgroundColor: "rgba(239, 68, 68, 0.8)",
                          borderColor: "rgba(239, 68, 68, 1)",
                          borderWidth: 1,
                          borderRadius: 3,
                        },
                      ],
                    }}
                    options={{
                      ...baseOptions,
                      scales: { y: { beginAtZero: true, ticks: { stepSize: 2 } } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Avg Daily Jobs</p>
                  <p className="text-2xl font-bold">13.4</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">91.2%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Most Cancelled Day</p>
                  <p className="text-2xl font-bold text-red-500">Tuesday</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Technician</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Service Type</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysJobs.map((job, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 text-muted-foreground">{job.date}</td>
                          <td className="py-2 px-3 font-medium">{job.tech}</td>
                          <td className="py-2 px-3">{job.customer}</td>
                          <td className="py-2 px-3 text-muted-foreground">{job.service}</td>
                          <td className="py-2 px-3">
                            <StatusBadge status={job.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab 3: Technicians ── */}
          <TabsContent value="technicians" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Completed This Week by Technician</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={{
                      labels: techNames,
                      datasets: [
                        {
                          label: "Jobs Completed",
                          data: techJobs,
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(34, 197, 94, 0.8)",
                            "rgba(234, 179, 8, 0.8)",
                            "rgba(168, 85, 247, 0.8)",
                            "rgba(249, 115, 22, 0.8)",
                          ],
                          borderColor: [
                            "rgba(59, 130, 246, 1)",
                            "rgba(34, 197, 94, 1)",
                            "rgba(234, 179, 8, 1)",
                            "rgba(168, 85, 247, 1)",
                            "rgba(249, 115, 22, 1)",
                          ],
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      ...noLegendOptions,
                      indexAxis: "y" as const,
                      scales: { x: { beginAtZero: true } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technician Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Technician</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Jobs This Week</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Revenue Generated</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Completion Rate</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Avg Job Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {techData.map((t, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium">{t.name}</td>
                          <td className="py-2 px-3 text-right">{t.jobs}</td>
                          <td className="py-2 px-3 text-right text-green-600 font-medium">${t.revenue.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">{t.completion}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{t.avgDuration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab 4: Retention ── */}
          <TabsContent value="retention" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Visit Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "300px" }}>
                    <Doughnut
                      data={{
                        labels: ["New (1st visit)", "One-time", "Repeat 2–5x", "Loyal 6+x"],
                        datasets: [
                          {
                            data: [18, 24, 41, 17],
                            backgroundColor: [
                              "rgba(59, 130, 246, 0.8)",
                              "rgba(234, 179, 8, 0.8)",
                              "rgba(34, 197, 94, 0.8)",
                              "rgba(168, 85, 247, 0.8)",
                            ],
                            borderColor: [
                              "rgba(59, 130, 246, 1)",
                              "rgba(234, 179, 8, 1)",
                              "rgba(34, 197, 94, 1)",
                              "rgba(168, 85, 247, 1)",
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        ...baseOptions,
                        plugins: {
                          legend: { position: "top" },
                          tooltip: {
                            callbacks: {
                              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "300px" }}>
                    <Doughnut
                      data={{
                        labels: ["Active Subscription", "No Subscription"],
                        datasets: [
                          {
                            data: [58, 42],
                            backgroundColor: [
                              "rgba(34, 197, 94, 0.8)",
                              "rgba(148, 163, 184, 0.8)",
                            ],
                            borderColor: [
                              "rgba(34, 197, 94, 1)",
                              "rgba(148, 163, 184, 1)",
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        ...baseOptions,
                        plugins: {
                          legend: { position: "top" },
                          tooltip: {
                            callbacks: {
                              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Repeat Rate</p>
                  <p className="text-2xl font-bold text-green-600">58%</p>
                  <p className="text-xs text-muted-foreground mt-1">Customers with 2+ visits</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">30-day Churn Risk</p>
                  <p className="text-2xl font-bold text-red-500">34 customers</p>
                  <p className="text-xs text-muted-foreground mt-1">No activity in 25+ days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground">Avg Customer Lifetime</p>
                  <p className="text-2xl font-bold">14 months</p>
                  <p className="text-xs text-muted-foreground mt-1">Across active base</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Tab 5: Ticket Size ── */}
          <TabsContent value="ticket" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avg Ticket Size — Last 12 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Line
                    data={{
                      labels: ticketMonths,
                      datasets: [
                        {
                          label: "Avg Ticket ($)",
                          data: avgTicketValues,
                          borderColor: "rgba(59, 130, 246, 1)",
                          backgroundColor: "rgba(59, 130, 246, 0.15)",
                          borderWidth: 2,
                          pointBackgroundColor: "rgba(59, 130, 246, 1)",
                          pointRadius: 4,
                          fill: true,
                          tension: 0.3,
                        },
                      ],
                    }}
                    options={{
                      ...baseOptions,
                      scales: {
                        y: {
                          beginAtZero: false,
                          min: 220,
                          ticks: { callback: (v) => `$${v}` },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Ticket by Service Type — March 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Service Type</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Avg Ticket</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Jobs This Month</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceTypes.map((s, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium">{s.type}</td>
                          <td className="py-2 px-3 text-right font-medium">{s.avgTicket}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{s.jobs}</td>
                          <td className="py-2 px-3 text-right text-green-600 font-medium">{s.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab 6: Receivables ── */}
          <TabsContent value="receivables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Receivable Aging</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={{
                      labels: agingLabels,
                      datasets: [
                        {
                          label: "Amount Outstanding ($)",
                          data: agingValues,
                          backgroundColor: agingColors,
                          borderColor: agingBorderColors,
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      ...noLegendOptions,
                      indexAxis: "y" as const,
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: { callback: (v) => `$${Number(v).toLocaleString()}` },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-4xl font-bold text-red-500 mt-1">$19,730</p>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="text-green-600 font-medium">Current: $12,840</span>
                  <span className="text-yellow-600 font-medium">1–30d: $4,220</span>
                  <span className="text-orange-600 font-medium">31–60d: $1,890</span>
                  <span className="text-red-600 font-medium">60+d: $780</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Overdue Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Customer Name</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount Owed</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Last Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueAccounts.map((acct, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 font-medium">{acct.name}</td>
                          <td className="py-2 px-3 text-right font-medium text-red-600">{acct.amount}</td>
                          <td className="py-2 px-3">
                            <OverdueBadge days={acct.days} />
                          </td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{acct.lastContact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab 7: Service Area ── */}
          <TabsContent value="area" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Zip Code (Top 8) — MTD</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={{
                      labels: zipRevenueLabels,
                      datasets: [
                        {
                          label: "Revenue MTD ($)",
                          data: zipRevenueRaw,
                          backgroundColor: "rgba(59, 130, 246, 0.8)",
                          borderColor: "rgba(59, 130, 246, 1)",
                          borderWidth: 1,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      ...noLegendOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { callback: (v) => `$${Number(v).toLocaleString()}` },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Area Coverage — Top Zip Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Zip Code</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Area Name</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Customers</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Jobs (MTD)</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Revenue (MTD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zipData.map((z, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-3 font-mono font-medium">{z.zip}</td>
                          <td className="py-2 px-3">{z.area}</td>
                          <td className="py-2 px-3 text-right">{z.customers}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{z.jobsMTD}</td>
                          <td className="py-2 px-3 text-right text-green-600 font-medium">{z.revMTD}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
