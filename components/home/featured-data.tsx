"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { ArrowRight } from "lucide-react";

interface DataSource {
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
  platform?: string;
  team_name?: string;
  tags: string[];
  tech_stack: string[];
}

export function FeaturedData() {
  const [featuredData, setFeaturedData] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const response = await fetch('/api/data-sources');
        const result = await response.json();
        
        if (result.success) {
          // Get the top 4 highest trust score items for featured section
          const topItems = result.data
            .sort((a: DataSource, b: DataSource) => b.trust_score - a.trust_score)
            .slice(0, 4);
          setFeaturedData(topItems);
        }
      } catch (error) {
        console.error('Error fetching featured data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Data Products
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Hand-picked data products that are trending and highly rated by your colleagues
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Featured Data Products
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Hand-picked data products that are trending and highly rated by your colleagues
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredData.map((item) => (
          <DataCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            businessDescription={item.business_description || item.description}
            type={item.type}
            category={item.category}
            dataOwner={item.data_owner}
            steward={item.steward}
            techStack={item.tech_stack || []}
            gameTitle={item.game_title}
            genre={item.genre}
            trustScore={item.trust_score}
            platform={item.platform || 'Snowflake'}
            teamName={item.team_name || 'Data Team'}
            tags={item.tags || []}
            accessLevel="full"
            onViewDetails={undefined}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" variant="outline" asChild>
          <Link href="/marketplace">
            Browse the ARC Catalog
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
