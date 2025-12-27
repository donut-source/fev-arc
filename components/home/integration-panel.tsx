import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Database,
  Activity,
  Shield,
  BarChart3,
  Zap,
  GitBranch,
} from "lucide-react";

const integrations = [
  {
    name: "Alation",
    description: "Data catalog and governance platform",
    type: "Data Catalog",
    status: "connected",
    icon: Database,
    url: "https://alation.company.com",
    features: ["Data lineage", "Business glossary", "Data profiling"],
  },
  {
    name: "Monte Carlo",
    description: "Data observability and monitoring",
    type: "Data Quality",
    status: "connected", 
    icon: Activity,
    url: "https://montecarlo.company.com",
    features: ["Data quality monitoring", "Anomaly detection", "Incident management"],
  },
  {
    name: "Snowflake",
    description: "Cloud data warehouse platform",
    type: "Data Warehouse",
    status: "connected",
    icon: Database,
    url: "https://snowflake.company.com",
    features: ["Analytics workloads", "Data sharing", "Secure data access"],
  },
  {
    name: "Databricks",
    description: "Unified analytics platform",
    type: "ML Platform",
    status: "connected",
    icon: BarChart3,
    url: "https://databricks.company.com",
    features: ["ML workflows", "Data engineering", "Collaborative notebooks"],
  },
  {
    name: "Apache Airflow",
    description: "Workflow orchestration platform",
    type: "Orchestration",
    status: "connected",
    icon: GitBranch,
    url: "https://airflow.company.com",
    features: ["Pipeline scheduling", "Dependency management", "Monitoring"],
  },
  {
    name: "Kafka",
    description: "Event streaming platform",
    type: "Streaming",
    status: "connected",
    icon: Zap,
    url: "https://kafka.company.com",
    features: ["Real-time data", "Event processing", "Stream analytics"],
  },
];

export function IntegrationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Connected Data Tools</span>
          <Badge variant="secondary" className="text-xs">
            {integrations.filter(i => i.status === 'connected').length} Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <div
                key={integration.name}
                className="flex flex-col space-y-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.type}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={integration.status === 'connected' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {integration.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {integration.features.slice(0, 2).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-2xs">
                      {feature}
                    </Badge>
                  ))}
                  {integration.features.length > 2 && (
                    <Badge variant="outline" className="text-2xs">
                      +{integration.features.length - 2}
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={integration.url} target="_blank" rel="noopener noreferrer">
                    Open {integration.name}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Need access to a tool?</h4>
              <p className="text-sm text-muted-foreground">
                Request access to additional data tools and platforms
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/integrations/request">
                Request Access
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

