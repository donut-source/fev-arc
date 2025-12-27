"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Database,
  SlidersHorizontal,
  Users,
  Calendar,
  Eye,
  Folder,
  Globe,
  Lock,
  CalendarDays,
  Plus,
  Share2,
  Download,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  visibility: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  data_source_count: number;
}

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("All");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Fetch data from API and localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get published collections from localStorage
        const publishedCollections = JSON.parse(localStorage.getItem('published-collections') || '[]');
        
        // Transform to match expected format and filter out empty collections
        const transformedCollections = publishedCollections
          .filter((collection: { items: unknown[]; name: string }) => 
            collection.items.length > 0 && collection.name !== 'Hello'
          )
          .map((collection: {
            id: string;
            name: string;
            description: string;
            owner: string;
            visibility: string;
            items: unknown[];
            createdAt: string;
          }) => ({
            id: collection.id,
            name: collection.name,
            description: collection.description,
            owner_name: collection.owner,
            visibility: collection.visibility,
            is_published: true,
            data_source_count: collection.items.length,
            created_at: collection.createdAt,
            updated_at: collection.createdAt,
          }));

          try {
            const response = await fetch('/api/collections');
            const result = await response.json();

            if (result.success) {
              // Combine API collections with published collections, filter out empty ones
              const allCollections = [...transformedCollections, ...result.data]
                .filter(col => col.data_source_count > 0);
              setCollections(allCollections);
            } else {
              // If API fails, just use published collections (filtered)
              setCollections(transformedCollections.filter(col => col.data_source_count > 0));
            }
          } catch (apiError) {
            // If API fails, just use published collections (filtered)
            setCollections(transformedCollections.filter(col => col.data_source_count > 0));
          }
      } catch (err) {
        setError('Failed to fetch collections');
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = !searchQuery || 
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.owner_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVisibility = selectedVisibility === "All" || 
      collection.visibility === selectedVisibility.toLowerCase();

    return matchesSearch && matchesVisibility;
  });

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Collections
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover curated data collections created by your team. Find organized datasets, APIs, and models grouped by business use case or project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search collections by name, description, or owner..."
              className="pl-10 pr-4 h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Visibility Filter */}
            <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Visibility</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto" onClick={() => alert("Advanced filters coming soon!")}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading collections...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading collections</p>
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

        {/* Collections Grid */}
        {!loading && !error && (
          <TooltipProvider>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCollections.map((collection) => (
                <Card key={collection.id} className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border border-border bg-card hover:border-primary/30 hover:bg-accent/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                        {collection.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{collection.owner_name}</span>
                      </div>
                    </div>
                    <Badge variant={collection.visibility === 'public' ? 'default' : 'secondary'} className="ml-2">
                      {collection.visibility}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 mb-4">
                    {collection.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Database className="h-3 w-3" />
                        <span>{collection.data_source_count} data sources</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(collection.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
                          onClick={() => window.location.href = `/collections/${collection.id}`}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/collections/${collection.id}`);
                            toast.success("Collection link copied to clipboard");
                          }}
                          className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md px-3"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>

                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast.success("Opening export options...");
                          }}
                          className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md px-3"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => alert("Add to workbench functionality coming soon!")}
                              className="hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 hover:shadow-md px-3"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add this collection to your workbench</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      {/* Stack of three vibrant buttons */}
                      <div className="space-y-1">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </TooltipProvider>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCollections.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                <Database className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No collections found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedVisibility("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
