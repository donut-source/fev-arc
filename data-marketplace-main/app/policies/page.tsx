"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  FileText,
  ExternalLink,
  Settings,
  Users,
  Lock,
  Building,
  Scale,
  Clock,
} from "lucide-react";

interface Policy {
  id: number;
  name: string;
  description: string;
  category: string;
  policy_type: string;
  compliance_level: string;
  effective_date: string;
  review_date: string;
  enforcement_level: string;
  scope: string;
  exceptions: string;
  related_regulations: string[];
  status: string;
  last_updated: string;
  created_at: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCompliance, setSelectedCompliance] = useState("All Compliance Levels");

  useEffect(() => {
    fetchPolicies();
  }, [searchQuery, selectedCategory, selectedCompliance]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (selectedCompliance !== 'All Compliance Levels') params.append('compliance_level', selectedCompliance);

      const response = await fetch(`/api/policies?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPolicies(result.data);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceBadgeColor = (level: string) => {
    switch (level) {
      case 'mandatory':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'advisory':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optional':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnforcementColor = (level: string) => {
    switch (level) {
      case 'strict':
        return 'text-red-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'flexible':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return Shield;
      case 'data governance':
        return FileText;
      case 'hr':
        return Users;
      case 'finance':
        return Building;
      case 'legal':
        return Scale;
      case 'privacy':
        return Lock;
      default:
        return FileText;
    }
  };

  const categories = ['All Categories', 'Security', 'Data Governance', 'HR', 'Finance', 'Legal', 'Privacy', 'Operations', 'Technology', 'Corporate'];
  const complianceLevels = ['All Compliance Levels', 'mandatory', 'advisory', 'optional'];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Corporate Policies
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse company policies, compliance requirements, and governance guidelines
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies, regulations, or requirements..."
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
            <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Compliance Level" />
              </SelectTrigger>
              <SelectContent>
                {complianceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Policies Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => {
              const CategoryIcon = getCategoryIcon(policy.category);
              return (
                <Card key={policy.id} className="transition-all hover:shadow-lg border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                          policy.category === 'Security' ? 'text-red-600 bg-red-50 border-red-200' :
                          policy.category === 'Data Governance' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          policy.category === 'HR' ? 'text-green-600 bg-green-50 border-green-200' :
                          policy.category === 'Finance' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          'text-gray-600 bg-gray-50 border-gray-200'
                        }`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg font-semibold line-clamp-1 mb-0">
                            {policy.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-0">
                            {policy.policy_type} • {policy.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {policy.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 pb-4 space-y-1">
                    <CardDescription className="line-clamp-3 mb-1 mt-0 -mt-1">
                      {policy.description}
                    </CardDescription>

                    {/* Policy Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Effective:</span>
                        <p className="font-medium">{new Date(policy.effective_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Review:</span>
                        <p className="font-medium">{new Date(policy.review_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Compliance Level */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Compliance:</span>
                      <Badge variant="secondary" className={`text-xs ${getComplianceBadgeColor(policy.compliance_level)}`}>
                        {policy.compliance_level.charAt(0).toUpperCase() + policy.compliance_level.slice(1)}
                      </Badge>
                    </div>

                    {/* Enforcement Level */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Enforcement:</span>
                      <span className={`font-medium ${getEnforcementColor(policy.enforcement_level)}`}>
                        {policy.enforcement_level}
                      </span>
                    </div>

                    {/* Related Regulations */}
                    {policy.related_regulations && policy.related_regulations.length > 0 && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Regulations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {policy.related_regulations.slice(0, 2).map((reg, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reg}
                            </Badge>
                          ))}
                          {policy.related_regulations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{policy.related_regulations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          // TODO: Open policy details modal
                          console.log('View policy details:', policy.name);
                        }}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        Read Policy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          // TODO: Download or share policy
                          console.log('Download policy:', policy.name);
                        }}
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && policies.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center max-w-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                <Shield className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No policies found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all available policies.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedCompliance("All Compliance Levels");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && policies.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{policies.length}</p>
                      <p className="text-sm text-muted-foreground">Active Policies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {policies.filter(p => p.compliance_level === 'mandatory').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Mandatory</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {policies.filter(p => new Date(p.review_date) < new Date(Date.now() + 90*24*60*60*1000)).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Due for Review</p>
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
                        {new Set(policies.map(policy => policy.category)).size}
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
