import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle,
  Eye,
  GitBranch,
  Clock,
  Users,
  Award,
  Lock,
} from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Data Governance",
    description: "Every product includes comprehensive governance metadata",
    stats: "100% Coverage",
    color: "text-green-600",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "Automated quality checks and validation pipelines",
    stats: "99.9% Uptime",
    color: "text-blue-600",
  },
  {
    icon: GitBranch,
    title: "Data Lineage",
    description: "Complete traceability from source to consumption",
    stats: "Full Lineage",
    color: "text-purple-600",
  },
  {
    icon: Lock,
    title: "Privacy & Compliance",
    description: "GDPR, CCPA, and industry-specific compliance built-in",
    stats: "Certified",
    color: "text-red-600",
  },
];

const governanceMetrics = [
  {
    label: "Data Quality Score",
    value: 96,
    description: "Average quality score across all products",
  },
  {
    label: "Compliance Rate",
    value: 99,
    description: "Products meeting regulatory requirements",
  },
  {
    label: "Lineage Coverage",
    value: 94,
    description: "Products with complete data lineage",
  },
  {
    label: "Trust Score",
    value: 97,
    description: "Overall trust and reliability rating",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            <Award className="mr-2 h-3 w-3" />
            Enterprise-Grade Trust
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Trust & Governance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every data product in ARC comes with comprehensive
            governance, quality assurance, and compliance built-in.
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Governance Metrics */}
        <Card className="border-0 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold">Governance Metrics</h3>
              <p className="text-muted-foreground">
                Real-time metrics showing the quality and trustworthiness of our data ecosystem
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {governanceMetrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary">
                      {metric.value}%
                    </div>
                    <div className="text-sm font-medium">{metric.label}</div>
                  </div>
                  <Progress value={metric.value} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 opacity-60">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">SOC 2 Certified</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">ISO 27001</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="text-sm font-medium">Enterprise Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}

