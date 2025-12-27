import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Users,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

const dataMetrics = {
  totalAssets: 1247,
  datasets: 847,
  apis: 234,
  models: 89,
  warehouses: 77,
  governanceScore: 94,
  activeUsers: 156,
  newThisWeek: 23,
};

const recentAssets = [
  {
    id: "1",
    name: "FX Spot + Forward Curves (G10) – Daily",
    type: "dataset",
    team: "ARC – Private Equity Analytics",
    status: "ready",
    lastUpdated: "2 hours ago",
    governance: 98,
    description: "Spot + forward points with derived carry/roll metrics",
  },
  {
    id: "2", 
    name: "FX Stress Scenarios API",
    type: "api",
    team: "ARC – Private Equity Analytics",
    status: "ready",
    lastUpdated: "4 hours ago",
    governance: 95,
    description: "Scenario paths for FX shocks + implied hedging costs",
  },
  {
    id: "3",
    name: "Valuation Quality Checks (Model)",
    type: "model",
    team: "ARC – Private Equity Analytics",
    status: "pending",
    lastUpdated: "1 day ago",
    governance: 87,
    description: "Flags outlier multiples and inconsistent comp selection",
  },
  {
    id: "4",
    name: "Deal Room Warehouse (Synthetic)",
    type: "warehouse",
    team: "ARC – Private Equity Analytics",
    status: "ready",
    lastUpdated: "6 hours ago",
    governance: 92,
    description: "Synthetic deal room warehouse for diligence and IC workflows",
  },
];

const quickActions = [
  {
    title: "Browse ARC Catalog",
    description: "Explore alternative-data products for PE workflows",
    href: "/marketplace",
    icon: Database,
    color: "text-blue-600",
  },
  {
    title: "Request Data Access",
    description: "Submit a new data access request",
    href: "/requests/new",
    icon: Shield,
    color: "text-green-600",
  },
  {
    title: "View Governance Dashboard",
    description: "Check data quality and compliance",
    href: "/governance",
    icon: Activity,
    color: "text-purple-600",
  },
  {
    title: "My Data Assets",
    description: "Manage your subscribed data",
    href: "/my-data",
    icon: Users,
    color: "text-orange-600",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "ready":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "issues":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "dataset":
      return <Database className="h-4 w-4 text-blue-600" />;
    case "api":
      return <Zap className="h-4 w-4 text-green-600" />;
    case "model":
      return <Brain className="h-4 w-4 text-purple-600" />;
    case "warehouse":
      return <Database className="h-4 w-4 text-orange-600" />;
    default:
      return <Database className="h-4 w-4" />;
  }
}

export function DataOverview() {
  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{dataMetrics.totalAssets.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+{dataMetrics.newThisWeek} this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Governance Score</p>
                <p className="text-2xl font-bold">{dataMetrics.governanceScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={dataMetrics.governanceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{dataMetrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <span>Across all teams</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">{dataMetrics.datasets}</p>
                <p className="text-xs text-muted-foreground">Datasets</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{dataMetrics.apis}</p>
                <p className="text-xs text-muted-foreground">APIs</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">{dataMetrics.models}</p>
                <p className="text-xs text-muted-foreground">Models</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">{dataMetrics.warehouses}</p>
                <p className="text-xs text-muted-foreground">Warehouses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                  asChild
                >
                  <Link href={action.href}>
                    <IconComponent className={`h-5 w-5 ${action.color}`} />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Assets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Updated Assets</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/marketplace">
              View All
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(asset.type)}
                    {getStatusIcon(asset.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{asset.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {asset.team}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{asset.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>Updated {asset.lastUpdated}</span>
                      <span>•</span>
                      <span>Governance: {asset.governance}%</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/assets/${asset.id}`}>
                    View Details
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

