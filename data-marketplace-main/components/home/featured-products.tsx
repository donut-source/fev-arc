import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Download,
  Eye,
  ArrowRight,
} from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    title: "Global Customer Analytics Dataset",
    description: "Comprehensive customer behavior data across 50+ countries with privacy-compliant anonymization.",
    type: "dataset",
    icon: Database,
    category: "Analytics",
    trustScore: 98,
    downloads: "12.4K",
    views: "45.2K",
    rating: 4.9,
    tags: ["Customer Data", "Analytics", "Global", "Privacy-Safe"],
    governance: {
      dataQuality: 95,
      compliance: 100,
      lineage: 90,
    },
    pricing: "Free",
    featured: true,
  },
  {
    id: "2",
    title: "Real-time Market Data API",
    description: "Live financial market data with sub-millisecond latency for trading applications.",
    type: "api",
    icon: Zap,
    category: "Financial",
    trustScore: 96,
    downloads: "8.7K",
    views: "23.1K",
    rating: 4.8,
    tags: ["Real-time", "Financial", "Trading", "Low Latency"],
    governance: {
      dataQuality: 98,
      compliance: 95,
      lineage: 88,
    },
    pricing: "$0.01/call",
    featured: true,
  },
  {
    id: "3",
    title: "Sentiment Analysis AI Model",
    description: "Pre-trained transformer model for multi-language sentiment analysis with 94% accuracy.",
    type: "ai-model",
    icon: Brain,
    category: "NLP",
    trustScore: 94,
    downloads: "5.2K",
    views: "18.9K",
    rating: 4.7,
    tags: ["NLP", "Sentiment", "Multi-language", "Transformer"],
    governance: {
      dataQuality: 92,
      compliance: 98,
      lineage: 85,
    },
    pricing: "$0.05/inference",
    featured: true,
  },
  {
    id: "4",
    title: "E-commerce Product Catalog",
    description: "Structured product data from major e-commerce platforms with real-time updates.",
    type: "dataset",
    icon: Database,
    category: "E-commerce",
    trustScore: 92,
    downloads: "6.8K",
    views: "31.5K",
    rating: 4.6,
    tags: ["E-commerce", "Products", "Real-time", "Structured"],
    governance: {
      dataQuality: 90,
      compliance: 95,
      lineage: 92,
    },
    pricing: "$99/month",
    featured: false,
  },
];

function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  const IconComponent = product.icon;

  return (
    <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur transition-all hover:bg-card/80 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1 text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">
                  {product.trustScore}% Trust Score
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {product.pricing}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Governance Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Data Quality</span>
            <span>{product.governance.dataQuality}%</span>
          </div>
          <Progress value={product.governance.dataQuality} className="h-1" />
          
          <div className="flex items-center justify-between text-xs">
            <span>Compliance</span>
            <span>{product.governance.compliance}%</span>
          </div>
          <Progress value={product.governance.compliance} className="h-1" />
          
          <div className="flex items-center justify-between text-xs">
            <span>Lineage</span>
            <span>{product.governance.lineage}%</span>
          </div>
          <Progress value={product.governance.lineage} className="h-1" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {product.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{product.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <Link href={`/products/${product.id}`}>
            View Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Data Products
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover our most trusted and popular data products, APIs, and AI models
            with built-in governance and quality assurance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/catalog">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

