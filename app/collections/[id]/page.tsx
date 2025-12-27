"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCard } from "@/components/ui/data-card";
import {
  ArrowLeft,
  Database,
  Users,
  Share2,
  Download,
  Globe,
  Lock,
  Briefcase,
  Key,
  Shield,
  BarChart3,
} from "lucide-react";
import { useWorkbench } from "@/lib/workbench-context";
import { toast } from "sonner";
import { AccessRequestModal } from "@/components/modals/access-request-modal";

interface CollectionDetail {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  visibility: 'public' | 'private' | 'team';
  is_published: boolean;
  data_source_count: number;
  created_at: string;
  updated_at: string;
  access_level?: 'public' | 'restricted' | 'confidential';
  sensitivity_level?: 'low' | 'medium' | 'high';
  usage_stats?: {
    active_users: number;
    monthly_queries: number;
    top_consumers: string[];
  };
  ai_integrations?: string[];
  dashboards_using?: string[];
  data_sources: Array<{
    id: string;
    title: string;
    description: string;
    business_description?: string;
    type: string;
    category: string;
    game_title: string;
    genre: string;
    data_owner: string;
    steward: string;
    trust_score: number;
    status: string;
    platform?: string;
    team_name?: string;
    tags: string[];
    tech_stack: string[];
  }>;
}

