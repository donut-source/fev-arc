"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Database,
  ExternalLink,
  Plus,
  Share2,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  Building,
  Shield,
  User,
  Users,
  Code,
  Activity,
  BarChart3,
  Zap,
  Brain,
  FileText,
  Link2,
  Layers,
} from "lucide-react";
import { useWorkbench } from "@/lib/workbench-context";
import { toast } from "sonner";
import { AccessRequestModal } from "@/components/modals/access-request-modal";
import { SubscriptionModal } from "@/components/modals/subscription-modal";

interface DataSource {
  id: string;
  title: string;
  description: string;
  business_description: string;
  type: string;
  category: string;
  game_title: string;
  genre: string;
  data_owner: string;
  steward: string;
  trust_score: number;
  status: string;
  access_level: string;
  sla_percentage: string;
  platform: string;
  team_name: string;
  team_description: string;
  department: string;
  tags: string[];
  tech_stack: string[];
  created_at: string;
  updated_at: string;
  publisher_name: string;
  publisher_description: string;
  publisher_type: string;
  join_key?: string;
  compatible_datasets?: string[];
  data_quality_tips?: string[];
}

function getTypeIcon(type: string) {
  switch (type) {
    case "dataset":
      return Database;
    case "api":
      return Zap;
    case "model":
      return Brain;
    case "warehouse":
      return Database;
    default:
      return Database;
  }
}

