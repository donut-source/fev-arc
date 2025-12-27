"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Database,
  Brain,
  Zap,
  TrendingUp,
  Download,
  Eye,
  Star,
  Calendar,
  Activity,
  CreditCard,
  Settings,
  Plus,
  BarChart3,
  Users,
  Shield,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Folder,
  Wrench,
  User,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
} from "lucide-react";

// Mock data for the user's collections
const userCollections = [
  {
    id: "1",
    name: "Cross-Border Diligence Pack (Demo)",
    description: "FX + valuation + company intelligence products for IC memos",
    itemCount: 12,
    lastUpdated: "2024-01-15",
    isPublic: false,
  },
  {
    id: "2", 
    name: "Portfolio Monitoring Signals (Demo)",
    description: "Real estate + macro signals for portfolio monitoring",
    itemCount: 8,
    lastUpdated: "2024-01-10",
    isPublic: true,
  },
];

// Mock data for data assets user has access to
const userDataAssets = [
  {
    id: "1",
    title: "FX Spot + Forward Curves (G10) – Daily",
    type: "dataset",
    category: "FX Rates",
    game: "Coverage: G10 FX",
    accessLevel: "read",
    lastAccessed: "2024-01-14",
    trustScore: 95,
  },
  {
    id: "2",
    title: "Company Intelligence – Private Market Profiles",
    type: "api",
    category: "Company Intelligence", 
    game: "Entity: Private + Public Companies",
    accessLevel: "read-write",
    lastAccessed: "2024-01-12",
    trustScore: 88,
  },
  {
    id: "3",
    title: "Valuation Quality Checks (Model)",
    type: "model",
    category: "PE Valuation",
    game: "Coverage: Transactions + Comps", 
    accessLevel: "read",
    lastAccessed: "2024-01-08",
    trustScore: 92,
  },
];

// Mock data for tools user has access to
const userTools = [
  {
    id: "1",
    name: "Power BI",
    description: "IC-ready dashboards and portfolio monitoring",
    category: "BI",
    lastUsed: "2024-01-13",
    usageCount: 47,
  },
  {
    id: "2",
    name: "Looker",
    description: "Governed exploration and semantic modeling",
    category: "BI",
    lastUsed: "2024-01-11",
    usageCount: 23,
  },
  {
    id: "3",
    name: "Python",
    description: "Notebook analysis for diligence models and scenarios",
    category: "Analysis",
    lastUsed: "2024-01-09",
    usageCount: 15,
  },
];

// Mock data for team members
const teamMembers = [
  {
    id: "1",
    name: "Maria Alvarez",
    title: "Head of Data Products",
    department: "Private Equity",
    email: "maria.alvarez@arc-demo.com",
    avatar: null,
    isOnline: true,
    expertise: ["Alternative Data Governance", "Valuation", "LP Reporting"],
  },
  {
    id: "2",
    name: "Ben Carter", 
    title: "Data Steward",
    department: "Data Governance",
    email: "ben.carter@arc-demo.com",
    avatar: null,
    isOnline: false,
    expertise: ["Access Controls", "Data Quality", "Compliance"],
  },
  {
    id: "3",
    name: "John Doe",
    title: "Alternative Data Analyst",
    department: "Private Equity", 
    email: "john.doe@arc-demo.com",
    avatar: null,
    isOnline: true,
    expertise: ["FX Rates", "Real Estate Signals", "Power BI"],
  },
];

const dashboardStats = {
  totalCollections: userCollections.length,
  totalDataAssets: userDataAssets.length,
  totalTools: userTools.length,
  teamSize: teamMembers.length,
};

// Component for collection cards
function CollectionCard({ collection }: { collection: typeof userCollections[0] }) {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Folder className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">{collection.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{collection.description}</p>
            </div>
          </div>
          <Badge variant={collection.isPublic ? "default" : "secondary"}>
            {collection.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{collection.itemCount} items</span>
          <span className="text-muted-foreground">Updated {collection.lastUpdated}</span>
        </div>
        <Link href={`/collections/${collection.id}`} className="text-primary hover:underline text-sm">
          View Collection →
        </Link>
      </CardContent>
    </Card>
  );
}

