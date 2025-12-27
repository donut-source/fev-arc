import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Brain,
  Zap,
  BarChart3,
  Globe,
  Building,
} from "lucide-react";

const categories = [
  {
    id: "fx",
    name: "FX Rates",
    description: "Spot, forwards, curves, and hedging analytics for cross-border deals",
    icon: BarChart3,
    count: 128,
    color: "bg-blue-500/10 text-blue-600",
    trending: true,
  },
  {
    id: "company-intel",
    name: "Company Intelligence",
    description: "Entity profiles, ownership, executives, subsidiaries, and risk flags",
    icon: Building,
    count: 96,
    color: "bg-green-500/10 text-green-600",
    trending: true,
  },
  {
    id: "valuation",
    name: "PE Valuation",
    description: "Private comps, multiples, transaction analytics, and valuation QA",
    icon: Database,
    count: 74,
    color: "bg-purple-500/10 text-purple-600",
    trending: false,
  },
  {
    id: "real-estate",
    name: "Real Estate Signals",
    description: "Neighborhood activity, demand proxies, and geo-driven indicators (synthetic)",
    icon: Globe,
    count: 52,
    color: "bg-red-500/10 text-red-600",
    trending: true,
  },
  {
    id: "models",
    name: "Models & QA",
    description: "Governed models for anomaly detection, validation, and scoring",
    icon: Brain,
    count: 31,
    color: "bg-teal-500/10 text-teal-600",
    trending: false,
  },
  {
    id: "apis",
    name: "APIs & Feeds",
    description: "APIs for signals, scenarios, and downstream consumption",
    icon: Zap,
    count: 18,
    color: "bg-orange-500/10 text-orange-600",
    trending: true,
  },
];

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const IconComponent = category.icon;

  return (
    <Link href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
      <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  {category.trending && (
                    <Badge variant="secondary" className="text-xs">
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold">{category.count.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">products</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CategoriesSection() {
  return (
    <section className="bg-muted/20 py-20">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse data products organized by industry and use case to find
            exactly what you need for your projects.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

