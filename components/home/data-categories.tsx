"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Brain,
  Zap,
  BarChart3,
  DollarSign,
  Shield,
  Globe,
  TrendingUp,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
  types: string[];
  avgTrustScore: number;
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('fx')) return BarChart3;
  if (name.includes('valuation')) return DollarSign;
  if (name.includes('company')) return Shield;
  if (name.includes('real estate')) return Globe;
  if (name.includes('macro') || name.includes('rates')) return TrendingUp;
  if (name.includes('api')) return Zap;
  if (name.includes('model') || name.includes('qa')) return Brain;
  return Database;
};

// Color mapping for categories
const getCategoryColor = (index: number) => {
  const colors = [
    "bg-blue-500/10 text-blue-600 border-blue-200",
    "bg-green-500/10 text-green-600 border-green-200",
    "bg-purple-500/10 text-purple-600 border-purple-200",
    "bg-orange-500/10 text-orange-600 border-orange-200",
    "bg-red-500/10 text-red-600 border-red-200",
    "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    "bg-pink-500/10 text-pink-600 border-pink-200",
    "bg-gray-500/10 text-gray-600 border-gray-200",
  ];
  return colors[index % colors.length];
};

// Generate description based on category name
const getCategoryDescription = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('fx')) return "Spot, forwards, and hedging analytics for cross-border deals";
  if (name.includes('valuation')) return "Private comps, multiples, and valuation QA for IC-ready ranges";
  if (name.includes('company')) return "Entity profiles, ownership, and risk flags for diligence";
  if (name.includes('real estate')) return "Neighborhood activity and demand proxies (synthetic demo signals)";
  if (name.includes('macro') || name.includes('rates')) return "Macro indicators and rates for scenario analysis";
  if (name.includes('deal')) return "Deal ops workflow signals and pipeline analytics";
  return "Alternative data products for private equity";
};

export function DataCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Find exactly what you need organized by business function and use case
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Browse by Category
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Find exactly what you need organized by business function and use case
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, index) => {
          const IconComponent = getCategoryIcon(category.name);
          const colorClass = getCategoryColor(index);
          const description = getCategoryDescription(category.name);
          const isTrending = category.avgTrustScore > 90; // Consider high trust score as trending
          
          return (
            <Link key={category.id} href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
              <Card className={`group relative overflow-hidden border-2 transition-all hover:shadow-lg ${colorClass}`}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClass}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {isTrending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="mb-2 font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  
                  <p className="mb-4 text-sm text-muted-foreground">
                    {description}
                  </p>
                  
                  <div className="mb-4 space-y-1">
                    {category.types.slice(0, 3).map((type) => (
                      <div key={type} className="text-xs text-muted-foreground">
                        • {type === 'dataset' ? 'Datasets' : type === 'api' ? 'APIs' : type === 'model' ? 'ML Models' : type}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{category.count.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">data products</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}