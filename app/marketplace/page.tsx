"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataCard } from "@/components/ui/data-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Database,
  SlidersHorizontal,
} from "lucide-react";

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
  platform: string;
  team_name: string;
  tags: string[];
  tech_stack: string[];
}

const productTypes = [
  "All Types",
  "dataset",
  "api",
  "model",
  "warehouse",
];

const statusOptions = [
  "All Status",
  "ready",
  "issues",
  "pending",
  "deprecated",
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAccess, setUserAccess] = useState<Record<string, { access_level: string }>>({});

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlType = searchParams.get('type');
    const urlCategory = searchParams.get('category');
    const urlStatus = searchParams.get('status');

    if (urlSearch) setSearchQuery(urlSearch);
    if (urlType) setSelectedType(urlType);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlStatus) setSelectedStatus(urlStatus);
  }, [searchParams]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (selectedType !== "All Types") params.append("type", selectedType);
        if (selectedCategory !== "All Categories") params.append("category", selectedCategory);
        if (selectedStatus !== "All Status") params.append("status", selectedStatus);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const response = await fetch(`/api/data-sources?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setDataSources(result.data);

          // Fetch user access information
          if (result.data.length > 0) {
            const dataSourceIds = result.data.map((ds: DataSource) => ds.id).join(',');
            const accessResponse = await fetch(`/api/user-access?data_source_ids=${dataSourceIds}`);
            const accessResult = await accessResponse.json();
            if (accessResult.success) {
              setUserAccess(accessResult.data);
            }
          }
          
          // Extract unique categories
          const uniqueCategories = ["All Categories", ...new Set(result.data.map((ds: DataSource) => ds.category))] as string[];
          setCategories(uniqueCategories);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch data sources');
        console.error('Error fetching data sources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType, selectedCategory, selectedStatus, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect dependency on searchQuery
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Alternatives AI Ready Catalog (ARC)
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover governed alternative-data products for private equity workflows—FX rates, company intelligence, valuation data, and real estate signals.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FX, company intel, valuation comps, real estate signals..."
              className="pl-10 pr-4 h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Filters */}
          <TooltipProvider>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] hover:bg-accent hover:text-accent-foreground transition-colors">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className=""
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[180px] hover:bg-accent hover:text-accent-foreground transition-colors">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem 
                      key={type} 
                      value={type}
                      className=""
                    >
                      {type === "dataset" ? "Dataset" : type === "api" ? "API" : type === "model" ? "ML Model" : type === "warehouse" ? "Warehouse" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px] hover:bg-accent hover:text-accent-foreground transition-colors">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className=""
                    >
                      {status === "ready" ? "Ready" : status === "issues" ? "Has Issues" : status === "pending" ? "Pending" : status === "deprecated" ? "Deprecated" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md" 
                onClick={() => alert("Advanced filters coming soon!")}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </TooltipProvider>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading data sources...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading data sources</p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
            {dataSources.map((product) => (
              <DataCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                businessDescription={product.business_description}
                type={product.type}
                category={product.category}
                dataOwner={product.data_owner}
                steward={product.steward}
                techStack={product.tech_stack || []}
                gameTitle={product.game_title}
                genre={product.genre}
                trustScore={product.trust_score}
                platform={product.platform}
                teamName={product.team_name}
                tags={product.tags || []}
                accessLevel={userAccess[product.id]?.access_level as 'none' | 'read-only' | 'full' || 'none'}
                onViewDetails={() => {
                  window.location.href = `/data-sources/${product.id}`;
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && dataSources.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                <Database className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No data sources found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedType("All Types");
                  setSelectedStatus("All Status");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && dataSources.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Showing {dataSources.length} data {dataSources.length === 1 ? 'source' : 'sources'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}