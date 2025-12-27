"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function DataHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/marketplace');
    }
  };

  const handleTrendingSearch = (query: string) => {
    router.push(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="text-center">
        {/* Hero Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Sparkles className="mr-2 h-4 w-4" />
          What will you discover today?
        </Badge>

        {/* Hero Search */}
        <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FX, valuation, company intel, real estate signals..."
              className="h-14 pl-12 pr-32 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Trending Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Trending:</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => handleTrendingSearch("Player Retention")}
          >
            <TrendingUp className="mr-1 h-3 w-3" />
            FX Exposure
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => handleTrendingSearch("Valuation Comps")}
          >
            Valuation Comps
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => handleTrendingSearch("Company Intelligence")}
          >
            Company Intelligence
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => handleTrendingSearch("Real Estate Signals")}
          >
            Real Estate Signals
          </Button>
        </div>
      </div>
    </section>
  );
}
