"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCard } from "@/components/ui/data-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkbench } from "@/lib/workbench-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Download,
  Share2,
  Trash2,
  Calendar,
  Database,
  Upload,
  Plus,
  X,
  Zap,
  Brain,
  Globe,
  Lock,
  Users,
  FolderOpen,
  Edit,
  Eye,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function WorkbenchPage() {
  const { items, clearWorkbench, removeItem, itemCount } = useWorkbench();
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionVisibility, setCollectionVisibility] = useState("public");
  const [collectionTags, setCollectionTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [userCollections, setUserCollections] = useState<Array<Record<string, unknown>>>([]);
  const [accessibleCollections, setAccessibleCollections] = useState<Array<Record<string, unknown>>>([]);
  const [activeTab, setActiveTab] = useState<'workbench' | 'collections'>('workbench');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Record<string, unknown> | null>(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editCollectionDescription, setEditCollectionDescription] = useState("");
  const [editCollectionVisibility, setEditCollectionVisibility] = useState("public");
  const [editCollectionTags, setEditCollectionTags] = useState<string[]>([]);

  // Load user's collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        // Get owned collections from localStorage
        const publishedCollections = JSON.parse(localStorage.getItem('published-collections') || '[]');
        setUserCollections(publishedCollections.filter((col: Record<string, unknown>) => col.name !== 'Hello' && Array.isArray(col.items) && col.items.length > 0));

        // Get accessible collections from API (simulate access)
        const response = await fetch('/api/collections');
        const result = await response.json();
        if (result.success) {
          // Simulate that user has access to some collections, filter out "Hello" and empty collections
          const accessible = result.data
            .filter((col: Record<string, unknown>) => col.name !== 'Hello' && col.name !== 'Revenue Optimization Toolkit')
            .slice(0, 2); // First 2 collections
          setAccessibleCollections(accessible);
        }
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };

    loadCollections();
  }, []);

  const handleExport = () => {
    const exportData = {
      name: collectionName || "My Data Collection",
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        gameTitle: item.gameTitle,
        dataOwner: item.dataOwner,
        addedAt: item.addedAt,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workbench-collection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Collection exported!", {
      description: "Your data collection has been downloaded as a JSON file."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", {
      description: "Workbench link has been copied to clipboard."
    });
  };

  const handleClearAll = () => {
    clearWorkbench();
    toast.success("Workbench cleared!", {
      description: "All items have been removed from your workbench."
    });
  };

  const handleRemoveItem = (id: string, title: string) => {
    removeItem(id);
    toast.success("Item removed", {
      description: `${title} has been removed from your workbench.`
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !collectionTags.includes(newTag.trim())) {
      setCollectionTags([...collectionTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCollectionTags(collectionTags.filter(tag => tag !== tagToRemove));
  };

  const handleEditCollection = (collection: Record<string, unknown>) => {
    setEditingCollection(collection);
    setEditCollectionName(collection.name);
    setEditCollectionDescription(collection.description);
    setEditCollectionVisibility(collection.visibility);
    setEditCollectionTags(collection.tags || []);
    setEditDialogOpen(true);
  };

  const handleSaveEditedCollection = () => {
    if (!editCollectionName.trim()) {
      toast.error("Collection name required", {
        description: "Please provide a name for your collection."
      });
      return;
    }

    if (!editCollectionDescription.trim()) {
      toast.error("Description required", {
        description: "Please provide a description for your collection."
      });
      return;
    }

    // Update the collection in localStorage
    const existingCollections = JSON.parse(localStorage.getItem('published-collections') || '[]');
    const updatedCollections = existingCollections.map((col: Record<string, unknown>) => {
      if (col.id === editingCollection.id) {
        return {
          ...col,
          name: editCollectionName,
          description: editCollectionDescription,
          visibility: editCollectionVisibility,
          tags: editCollectionTags,
          updatedAt: new Date().toISOString(),
        };
      }
      return col;
    });

    localStorage.setItem('published-collections', JSON.stringify(updatedCollections));

    // Update local state
    setUserCollections(updatedCollections.filter((col: Record<string, unknown>) => col.name !== 'Hello' && Array.isArray(col.items) && col.items.length > 0));

    // Reset form
    setEditDialogOpen(false);
    setEditingCollection(null);
    setEditCollectionName("");
    setEditCollectionDescription("");
    setEditCollectionVisibility("public");
    setEditCollectionTags([]);

    toast.success("Collection updated!", {
      description: `${editCollectionName} has been updated successfully.`
    });
  };

  const handleAddEditTag = () => {
    if (newTag.trim() && !editCollectionTags.includes(newTag.trim())) {
      setEditCollectionTags([...editCollectionTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditCollectionTags(editCollectionTags.filter(tag => tag !== tagToRemove));
  };

  const handlePublishCollection = () => {
    if (!collectionName.trim()) {
      toast.error("Collection name required", {
        description: "Please provide a name for your collection."
      });
      return;
    }

    if (!collectionDescription.trim()) {
      toast.error("Description required", {
        description: "Please provide a description for your collection."
      });
      return;
    }

    // Simulate publishing to collections
    const collectionData = {
      id: `collection-${Date.now()}`,
      name: collectionName,
      description: collectionDescription,
      visibility: collectionVisibility,
      tags: collectionTags,
      items: items,
      createdAt: new Date().toISOString(),
      owner: "John Doe", // Mock user
    };

    // Store in localStorage for now (in real app, this would be an API call)
    const existingCollections = JSON.parse(localStorage.getItem('published-collections') || '[]');
    existingCollections.push(collectionData);
    localStorage.setItem('published-collections', JSON.stringify(existingCollections));

    setPublishDialogOpen(false);
    setCollectionName("");
    setCollectionDescription("");
    setCollectionVisibility("public");
    setCollectionTags([]);

    toast.success("Collection published!", {
      description: `${collectionName} has been published to the collections page.`,
      action: {
        label: "View Collections",
        onClick: () => window.location.href = "/collections"
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dataset": return Database;
      case "api": return Zap;
      case "model": return Brain;
      case "warehouse": return Database;
      default: return Database;
    }
  };

  const getTypeStats = () => {
    const stats = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const getGameStats = () => {
    const stats = items.reduce((acc, item) => {
      acc[item.gameTitle] = (acc[item.gameTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(stats).slice(0, 5); // Top 5 games
  };

  const hasWorkbenchItems = items.length > 0;
  const hasCollections = userCollections.length > 0 || accessibleCollections.length > 0;

  const typeStats = getTypeStats();
  const gameStats = getGameStats();

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                My Workbench
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your data collections and workbench items
              </p>
            </div>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
                      <Upload className="mr-2 h-4 w-4" />
                      Publish Collection
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Publish Collection</DialogTitle>
                    <DialogDescription>
                      Make your curated data collection available to others in the marketplace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Collection Name</Label>
                      <Input
                        id="name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        placeholder="e.g., Cross-Border Diligence Pack"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={collectionDescription}
                        onChange={(e) => setCollectionDescription(e.target.value)}
                        placeholder="Describe what this collection contains and its intended use..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={collectionVisibility} onValueChange={setCollectionVisibility}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4" />
                              <span>Public - Anyone can view</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="team">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Team - Team members only</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center space-x-2">
                              <Lock className="h-4 w-4" />
                              <span>Private - Only you</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {collectionTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" onClick={handleAddTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        This collection contains {itemCount} data {itemCount === 1 ? 'product' : 'products'} 
                        across {Object.keys(getGameStats().reduce((acc, [game]) => ({ ...acc, [game]: true }), {})).length} coverage areas.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePublishCollection} className="bg-green-600 hover:bg-green-700">
                      Publish Collection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Collection Dialog */}
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Collection</DialogTitle>
                    <DialogDescription>
                      Update your collection details and settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Collection Name</Label>
                      <Input
                        id="edit-name"
                        value={editCollectionName}
                        onChange={(e) => setEditCollectionName(e.target.value)}
                        placeholder="e.g., Cross-Border Diligence Pack"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editCollectionDescription}
                        onChange={(e) => setEditCollectionDescription(e.target.value)}
                        placeholder="Describe what this collection contains and its intended use..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-visibility">Visibility</Label>
                      <Select value={editCollectionVisibility} onValueChange={setEditCollectionVisibility}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4" />
                              <span>Public - Anyone can view</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="team">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Team - Team members only</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center space-x-2">
                              <Lock className="h-4 w-4" />
                              <span>Private - Only you</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editCollectionTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => handleRemoveEditTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddEditTag()}
                        />
                        <Button type="button" onClick={handleAddEditTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingCollection && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          This collection contains {editingCollection.items?.length || 0} data {(editingCollection.items?.length || 0) === 1 ? 'product' : 'products'}.
                        </p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEditedCollection} className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleClearAll}
                className="hover:bg-destructive/90 transition-all duration-200 hover:shadow-md"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'workbench' | 'collections')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="workbench" 
              className="border border-border data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-blue-700 hover:bg-accent hover:text-accent-foreground"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Current Workbench ({itemCount})
            </TabsTrigger>
            <TabsTrigger 
              value="collections"
              className="border border-border data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-blue-700 hover:bg-accent hover:text-accent-foreground"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              My Collections ({userCollections.length + accessibleCollections.length})
            </TabsTrigger>
          </TabsList>

          {/* Workbench Tab */}
          <TabsContent value="workbench" className="space-y-8">
            {!hasWorkbenchItems ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center max-w-md">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                    <Briefcase className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your workbench is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building a collection by adding datasets, APIs, and models from the ARC catalog.
                  </p>
                  <Button asChild>
                    <a href="/marketplace">Browse ARC Catalog</a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-4">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Collection Stats */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Collection Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Items</span>
                  <Badge variant="secondary">{itemCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {items.length > 0 ? new Date(Math.min(...items.map(i => i.addedAt.getTime()))).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm">
                    {items.length > 0 ? new Date(Math.max(...items.map(i => i.addedAt.getTime()))).toLocaleDateString() : '-'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Type Breakdown */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">By Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(typeStats).map(([type, count]) => {
                  const TypeIcon = getTypeIcon(type);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Game Breakdown */}
            {gameStats.length > 0 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">By Game</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gameStats.map(([game, count]) => (
                    <div key={game} className="flex items-center justify-between">
                      <span className="text-sm truncate">{game}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Data Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items
                .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
                .map((item) => (
                  <div key={item.id} className="relative group">
                    <DataCard
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      businessDescription={item.businessDescription || item.description}
                      type={item.type}
                      category={item.category}
                      dataOwner={item.dataOwner}
                      steward={item.steward}
                      techStack={item.techStack}
                      gameTitle={item.gameTitle}
                      genre={item.genre}
                      trustScore={item.trustScore}
                      platform={item.platform || 'Snowflake'}
                      teamName={item.teamName || 'Data Team'}
                      tags={item.tags}
                      accessLevel="full"
                      onViewDetails={() => {
                        window.location.href = `/data-sources/${item.id}`;
                      }}
                    />
                    
                    {/* Added date badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        {item.addedAt.toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      onClick={() => handleRemoveItem(item.id, item.title)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-8">
            {!hasCollections ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center max-w-md">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                    <FolderOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create collections from your workbench or get access to shared collections.
                  </p>
                  <div className="space-y-2">
                    <Button asChild>
                      <Link href="/collections">Browse All Collections</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Owned Collections */}
                {userCollections.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold">My Collections</h2>
                        <p className="text-sm text-muted-foreground">Collections you own and can edit</p>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {userCollections.map((collection) => (
                        <Card key={collection.id} className="transition-all hover:shadow-lg border-2 hover:border-primary/20">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg line-clamp-1">{collection.name}</CardTitle>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {collection.visibility}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {collection.items?.length || 0} items
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  Owner
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {collection.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                              <span>by {collection.owner}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => window.location.href = `/collections/${collection.id}`}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => handleEditCollection(collection)}
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessible Collections */}
                {accessibleCollections.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold">Shared with Me</h2>
                        <p className="text-sm text-muted-foreground">Collections you have access to</p>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {accessibleCollections.map((collection) => (
                        <Card key={collection.id} className="transition-all hover:shadow-lg border-2 hover:border-primary/20">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg line-clamp-1">{collection.name}</CardTitle>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {collection.access_level || 'read-only'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {collection.data_sources?.length || 0} sources
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Access
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {collection.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>Updated {new Date(collection.updated_at).toLocaleDateString()}</span>
                              <span>by {collection.owner_name}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => window.location.href = `/collections/${collection.id}`}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View Collection
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}