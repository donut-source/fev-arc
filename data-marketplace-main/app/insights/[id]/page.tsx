"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  ArrowLeft,
  Eye,
  Heart,
  Share2,
  Download,
  Calendar,
  User,
  Building,
  TrendingUp,
  PieChart,
  FileText,
  Brain,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { InsightVisualization } from "@/components/insights/insight-visualization";

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
  chart_config: {
    [key: string]: any;
  };
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
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

export default function InsightDetailPage() {
  const params = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchInsight(params.id as string);
    }
  }, [params.id]);

  const fetchInsight = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/insights/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch insight');
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch insight');
      }
      
      setInsight(result.data);
    } catch (err) {
      setError('Failed to fetch insight details');
      console.error('Error fetching insight:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading insight details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Insight not found</h3>
            <p className="text-muted-foreground mb-4">
              {error || "The insight you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link href="/insights">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Insights
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const TypeIcon = getInsightTypeIcon(insight.insight_type);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/insights">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Insights
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl border-2 ${getInsightTypeColor(insight.insight_type)}`}>
                <TypeIcon className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {insight.insight_type}
                  </Badge>
                  <Badge variant={insight.visibility === 'public' ? 'default' : 'secondary'}>
                    {insight.visibility}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {insight.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {insight.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                {insight.favorite_count}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insight Visualization Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TypeIcon className="h-5 w-5" />
                  {insight.insight_type === 'dashboard' ? 'Dashboard View' : 
                   insight.insight_type === 'chart' ? 'Chart Visualization' :
                   insight.insight_type === 'report' ? 'Report Content' : 'Analysis Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg border p-4">
                  <InsightVisualization 
                    insightType={insight.insight_type}
                    title={insight.title}
                    metrics={insight.metrics}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            {insight.metrics && Object.keys(insight.metrics).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(insight.metrics).map(([key, value]) => (
                      <div key={key} className="p-4 bg-slate-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {value}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publisher Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Publisher Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{insight.publisher_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">Publisher</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{insight.team_name}</div>
                    <div className="text-sm text-muted-foreground">{insight.team_department}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="font-semibold">{insight.view_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Favorites</span>
                  </div>
                  <span className="font-semibold">{insight.favorite_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Created</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Updated</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(insight.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            {insight.chart_config && Object.keys(insight.chart_config).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(insight.chart_config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-medium">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
