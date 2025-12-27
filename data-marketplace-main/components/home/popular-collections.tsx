"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Users,
  Star,
  Bookmark,
  Play,
} from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  visibility: string;
  is_published: boolean;
  data_source_count: number;
  created_at: string;
  updated_at: string;
}

export function PopularCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const result = await response.json();
        
        if (result.success) {
          // Take only the first 3 collections for the homepage
          setCollections(result.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular Collections
            </h2>
            <p className="text-lg text-muted-foreground">
              Curated data collections by experts in your organization
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/collections">
              View All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular Collections
            </h2>
            <p className="text-lg text-muted-foreground">
              Curated data collections by experts in your organization
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/collections">
              View All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No collections available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Popular Collections
          </h2>
          <p className="text-lg text-muted-foreground">
            Curated data collections by experts in your organization
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/collections">
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {collections.map((collection, index) => {
          // Generate initials from owner name
          const initials = collection.owner_name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

          // Generate some mock data for display
          const mockRating = (4.5 + (index * 0.1)).toFixed(1);
          const mockFollowers = `${(1.2 + index * 0.3).toFixed(1)}K`;
          
          // Generate tags based on collection name
          const generateTags = (name: string) => {
            const tags = [];
            if (name.toLowerCase().includes('getting') || name.toLowerCase().includes('starter')) {
              tags.push('Beginner Friendly', 'Popular');
            } else if (name.toLowerCase().includes('advanced') || name.toLowerCase().includes('expert')) {
              tags.push('Advanced', 'Expert');
            } else if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('monetization')) {
              tags.push('Revenue', 'High Impact');
            } else if (name.toLowerCase().includes('retention') || name.toLowerCase().includes('engagement')) {
              tags.push('Retention', 'Behavioral');
            } else {
              tags.push('Curated', 'Trending');
            }
            return tags;
          };

          return (
            <Card key={collection.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {collection.data_source_count} items
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="line-clamp-2 text-xl leading-tight">
                  {collection.name}
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{collection.owner_name}</div>
                    <div className="text-xs text-muted-foreground">Data Curator</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {generateTags(collection.name).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{mockRating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{mockFollowers}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full" asChild>
                  <Link href={`/collections/${collection.id}`}>
                    <Play className="mr-2 h-4 w-4" />
                    Explore Collection
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}