function getVisibilityIcon(visibility: string) {
  switch (visibility) {
    case 'public':
      return <Globe className="h-4 w-4 text-green-600" />;
    case 'private':
      return <Lock className="h-4 w-4 text-red-600" />;
    case 'team':
      return <Users className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
}

export default function CollectionDetailPage() {
  const params = useParams();
  const { addItem } = useWorkbench();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get collection ID from params
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        // First try to get from localStorage (for user-published collections)
        const publishedCollections = JSON.parse(localStorage.getItem('published-collections') || '[]');
        const localCollection = publishedCollections.find((c: { id: string }) => c.id === id);

        if (localCollection) {
          // Transform local collection to match expected format
          setCollection({
            id: localCollection.id,
            name: localCollection.name,
            description: localCollection.description,
            owner_name: localCollection.owner,
            visibility: localCollection.visibility,
            is_published: true,
            data_source_count: localCollection.items.length,
            created_at: localCollection.createdAt,
            updated_at: localCollection.createdAt,
            access_level: 'public',
            sensitivity_level: 'low',
            usage_stats: {
              active_users: Math.floor(Math.random() * 50) + 10,
              monthly_queries: Math.floor(Math.random() * 1000) + 100,
              top_consumers: ['Analytics Team', 'Product Team', 'Data Science Team'],
            },
            ai_integrations: ['ChatGPT Analytics', 'Predictive Models', 'Recommendation Engine'],
            dashboards_using: ['Executive Dashboard', 'Game Performance Dashboard', 'Player Analytics Dashboard'],
            data_sources: localCollection.items.map((item: {
              id: string;
              title: string;
              description?: string;
              type: string;
              category: string;
              gameTitle: string;
              genre?: string;
              dataOwner: string;
              steward?: string;
              trustScore: number;
              tags?: string[];
              techStack?: string[];
              platform?: string;
              teamName?: string;
            }) => ({
              id: item.id,
              title: item.title,
              description: item.description || '',
              business_description: item.description || '',
              type: item.type,
              category: item.category,
              game_title: item.gameTitle,
              genre: item.genre || '',
              data_owner: item.dataOwner,
              steward: item.steward || '',
              trust_score: item.trustScore,
              status: 'ready',
              platform: item.platform || 'Snowflake',
              team_name: item.teamName || 'Data Team',
              tags: item.tags || [],
              tech_stack: item.techStack || [],
            })),
          });
        } else {
          // Try to fetch from API
          const response = await fetch(`/api/collections/${id}`);
          const result = await response.json();

          if (result.success) {
            setCollection(result.data);
          } else {
            setError(result.error || 'Failed to fetch collection details');
          }
        }
      } catch (err) {
        setError('Failed to fetch collection');
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddAllToWorkbench = () => {
    if (collection?.data_sources) {
      let addedCount = 0;
      collection.data_sources.forEach(dataSource => {
        addItem({
          id: dataSource.id,
          title: dataSource.title,
          description: dataSource.description,
          type: dataSource.type,
          category: dataSource.category,
          dataOwner: dataSource.data_owner,
          steward: dataSource.steward,
          techStack: dataSource.tech_stack || [],
          gameTitle: dataSource.game_title,
          genre: dataSource.genre,
          trustScore: dataSource.trust_score,
          tags: dataSource.tags || [],
        });
        addedCount++;
      });
      
      toast.success("Added to My Work Bench", {
        description: `${addedCount} data sources from "${collection.name}" have been added to your workbench.`,
        action: {
          label: "View Workbench",
          onClick: () => window.location.href = '/workbench',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading collection</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4 hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Button>

        <div className="w-full">
          <div className="max-w-none">
            {/* Collection Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-50 border-blue-200 text-blue-600">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>by {collection.owner_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getVisibilityIcon(collection.visibility)}
                        <Badge variant={collection.visibility === 'public' ? 'default' : 'secondary'}>
                          {collection.visibility}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground">
                  {collection.description}
                </p>
              </div>

              {/* Collection Stats - Horizontal Row */}
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <div className="px-4 py-3 rounded-lg border bg-card min-w-[120px]">
                  <div className="text-sm text-muted-foreground">Data Sources</div>
                  <div className="text-2xl font-bold">{collection.data_source_count}</div>
                </div>
                <div className="px-4 py-3 rounded-lg border bg-card min-w-[120px]">
                  <div className="text-sm text-muted-foreground">Active Users</div>
                  <div className="text-2xl font-bold">{collection.usage_stats?.active_users || 0}</div>
                </div>
                <div className="px-4 py-3 rounded-lg border bg-card min-w-[120px]">
                  <div className="text-sm text-muted-foreground">Monthly Queries</div>
                  <div className="text-2xl font-bold">{collection.usage_stats?.monthly_queries || 0}</div>
                </div>
                <div className={`px-4 py-3 rounded-lg border min-w-[120px] ${
                  collection.sensitivity_level === 'high' ? 'bg-red-50 border-red-200' :
                  collection.sensitivity_level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="text-sm text-muted-foreground">Sensitivity</div>
                  <div className="text-lg font-bold capitalize">{collection.sensitivity_level || 'Low'}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Above 3-Column Cards */}
            <Card className="border-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Collection Actions</span>
                </CardTitle>
                <CardDescription>
                  Manage access, add to your workbench, or export this collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowAccessModal(true)}
                    className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={handleAddAllToWorkbench}
                    className="w-full hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 hover:shadow-md"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Add to Workbench
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => toast.info("Share functionality coming soon!")} 
                    className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Collection
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const exportData = {
                        collection: {
                          name: collection.name,
                          description: collection.description,
                          owner: collection.owner_name,
                          visibility: collection.visibility,
                        },
                        dataSources: collection.data_sources,
                        exportedAt: new Date().toISOString(),
                      };

                      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${collection.name.toLowerCase().replace(/\s+/g, '-')}-collection.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      
                      toast.success("Collection Exported", {
                        description: "Collection data has been exported as a JSON file.",
                      });
                    }} 
                    className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Collection
                  </Button>
                </div>

                {/* Vibrant Action Buttons */}
                <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast.success("Shared with deal team");
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-md"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast.success("Opening in Looker...");
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Open in Looker
                  </Button>
                  
                          <Button 
                            size="sm"
                            onClick={() => {
                              window.open('/fev-ai-space', '_blank');
                            }}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 hover:shadow-md"
                          >
                            <Database className="h-3 w-3 mr-1" />
                            Open in FEV AI Space
                          </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage & Integration Information */}
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {/* AI Features & Tools Using This Collection */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Database className="h-5 w-5 text-purple-600" />
                    <span>AI Features & Integrations</span>
                  </CardTitle>
                  <CardDescription>
                    AI tools and features currently using this collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">AI Integrations</h4>
                    <div className="flex flex-wrap gap-2">
                      {(collection.ai_integrations || ['ML Pipeline', 'Analytics Engine', 'Recommendation System']).map((integration, index) => (
                        <Badge key={index} variant="outline" className="text-purple-700 border-purple-200">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Dashboards Using</h4>
                    <div className="space-y-2">
                      {(collection.dashboards_using || ['Executive Dashboard', 'Game Performance Dashboard']).map((dashboard, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{dashboard}</span>
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Users & Access Information */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Usage & Access</span>
                  </CardTitle>
                  <CardDescription>
                    Who&apos;s using this collection and access requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Top Consumers</h4>
                    <div className="space-y-2">
                      {(collection.usage_stats?.top_consumers || ['Analytics Team', 'Product Team', 'Data Science Team']).map((consumer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{consumer}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 100) + 50} queries/month
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Access Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Access Level:</span>
                        <Badge variant={collection.access_level === 'public' ? 'default' : 'secondary'}>
                          {collection.access_level || 'Public'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Approval Required:</span>
                        <Badge variant={collection.visibility === 'private' ? 'destructive' : 'default'}>
                          {collection.visibility === 'private' ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Data Classification:</span>
                        <Badge variant="outline">Internal Use</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connection & Access Details */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Key className="h-5 w-5 text-green-600" />
                    <span>Connection & Access</span>
                  </CardTitle>
                  <CardDescription>
                    API credentials and connection details for programmatic access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">API Endpoints</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">REST API</div>
                        <code className="text-xs font-mono">
                          {`https://api.datamarteatplace.com/v1/collections/${collection.id}`}
                        </code>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">GraphQL</div>
                        <code className="text-xs font-mono">https://api.datamarteatplace.com/graphql</code>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Authentication</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Auth Method:</span>
                        <Badge variant="outline">API Key + OAuth 2.0</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rate Limits:</span>
                        <span className="text-muted-foreground">1000 req/hour</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SDK Available:</span>
                        <div className="flex space-x-1">
                          <Badge variant="secondary" className="text-xs">Python</Badge>
                          <Badge variant="secondary" className="text-xs">Node.js</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Sample Request</h4>
                    <div className="p-3 bg-muted rounded-md">
                      <code className="text-xs font-mono text-muted-foreground">
                        {`curl -H "Authorization: Bearer YOUR_API_KEY" \\`}
                        <br />
                        {`  https://api.datamarteatplace.com/v1/collections/${collection.id}/data`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Data Sources Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Data Sources</h2>
              <p className="text-muted-foreground">
                {collection.data_source_count} {collection.data_source_count === 1 ? 'source' : 'sources'} in this collection
              </p>
            </div>

            {(collection.data_sources?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                    <Database className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No data sources</h3>
                  <p className="text-muted-foreground">
                    This collection doesn&apos;t contain any data sources yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {collection.data_sources!.map((dataSource) => (
                  <DataCard
                    key={dataSource.id}
                    id={dataSource.id}
                    title={dataSource.title}
                    description={dataSource.description}
                    businessDescription={dataSource.business_description || dataSource.description}
                    type={dataSource.type}
                    category={dataSource.category}
                    dataOwner={dataSource.data_owner}
                    steward={dataSource.steward}
                    techStack={dataSource.tech_stack || []}
                    gameTitle={dataSource.game_title}
                    genre={dataSource.genre}
                    trustScore={dataSource.trust_score}
                    platform={dataSource.platform || 'Snowflake'}
                    teamName={dataSource.team_name || 'Data Team'}
                    tags={dataSource.tags || []}
                    accessLevel="full"
                    onViewDetails={() => {
                      window.location.href = `/data-sources/${dataSource.id}`;
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Access Request Modal */}
      {collection && (
        <AccessRequestModal
          isOpen={showAccessModal}
          onClose={() => setShowAccessModal(false)}
          resourceType="collection"
          resourceName={collection.name}
          dataOwner={collection.owner_name}
          accessLevel={collection.access_level}
        />
      )}
    </div>
  );
}