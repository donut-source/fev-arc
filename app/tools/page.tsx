"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wrench,
  Search,
  Filter,
  Users,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
  Settings,
  Zap,
  TrendingUp,
  Shield,
  Building,
} from "lucide-react";

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  vendor: string;
  access_level: string;
  pricing_model: string;
  integration_complexity: string;
  business_value: string;
  technical_requirements: string;
  setup_time: string;
  user_count: number;
  trust_score: number;
  status: string;
  last_updated: string;
  created_at: string;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("All Access Levels");

  useEffect(() => {
    fetchTools();
  }, [searchQuery, selectedCategory, selectedAccessLevel]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (selectedAccessLevel !== 'All Access Levels') params.append('access_level', selectedAccessLevel);

      const response = await fetch(`/api/tools?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setTools(result.data);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessBadgeColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'full_access':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_access':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'analytics':
        return TrendingUp;
      case 'security':
        return Shield;
      case 'development':
        return Settings;
      case 'automation':
        return Zap;
      case 'communication':
        return Users;
      default:
        return Wrench;
    }
  };

  const categories = ['All Categories', 'Analytics', 'Security', 'Development', 'Automation', 'Communication', 'Productivity', 'Finance', 'Marketing', 'Design'];
  const accessLevels = ['All Access Levels', 'full_access', 'restricted', 'no_access'];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Business Tools
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover and access business tools available to your organization
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools, vendors, or capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Access Level" />
              </SelectTrigger>
              <SelectContent>
                {accessLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => {
              const CategoryIcon = getCategoryIcon(tool.category);
              return (
                <Card key={tool.id} className="transition-all hover:shadow-lg border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                          tool.category === 'Analytics' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          tool.category === 'Security' ? 'text-red-600 bg-red-50 border-red-200' :
                          tool.category === 'Development' ? 'text-green-600 bg-green-50 border-green-200' :
                          tool.category === 'AI/ML' ? 'text-purple-600 bg-purple-50 border-purple-200' :
                          'text-gray-600 bg-gray-50 border-gray-200'
                        }`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg font-semibold line-clamp-1 mb-0">
                            {tool.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-0">
                            {tool.vendor} • {tool.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {tool.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 pb-4 space-y-1">
                    <CardDescription className="line-clamp-2 mb-1 mt-0 -mt-1">
                      {tool.description}
                    </CardDescription>

                    {/* Compact Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Users:</span>
                        <p className="font-medium">{tool.user_count}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Trust:</span>
                        <p className="font-medium">{tool.trust_score}%</p>
                      </div>
                    </div>

                    {/* Setup Time and Complexity */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{tool.setup_time}</span>
                      </div>
                      <span className={`font-medium ${getComplexityColor(tool.integration_complexity)}`}>
                        {tool.integration_complexity} complexity
                      </span>
                    </div>

                    {/* Access Level */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Your Access:</span>
                      <Badge variant="secondary" className={`text-xs ${getAccessBadgeColor(tool.access_level)}`}>
                        {tool.access_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>

                    {/* Pricing Model */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Pricing:</span>
                      <span className="font-medium capitalize">{tool.pricing_model.replace('_', ' ')}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          // TODO: Open tool details modal
                          console.log('View tool details:', tool.name);
                        }}
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          // TODO: Request access or open tool
                          window.open(`https://${tool.vendor.toLowerCase().replace(/\s+/g, '')}.com`, '_blank');
                        }}
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && tools.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center max-w-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                <Wrench className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all available tools.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedAccessLevel("All Access Levels");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && tools.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{tools.length}</p>
                      <p className="text-sm text-muted-foreground">Available Tools</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {tools.reduce((sum, tool) => sum + tool.user_count, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(tools.reduce((sum, tool) => sum + tool.trust_score, 0) / tools.length)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Trust Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {new Set(tools.map(tool => tool.category)).size}
                      </p>
                      <p className="text-sm text-muted-foreground">Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
