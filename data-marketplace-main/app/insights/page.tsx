"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Search,
  Filter,
  Eye,
  Heart,
  Users,
  Database,
  Calendar,
  TrendingUp,
  PieChart,
  Activity,
  FileText,
  Brain,
  User,
  Building,
} from "lucide-react";
import { InsightPreview } from "@/components/insights/insight-preview";

interface Insight {
  id: string;
  title: string;
  description: string;
  insight_type: 'dashboard' | 'chart' | 'report' | 'analysis';
  publisher_name: string;
  team_name: string;
  team_department: string;
  status: string;
  visibility: string;
  metrics: {
    [key: string]: string | number;
  };
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
  data_sources?: string[];
  collections?: string[];
}

function getInsightTypeIcon(type: string) {
  switch (type) {
    case "dashboard":
      return BarChart3;
    case "chart":
      return PieChart;
    case "report":
      return FileText;
    case "analysis":
      return Brain;
    default:
      return Activity;
  }
}

function getInsightTypeColor(type: string) {
  switch (type) {
    case "dashboard":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "chart":
      return "bg-green-100 text-green-700 border-green-200";
    case "report":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "analysis":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function InsightCard({ insight }: { insight: Insight }) {
  const TypeIcon = getInsightTypeIcon(insight.insight_type);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg border-2 ${getInsightTypeColor(insight.insight_type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <Badge variant="outline" className="text-xs font-medium mb-2 capitalize">
                {insight.insight_type}
              </Badge>
              <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200">
                {insight.title}
              </CardTitle>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
          {insight.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Publisher Information */}
        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border">
          <Building className="h-4 w-4 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Published by</span>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {insight.team_department}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {insight.team_name}
            </p>
          </div>
        </div>

        {/* Preview Visualization */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Preview
          </h4>
          <InsightPreview 
            insightType={insight.insight_type}
            title={insight.title}
            metrics={insight.metrics}
          />
        </div>

        {/* Data Sources & Collections */}
        {((insight.data_sources && insight.data_sources.length > 0) || 
          (insight.collections && insight.collections.length > 0)) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sources
            </h4>
            <div className="flex flex-wrap gap-1">
              {insight.data_sources?.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
              {insight.collections?.map((collection, index) => (
                <Badge key={`col-${index}`} variant="secondary" className="text-xs">
                  📊 {collection}
                </Badge>
              ))}
              {(!insight.data_sources?.length && !insight.collections?.length) && (
                <span className="text-xs text-muted-foreground">No linked data sources</span>
              )}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {insight.metrics && Object.keys(insight.metrics).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Key Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(insight.metrics).slice(0, 4).map(([key, value], index) => (
                <div key={key} className="p-2 bg-white rounded-md border text-center">
                  <div className="text-xs text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{insight.view_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{insight.favorite_count}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(insight.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            onClick={() => {
              window.location.href = `/insights/${insight.id}`;
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/insights');
      const result = await response.json();
      
      if (result.success) {
        setInsights(result.data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.team_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || insight.insight_type === typeFilter;
    const matchesVisibility = visibilityFilter === "all" || insight.visibility === visibilityFilter;
    
    return matchesSearch && matchesType && matchesVisibility;
  });

  if (loading) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Browse Insights</h1>
              <p className="text-muted-foreground">
                Discover dashboards, charts, and analytics created by your team
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{insights.length}</div>
                  <div className="text-sm text-muted-foreground">Total Insights</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {new Set(insights.map(i => i.team_name)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {insights.reduce((sum, i) => sum + i.view_count, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {insights.reduce((sum, i) => sum + i.favorite_count, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search insights, teams, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-2 focus:border-primary/50"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-2">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dashboard">Dashboards</SelectItem>
                <SelectItem value="chart">Charts</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-2">
                <SelectValue placeholder="Filter by visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Insights Grid */}
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No insights found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== "all" || visibilityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No insights have been created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
