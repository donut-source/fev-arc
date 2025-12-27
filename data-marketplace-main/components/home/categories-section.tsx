import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Brain,
  Zap,
  BarChart3,
  Globe,
  ShoppingCart,
  Heart,
  Building,
  Smartphone,
  Car,
  Gamepad2,
  Music,
} from "lucide-react";

const categories = [
  {
    id: "analytics",
    name: "Analytics & BI",
    description: "Business intelligence and analytics datasets",
    icon: BarChart3,
    count: 847,
    color: "bg-blue-500/10 text-blue-600",
    trending: true,
  },
  {
    id: "financial",
    name: "Financial Data",
    description: "Market data, trading signals, and financial metrics",
    icon: Building,
    count: 523,
    color: "bg-green-500/10 text-green-600",
    trending: true,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Product catalogs, pricing, and customer behavior",
    icon: ShoppingCart,
    count: 412,
    color: "bg-purple-500/10 text-purple-600",
    trending: false,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical research data and health analytics",
    icon: Heart,
    count: 298,
    color: "bg-red-500/10 text-red-600",
    trending: true,
  },
  {
    id: "geospatial",
    name: "Geospatial",
    description: "Location data, maps, and geographic analytics",
    icon: Globe,
    count: 367,
    color: "bg-teal-500/10 text-teal-600",
    trending: false,
  },
  {
    id: "mobile",
    name: "Mobile & Apps",
    description: "App analytics, user behavior, and mobile data",
    icon: Smartphone,
    count: 234,
    color: "bg-orange-500/10 text-orange-600",
    trending: true,
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Vehicle data, transportation, and mobility",
    icon: Car,
    count: 156,
    color: "bg-gray-500/10 text-gray-600",
    trending: false,
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Game analytics, player behavior, and esports",
    icon: Gamepad2,
    count: 189,
    color: "bg-pink-500/10 text-pink-600",
    trending: true,
  },
  {
    id: "media",
    name: "Media & Entertainment",
    description: "Content analytics, streaming data, and media metrics",
    icon: Music,
    count: 145,
    color: "bg-indigo-500/10 text-indigo-600",
    trending: false,
  },
];

function CategoryCard({ category }: { category: typeof categories[0] }) {
  const IconComponent = category.icon;

  return (
    <Link href={`/catalog?category=${category.id}`}>
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