export default function DataSourceDetailPage() {
  const params = useParams();
  const { addItem, isInWorkbench } = useWorkbench();
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [compatibleDatasets, setCompatibleDatasets] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contextual");
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/data-sources/${params.id}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch data source');
        }
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch data source');
        }
        
        setDataSource(result.data);
        
        // Fetch compatible datasets if they exist
        if (result.data.compatible_datasets && result.data.compatible_datasets.length > 0) {
          const compatiblePromises = result.data.compatible_datasets.map((id: string) =>
            fetch(`/api/data-sources/${id}`).then(r => r.json())
          );
          const compatibleResults = await Promise.all(compatiblePromises);
          const compatibleData = compatibleResults
            .filter(r => r.success)
            .map(r => r.data);
          setCompatibleDatasets(compatibleData);
        }
      } catch (err) {
        setError('Failed to fetch data source details');
        console.error('Error fetching data source:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddToWorkbench = () => {
    if (dataSource) {
      if (isInWorkbench(dataSource.id)) {
        toast.info("Already in workbench", {
          description: "This data source is already in your workbench."
        });
        return;
      }

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
      
      toast.success("Added to workbench!", {
        description: `${dataSource.title} has been added to your workbench.`,
        action: {
          label: "View Workbench",
          onClick: () => window.location.href = "/workbench"
        }
      });
    }
  };

  const handleViewInAlation = () => {
    toast.info("Opening in Power BI", {
      description: "Launching Power BI (demo link)..."
    });
    // Demo link
    window.open("https://powerbi.microsoft.com/", "_blank");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", {
      description: "Data source link has been copied to clipboard."
    });
  };

  const handleRequestAccess = () => {
    toast.info("Access request submitted", {
      description: "Your access request has been sent to the data owner."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'issues':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'deprecated':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data source...</p>
        </div>
      </div>
    );
  }

  if (error || !dataSource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading data source</p>
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

  const TypeIcon = getTypeIcon(dataSource.type);
  const inWorkbench = isInWorkbench(dataSource.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to ARC Catalog
          </Button>
          
          {/* Main Header Card */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 ${
                      dataSource.type === 'dataset' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                      dataSource.type === 'api' ? 'text-green-600 bg-green-50 border-green-200' :
                      dataSource.type === 'model' ? 'text-purple-600 bg-purple-50 border-purple-200' :
                      'text-gray-600 bg-gray-50 border-gray-200'
                    }`}>
                      <TypeIcon className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl font-bold tracking-tight mb-2">{dataSource.title}</h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default" className="text-xs font-medium">
                          {dataSource.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {dataSource.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(dataSource.status)}
                          <span className="text-sm text-muted-foreground capitalize font-medium">
                            {dataSource.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {dataSource.business_description || dataSource.description}
                  </p>

                  {/* Publisher Information */}
                  <div className="mb-6 p-4 bg-white rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-black">Published by</span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5 text-black">
                            {dataSource.publisher_type}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-black mb-1">
                          {dataSource.publisher_name}
                        </h4>
                        <p className="text-sm text-black leading-relaxed">
                          {dataSource.publisher_description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Bar */}
                  <div className="bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      
                      {/* Left Side - View Toggle Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="text-lg font-bold text-black mb-3">View Mode</div>
                        <div className="flex flex-col gap-2">
                        <Button
  variant={activeTab === "contextual" ? "default" : "outline"}
  onClick={() => setActiveTab("contextual")}
  className={`w-48 h-12 justify-start rounded-xl font-semibold transition-all duration-200 ${
    activeTab === "contextual" 
      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg" 
      : "border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 text-black dark:text-black hover:text-white"
  }`}
>
  <Building className="h-5 w-5 mr-3" />
  Business Context
</Button>

<Button
  variant={activeTab === "technical" ? "default" : "outline"}
  onClick={() => setActiveTab("technical")}
  className={`w-48 h-12 justify-start rounded-xl font-semibold transition-all duration-200 ${
    activeTab === "technical" 
      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg" 
      : "border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 text-black dark:text-black hover:text-white"
  }`}
>
  <Code className="h-5 w-5 mr-3" />
  Technical Details
</Button>
                        </div>
                      </div>

                      {/* Right Side - Data Health Squares */}
                      <div className="flex-1 lg:ml-8">
                        <div className="text-lg font-bold text-black mb-4">Data Health</div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          
                          {/* Trust Score */}
                          <div className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${getTrustScoreColor(dataSource.trust_score)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Shield className="h-5 w-5" />
                              <div className="text-xs font-medium opacity-80">TRUST</div>
                            </div>
                            <div className="text-2xl font-bold">{dataSource.trust_score}%</div>
                            <div className="text-xs opacity-70 mt-1">Reliability Score</div>
                          </div>

                          {/* SLA Uptime */}
                          <div className="relative p-4 rounded-xl border-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 transition-all duration-200 hover:shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Activity className="h-5 w-5" />
                              <div className="text-xs font-medium opacity-80">UPTIME</div>
                            </div>
                            <div className="text-2xl font-bold">{dataSource.sla_percentage}%</div>
                            <div className="text-xs opacity-70 mt-1">SLA Performance</div>
                          </div>

                          {/* Data Freshness */}
                          <div className="relative p-4 rounded-xl border-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 transition-all duration-200 hover:shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Clock className="h-5 w-5" />
                              <div className="text-xs font-medium opacity-80">FRESH</div>
                            </div>
                            <div className="text-2xl font-bold">99.1%</div>
                            <div className="text-xs opacity-70 mt-1">Data Freshness</div>
                          </div>

                          {/* Access Level */}
                          <div className="relative p-4 rounded-xl border-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 transition-all duration-200 hover:shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <User className="h-5 w-5" />
                              <div className="text-xs font-medium opacity-80">ACCESS</div>
                            </div>
                            <div className="text-lg font-bold capitalize">{dataSource.access_level}</div>
                            <div className="text-xs opacity-70 mt-1">Permission Level</div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Card */}
                <Card className="lg:w-80 border-2 border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span>Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline"
                      onClick={handleViewInAlation} 
                      className="w-full h-11 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md hover:scale-[1.02] rounded-xl font-semibold"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Power BI
                    </Button>
                    
                    <Button 
                      variant={inWorkbench ? "secondary" : "outline"} 
                      onClick={handleAddToWorkbench} 
                      className={`w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] rounded-xl font-semibold ${
                        inWorkbench 
                          ? "hover:bg-secondary/90" 
                          : "hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                      disabled={inWorkbench}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {inWorkbench ? "In Workbench" : "Add to Workbench"}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleShare} 
                        className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md rounded-lg"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAccessModal(true)} 
                        className="w-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md rounded-lg"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Access
                      </Button>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Quick Integrations</div>
                      <div className="space-y-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            toast.success("Shared with deal team");
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 hover:shadow-md rounded-lg"
                        >
                          <Users className="h-3 w-3 mr-2" />
                          Share with Deal Team
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => {
                            toast.success("Opening in Looker...");
                          }}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-md rounded-lg"
                        >
                          <BarChart3 className="h-3 w-3 mr-2" />
                          Open in Looker
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => {
                            window.open('/fev-ai-space', '_blank');
                          }}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 hover:shadow-md rounded-lg"
                        >
                          <Database className="h-3 w-3 mr-2" />
                          Open in FEV AI Space
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => setShowSubscribeModal(true)}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 hover:shadow-md rounded-lg"
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Subscribe
                        </Button>
                      </div>
                    </div>
                    
                    {/* UC Endowment Board Report & Analytics Agent */}
                    {dataSource.id === 'burgiss-realestate-001' || dataSource.compatible_datasets?.length ? (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">UC Endowment Analysis</div>
                        <div className="space-y-2">
                          <Button 
                            size="sm"
                            onClick={() => {
                              toast.success("Creating UC Endowment Board Report PowerPoint...", {
                                description: "Combining data from all joinable datasets"
                              });
                              setTimeout(() => {
                                toast.success("PowerPoint report generated!", {
                                  description: "Download started: UC_Endowment_Board_Report_Dec2024.pptx"
                                });
                              }, 2000);
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 hover:shadow-lg rounded-lg font-semibold"
                          >
                            <FileText className="h-3 w-3 mr-2" />
                            Create Board Report PPT
                          </Button>
                          
                          <Button 
                            size="sm"
                            onClick={() => {
                              // Get all compatible datasets
                              const datasets = [
                                {
                                  id: dataSource.id,
                                  title: dataSource.title,
                                  type: dataSource.type,
                                  category: dataSource.category,
                                },
                                ...compatibleDatasets.map(ds => ({
                                  id: ds.id,
                                  title: ds.title,
                                  type: ds.type,
                                  category: ds.category,
                                }))
                              ];
                              
                              // Navigate to chat with datasets context
                              const datasetsParam = encodeURIComponent(JSON.stringify(datasets));
                              window.location.href = `/chat?datasets=${datasetsParam}&agent=true`;
                              
                              toast.success("Creating Analytics Agent...", {
                                description: `Analyzing ${datasets.length} combined datasets with AI`
                              });
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 hover:shadow-lg rounded-lg font-semibold"
                          >
                            <Brain className="h-3 w-3 mr-2" />
                            Create Analytics Agent
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Data Quality Tips */}
        {dataSource.data_quality_tips && dataSource.data_quality_tips.length > 0 && (
          <Card className="mb-6 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-900">Data Quality Improvement Tips</span>
              </CardTitle>
              <CardDescription className="text-yellow-800">
                This dataset has quality issues. Follow these steps to improve trust score and SLA performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {dataSource.data_quality_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-yellow-500 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-800 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Compatible Datasets - Combining UI */}
        {dataSource.join_key && compatibleDatasets.length > 0 && (
          <Card className="mb-6 border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Layers className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900">Joinable Datasets</span>
              </CardTitle>
              <CardDescription className="text-blue-800">
                This dataset can be combined with {compatibleDatasets.length} other datasets using a unified join key for cross-dataset analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Join Key Info */}
              <div className="p-4 bg-white rounded-xl border-2 border-blue-300">
                <div className="flex items-center gap-3 mb-2">
                  <Link2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Unified Join Key</span>
                </div>
                <code className="block p-3 bg-blue-100 rounded-lg text-sm font-mono text-blue-900 border border-blue-200">
                  {dataSource.join_key} = &apos;A&apos; (UC Endowment Fund)
                </code>
                <p className="text-xs text-blue-700 mt-2">
                  All datasets below share this join key for seamless multi-source analysis
                </p>
              </div>

              {/* Compatible Datasets Grid */}
              <div className="grid gap-3 md:grid-cols-2">
                {compatibleDatasets.map((ds) => (
                  <div 
                    key={ds.id}
                    className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      window.location.href = `/data-sources/${ds.id}`;
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
                        {ds.title}
                      </h4>
                      <div className="flex-shrink-0">
                        <Badge variant={ds.trust_score >= 90 ? "default" : "secondary"} className="text-xs">
                          {ds.trust_score}% Trust
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {ds.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Database className="h-3 w-3" />
                      <span>{ds.platform}</span>
                      <span className="mx-1">•</span>
                      <span>SLA: {ds.sla_percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Combine Actions */}
              <div className="pt-3 border-t border-blue-200 space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 hover:shadow-lg rounded-xl font-semibold h-12"
                  onClick={() => {
                    const datasetIds = [dataSource.id, ...compatibleDatasets.map(d => d.id)];
                    toast.success("Datasets added to Workbench for combining!", {
                      description: `${datasetIds.length} datasets ready to join on ${dataSource.join_key}`
                    });
                    // Add all to workbench
                    window.location.href = '/workbench';
                  }}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Add to Workbench for Combining
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-2 border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 transition-all duration-200 hover:shadow-md rounded-xl font-semibold h-12"
                  onClick={() => {
                    // Get all datasets including this one
                    const datasets = [
                      {
                        id: dataSource.id,
                        title: dataSource.title,
                        type: dataSource.type,
                        category: dataSource.category,
                      },
                      ...compatibleDatasets.map(ds => ({
                        id: ds.id,
                        title: ds.title,
                        type: ds.type,
                        category: ds.category,
                      }))
                    ];
                    
                    // Navigate to chat with datasets context
                    const datasetsParam = encodeURIComponent(JSON.stringify(datasets));
                    window.location.href = `/chat?datasets=${datasetsParam}&agent=true`;
                    
                    toast.success("Creating Analytics Agent...", {
                      description: `Ready to analyze ${datasets.length} combined datasets`
                    });
                  }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Create Analytics Agent from Combined Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content based on active tab */}
        <div className="w-full">

          {/* Contextual Metadata */}
          {activeTab === "contextual" && (
            <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Business Context */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Business Context</span>
                  </CardTitle>
                  <CardDescription>
                    Understanding the business purpose and value of this data source
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Coverage</h4>
                      <p className="font-medium">{dataSource.game_title}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Focus</h4>
                      <p className="font-medium">{dataSource.genre}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Business Process Supported</h4>
                    <p className="text-sm leading-relaxed">
                      This data product supports {dataSource.category.toLowerCase()} workflows for private equity teams,
                      enabling faster diligence, better monitoring, and more consistent decision-making.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Business Impact</h4>
                    <p className="text-sm leading-relaxed">
                      Used by deal teams and portfolio ops to reduce research cycles, improve valuation confidence,
                      and operationalize repeatable, governed analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Governance & Ownership */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Governance & Ownership</span>
                  </CardTitle>
                  <CardDescription>
                    Data stewardship, ownership, and compliance information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Data Owner</span>
                    </h4>
                    <p className="font-medium">{dataSource.data_owner}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Responsible for data quality, business definitions, and strategic decisions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Data Steward</span>
                    </h4>
                    <p className="font-medium">{dataSource.steward}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manages day-to-day operations, data access, and technical maintenance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Compliance Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">GDPR Compliant</Badge>
                      <Badge variant="outline" className="text-xs">SOC 2 Type II</Badge>
                      <Badge variant="outline" className="text-xs">ISO 27001</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage & Adoption */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Usage & Adoption</span>
                  </CardTitle>
                  <CardDescription>
                    How this data source is being used across the organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Active Users</h4>
                      <p className="text-2xl font-bold text-blue-600">47</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Monthly Queries</h4>
                      <p className="text-2xl font-bold text-green-600">12.3K</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Primary Use Cases</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Cross-border deal valuation and FX hedging analysis</li>
                      <li>• Portfolio company monitoring and performance tracking</li>
                      <li>• Due diligence and market intelligence for acquisitions</li>
                      <li>• Investment committee memos and board reporting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Tags & Classification */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span>Tags & Classification</span>
                  </CardTitle>
                  <CardDescription>
                    Metadata tags and classification for discovery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Data Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataSource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataSource.tech_stack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {/* Technical Metadata */}
          {activeTab === "technical" && (
            <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Schema & Structure */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Schema & Structure</span>
                  </CardTitle>
                  <CardDescription>
                    Data structure, schema definition, and relationships
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Schema Structure</h4>
                    <div className="bg-muted p-3 rounded-md text-sm font-mono space-y-1">
                      <div>entity_id: UUID (Primary Key)</div>
                      <div>as_of_date: DATE</div>
                      <div>signal_type: VARCHAR</div>
                      <div>value: NUMERIC</div>
                      <div>source: VARCHAR</div>
                      <div>confidence: NUMERIC</div>
                      <div>dimensions: JSONB</div>
                      <div>metadata: JSONB</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Table Relationships</h4>
                    <ul className="text-sm space-y-1">
                      <li>• entities.id → signals.entity_id</li>
                      <li>• sources.id → signals.source_id</li>
                      <li>• products.id → signals.product_id</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Performance & Quality */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Performance & Quality</span>
                  </CardTitle>
                  <CardDescription>
                    Data quality metrics and performance statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-xs text-muted-foreground">Completeness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">97.2%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">99.1%</div>
                      <div className="text-xs text-muted-foreground">Freshness</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Validation Rules</h4>
                    <ul className="text-sm space-y-1">
                      <li>• entity_id must be valid UUID format</li>
                      <li>• as_of_date cannot be in the future</li>
                      <li>• value must be within expected bounds for the signal type</li>
                      <li>• confidence must be between 0 and 1</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Lineage */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span>Data Lineage & Flow</span>
                  </CardTitle>
                  <CardDescription>
                    Data flow, transformations, and lineage tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Data Flow</h4>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      Source Feeds → Normalization → Quality Checks → Warehouse → BI / Python / FEV AI Space
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">CDC Patterns</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Change capture: Real-time via Kafka</li>
                      <li>• Update frequency: Every 15 minutes</li>
                      <li>• Replication lag: &lt; 30 seconds</li>
                      <li>• Last updated: {new Date(dataSource.updated_at).toLocaleString()}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Points */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Code className="h-5 w-5 text-indigo-600" />
                    <span>Integration Points</span>
                  </CardTitle>
                  <CardDescription>
                    API endpoints, connections, and integration details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">API Endpoints</h4>
                    <div className="space-y-2">
                      <div className="bg-muted p-2 rounded text-xs font-mono">
                        GET /api/v1/signals/{"{entity_id}"}
                      </div>
                      <div className="bg-muted p-2 rounded text-xs font-mono">
                        POST /api/v1/signals/query
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Connection Details</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Database: PostgreSQL 14.x</li>
                      <li>• Connection pool: 50 max connections</li>
                      <li>• SSL: Required (TLS 1.2+)</li>
                      <li>• Authentication: OAuth 2.0 + API Key</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}
        </div>

        {/* Access Request Modal */}
        {dataSource && (
          <AccessRequestModal
            isOpen={showAccessModal}
            onClose={() => setShowAccessModal(false)}
            resourceType="data-source"
            resourceName={dataSource.title}
            dataOwner={dataSource.data_owner}
            steward={dataSource.steward}
            accessLevel={dataSource.access_level}
          />
        )}

        {/* Subscription Modal */}
        {dataSource && (
          <SubscriptionModal
            isOpen={showSubscribeModal}
            onClose={() => setShowSubscribeModal(false)}
            dataSourceTitle={dataSource.title}
            dataSourceId={dataSource.id}
          />
        )}
      </div>
    </div>
  );
}