// Component for data asset cards
function DataAssetCard({ asset }: { asset: typeof userDataAssets[0] }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dataset": return Database;
      case "api": return Zap;
      case "model": return Brain;
      default: return Database;
    }
  };

  const IconComponent = getTypeIcon(asset.type);

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <IconComponent className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1 text-xs">
                {asset.category}
              </Badge>
              <CardTitle className="text-base">{asset.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.game}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">{asset.trustScore}%</div>
            <div className="text-xs text-muted-foreground">Trust Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className="text-xs">
            {asset.accessLevel}
          </Badge>
          <span className="text-muted-foreground">Last accessed {asset.lastAccessed}</span>
        </div>
        <Link href={`/data-sources/${asset.id}`} className="text-primary hover:underline text-sm">
          View Details →
        </Link>
      </CardContent>
    </Card>
  );
}

// Component for tool cards
function ToolCard({ tool }: { tool: typeof userTools[0] }) {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Wrench className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1 text-xs">
                {tool.category}
              </Badge>
              <CardTitle className="text-base">{tool.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{tool.usageCount} uses</span>
          <span className="text-muted-foreground">Last used {tool.lastUsed}</span>
        </div>
        <Link href={`/tools/${tool.id}`} className="text-primary hover:underline text-sm">
          Use Tool →
        </Link>
      </CardContent>
    </Card>
  );
}

// Component for team member cards
function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar || undefined} />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              member.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium">{member.name}</h4>
            <p className="text-sm text-muted-foreground">{member.title}</p>
            <p className="text-xs text-muted-foreground">{member.department}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {member.expertise.slice(0, 2).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {member.expertise.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{member.expertise.length - 2}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
              <p className="text-muted-foreground">
                Your gaming data assets, collections, tools, and team
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href="/marketplace">
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Data
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Collections</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalCollections}</p>
                </div>
                <Folder className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <span>Personal data collections</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Assets</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalDataAssets}</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <span>Accessible data sources</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tools</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalTools}</p>
                </div>
                <Wrench className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <span>Available analytics tools</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                  <p className="text-2xl font-bold">{dashboardStats.teamSize}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <span>ARC – Private Equity Analytics team</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-14 bg-muted/50 rounded-xl p-2 gap-2">
              <TabsTrigger 
                value="overview"
                className="text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-0 data-[state=inactive]:border data-[state=inactive]:border-border/50 data-[state=inactive]:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="collections"
                className="text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-0 data-[state=inactive]:border data-[state=inactive]:border-border/50 data-[state=inactive]:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Collections
              </TabsTrigger>
              <TabsTrigger 
                value="assets"
                className="text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-0 data-[state=inactive]:border data-[state=inactive]:border-border/50 data-[state=inactive]:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Data Assets
              </TabsTrigger>
              <TabsTrigger 
                value="team"
                className="text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-0 data-[state=inactive]:border data-[state=inactive]:border-border/50 data-[state=inactive]:text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Team
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Collections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Collections
                    <Badge variant="secondary">{userCollections.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userCollections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Folder className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{collection.name}</p>
                          <p className="text-xs text-muted-foreground">{collection.itemCount} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={collection.isPublic ? "default" : "secondary"} className="text-xs">
                          {collection.isPublic ? "Public" : "Private"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {collection.lastUpdated}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/collections">
                      <Plus className="mr-2 h-4 w-4" />
                      View All Collections
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Data Assets */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Data Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userDataAssets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                          {asset.type === "dataset" && <Database className="h-4 w-4 text-green-600" />}
                          {asset.type === "api" && <Zap className="h-4 w-4 text-green-600" />}
                          {asset.type === "model" && <Brain className="h-4 w-4 text-green-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{asset.title}</p>
                          <p className="text-xs text-muted-foreground">{asset.game}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">{asset.trustScore}%</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.lastAccessed}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/marketplace">
                      <Eye className="mr-2 h-4 w-4" />
                      Browse All Data
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tools Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Available Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {userTools.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Wrench className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.usageCount} uses</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/tools">
                    <Wrench className="mr-2 h-4 w-4" />
                    View All Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create New Collection</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Organize your data assets into collections for easy access and sharing
                </p>
                <Button asChild>
                  <Link href="/collections/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userDataAssets.map((asset) => (
                <DataAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invite Team Members</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Collaborate with colleagues by inviting them to your team
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
