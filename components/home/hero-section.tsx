import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ArrowRight,
  Database,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-12 sm:py-20 lg:py-32">
      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Badge */}
          <Badge variant="secondary" className="mb-4 sm:mb-6">
            <Shield className="mr-2 h-3 w-3" />
            <span className="text-xs sm:text-sm">Trusted & Governed Data Products</span>
          </Badge>

          {/* Hero Title */}
          <h1 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Your Gateway to
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Trusted Data
            </span>
          </h1>

          {/* Hero Description */}
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground">
            Discover, validate, and subscribe to governed data products, APIs,
            and AI models. One marketplace, infinite possibilities.
          </p>

          {/* Hero Search */}
          <div className="mx-auto mb-8 sm:mb-12 max-w-sm sm:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search datasets, APIs, AI models..."
                className="h-12 sm:h-14 pl-10 sm:pl-12 pr-16 sm:pr-20 text-sm sm:text-lg"
              />
              <Button
                size="sm"
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-10 sm:h-10 px-3 sm:px-4"
              >
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Explore Catalog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Publish Your Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="mb-2 flex justify-center">
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="text-lg sm:text-2xl font-bold">2,847</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Datasets</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="mb-2 flex justify-center">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="text-lg sm:text-2xl font-bold">1,234</div>
              <div className="text-xs sm:text-sm text-muted-foreground">APIs</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="mb-2 flex justify-center">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="text-lg sm:text-2xl font-bold">567</div>
              <div className="text-xs sm:text-sm text-muted-foreground">AI Models</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="mb-2 flex justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="text-lg sm:text-2xl font-bold">12.5K</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Users</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform">
          <div className="h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
