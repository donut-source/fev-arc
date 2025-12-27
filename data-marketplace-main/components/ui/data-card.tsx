"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database, Brain, Zap, Plus, Check, Eye, Lock, Unlock } from "lucide-react";
import { 
  IconBrandSnowflake, 
  IconBrandGoogle, 
  IconDatabase, 
  IconChartBar, 
  IconSearch, 
  IconClick, 
  IconBrandAws,
  IconCloud
} from "@tabler/icons-react";
import { useWorkbench } from "@/lib/workbench-context";

interface DataCardProps {
  id: string;
  title: string;
  description: string;
  businessDescription: string;
  type: string;
  category: string;
  dataOwner: string;
  steward: string;
  techStack: string[];
  gameTitle: string;
  genre: string;
  trustScore: number;
  platform: string;
  tags: string[];
  teamName: string;
  accessLevel?: 'none' | 'read-only' | 'full';
  onViewDetails?: () => void;
}

function getTypeIcon(type: string) {
  switch (type) {
    case "dataset":
      return Database;
    case "api":
      return Zap;
    case "model":
      return Brain;
    default:
      return Database;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "dataset":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "api":
      return "text-green-600 bg-green-50 border-green-200";
    case "model":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

function getPlatformIcon(platform: string) {
  switch (platform?.toLowerCase()) {
    case "snowflake":
      return IconBrandSnowflake;
    case "bigquery":
      return IconBrandGoogle;
    case "databricks":
      return IconDatabase;
    case "redshift":
      return IconBrandAws;
    case "tableau":
      return IconChartBar;
    case "looker":
      return IconChartBar;
    case "elasticsearch":
      return IconSearch;
    case "clickhouse":
      return IconClick;
    default:
      return IconCloud;
  }
}

function getPlatformColor(platform: string) {
  switch (platform?.toLowerCase()) {
    case "snowflake":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "bigquery":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "databricks":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "redshift":
      return "text-red-600 bg-red-50 border-red-200";
    case "tableau":
      return "text-indigo-600 bg-indigo-50 border-indigo-200";
    case "looker":
      return "text-green-600 bg-green-50 border-green-200";
    case "elasticsearch":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "clickhouse":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function DataCard({
  id,
  title,
  description,
  businessDescription,
  type,
  category,
  dataOwner,
  steward,
  techStack,
  gameTitle,
  genre,
  trustScore,
  platform,
  tags,
  teamName,
  accessLevel = 'none',
  onViewDetails,
}: DataCardProps) {
  const { addItem, removeItem, isInWorkbench } = useWorkbench();
  const IconComponent = getTypeIcon(type);
  const PlatformIcon = getPlatformIcon(platform);
  const inWorkbench = isInWorkbench(id);

  const handleWorkbenchToggle = () => {
    if (inWorkbench) {
      removeItem(id);
    } else {
      addItem({
        id,
        title,
        description,
        businessDescription,
        type,
        category,
        dataOwner,
        steward,
        techStack,
        gameTitle,
        genre,
        trustScore,
        platform,
        teamName,
        tags,
      });
    }
  };


  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 border-0 bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="relative p-6 flex flex-col h-full min-h-[380px]">
          {/* Header with Title and Platform Icon */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 flex-1 pr-3">
              {title}
            </h3>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getPlatformColor(platform)} shrink-0`}>
              <PlatformIcon className="h-4 w-4" />
            </div>
          </div>

          {/* Domain and Genre Labels */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium text-muted-foreground">Domain:</span>
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-200"
            >
              {gameTitle}
            </Badge>
            <Badge 
              variant="outline" 
              className="text-xs font-medium px-3 py-1.5 rounded-full border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200"
            >
              {genre}
            </Badge>
          </div>

          {/* Business Description */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-muted/20 to-background/50 border border-muted/20">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {businessDescription}
            </p>
          </div>

          {/* Dataset Uniqueness Tags */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag, index) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-200 text-black dark:text-black ${
                    index === 0 ? 'border-blue-400 dark:border-blue-600' :
                    index === 1 ? 'border-emerald-400 dark:border-emerald-600' :
                    index === 2 ? 'border-amber-400 dark:border-amber-600' :
                    'border-purple-400 dark:border-purple-600'
                  }`}
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium px-2.5 py-1 rounded-lg border-muted-foreground/40 text-muted-foreground"
                >
                  +{tags.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Published by Team */}
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/30">
            <p className="text-sm text-muted-foreground">
              Published by
            </p>
            <p className="font-semibold text-foreground mt-0.5">{teamName}</p>
          </div>

          {/* Access Status */}
          <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-xl border border-muted/30">
            <div className="flex items-center gap-2">
              {accessLevel === 'none' ? (
                <Lock className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : accessLevel === 'read-only' ? (
                <Unlock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <Unlock className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              )}
              <span className="text-sm font-medium text-muted-foreground">Access:</span>
              
              {/* Custom Access Badges */}
              {accessLevel === 'full' && (
                <div className="text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-400 text-black dark:border-emerald-600 dark:text-black bg-transparent">
                  Full Access
                </div>
              )}
              {accessLevel === 'read-only' && (
                <div className="text-xs font-medium px-2.5 py-1 rounded-lg border border-orange-500 text-black dark:border-orange-600 dark:text-black bg-transparent">
                  Read Only
                </div>
              )}
              {accessLevel === 'none' && (
                <div className="text-xs font-medium px-2.5 py-1 rounded-lg border border-red-300 text-black dark:border-red-700 dark:text-black bg-transparent">
                  No Access
                </div>
              )}
            </div>
            
            {/* Request Access Buttons */}
            {accessLevel === 'none' && (
              <div
                className="text-xs px-2 py-1 h-7 rounded-md border border-red-300 text-black hover:border-red-400 hover:text-red-800 dark:border-red-700 dark:text-black dark:hover:border-red-600 dark:hover:text-red-300 transition-all duration-200 bg-transparent cursor-pointer flex items-center"
                onClick={() => {
                  window.location.href = `/data-sources/${id}`;
                }}
              >
                Request Access
              </div>
            )}
            {accessLevel === 'read-only' && (
              <div
                className="text-xs px-2 py-1 h-7 rounded-md border border-orange-500 text-black hover:border-orange-600 hover:text-orange-900 dark:border-orange-600 dark:text-black dark:hover:border-orange-800 dark:hover:text-orange-200 transition-all duration-200 bg-transparent cursor-pointer flex items-center"
                onClick={() => {
                  window.location.href = `/data-sources/${id}`;
                }}
              >
                Elevate Access
              </div>
            )}
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1"></div>

          {/* Actions - Full Width Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-11 font-semibold rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 group/btn"
              onClick={() => {
                if (onViewDetails) {
                  onViewDetails();
                } else {
                  window.location.href = `/data-sources/${id}`;
                }
              }}
            >
              <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
              View Details
            </Button>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWorkbenchToggle}
                  disabled={accessLevel === 'none'}
                  className={`w-full h-11 font-semibold rounded-xl border-2 transition-all duration-200 hover:shadow-lg group/btn ${
                    accessLevel === 'none'
                      ? "opacity-50 cursor-not-allowed border-muted-foreground/20 text-muted-foreground"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  }`}
                >
                  {inWorkbench ? (
                    <>
                      <Check className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200 text-black dark:text-black" />
                      <span className="text-black dark:text-black">Added to Workbench</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                      Add to Workbench
                    </>
                  )}
                </Button>
              </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3 rounded-xl bg-popover/95 backdrop-blur-sm border shadow-xl">
              <p className="text-sm leading-relaxed text-black dark:text-black">
                {accessLevel === 'none' 
                  ? "Request access to add this dataset to your workbench"
                  : inWorkbench 
                    ? "Remove from workbench" 
                    : "Adding to workbench allows you to join different published datasets into a collection and glean insights across datasets"
                }
              </p>
            </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
