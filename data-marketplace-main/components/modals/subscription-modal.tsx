"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Cloud, 
  Database, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Settings,
  Zap,
  Building,
  Clock,
  Users,
  Lock
} from "lucide-react";
import { toast } from "sonner";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSourceTitle: string;
  dataSourceId: string;
}

interface CloudPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  projectExample: string;
  tableExample: string;
}

const cloudPlatforms: CloudPlatform[] = [
  {
    id: "snowflake",
    name: "Snowflake",
    icon: Cloud,
    color: "bg-blue-500",
    description: "Enterprise cloud data platform",
    projectExample: "ANALYTICS_PROD.GAME_FPS",
    tableExample: "OPERATION_KILLSHOT_PREORDERS"
  },
  {
    id: "bigquery",
    name: "BigQuery",
    icon: Database,
    color: "bg-blue-600",
    description: "Google Cloud data warehouse",
    projectExample: "game-analytics-prod",
    tableExample: "game_fps.operation_killshot_preorders"
  },
  {
    id: "databricks",
    name: "Databricks",
    icon: Zap,
    color: "bg-orange-500",
    description: "Unified analytics platform",
    projectExample: "game-workspace",
    tableExample: "game_fpscatalog.operation_killshot_preorders"
  },
  {
    id: "redshift",
    name: "Amazon Redshift",
    icon: Building,
    color: "bg-red-500",
    description: "AWS cloud data warehouse",
    projectExample: "game-analytics-cluster",
    tableExample: "game_fps.operation_killshot_preorders"
  }
];

export function SubscriptionModal({ isOpen, onClose, dataSourceTitle, dataSourceId }: SubscriptionModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [step, setStep] = useState<"platform" | "contract" | "confirm">("platform");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataContract, setAcceptedDataContract] = useState(false);

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setStep("contract");
  };

  const handleContractAccept = () => {
    if (acceptedTerms && acceptedDataContract) {
      setStep("confirm");
    }
  };

  const handleSubscribe = () => {
    const platform = cloudPlatforms.find(p => p.id === selectedPlatform);
    toast.success("Subscription Created!", {
      description: `${dataSourceTitle} will be available in your ${platform?.name} environment within 15 minutes.`,
      duration: 5000,
    });
    onClose();
    // Reset state
    setStep("platform");
    setSelectedPlatform("");
    setAcceptedTerms(false);
    setAcceptedDataContract(false);
  };

  const selectedPlatformData = cloudPlatforms.find(p => p.id === selectedPlatform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-2/3 max-w-4xl sm:max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Cloud className="h-6 w-6 text-white" />
            Subscribe to Data Source
          </DialogTitle>
          <DialogDescription>
            Connect {dataSourceTitle} to your cloud data platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === "platform" ? "text-blue-600" : step === "contract" || step === "confirm" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "platform" ? "bg-blue-100 border-2 border-blue-600" : step === "contract" || step === "confirm" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Platform</span>
            </div>
            <div className={`w-8 h-0.5 ${step === "contract" || step === "confirm" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center space-x-2 ${step === "contract" ? "text-blue-600" : step === "confirm" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "contract" ? "bg-blue-100 border-2 border-blue-600" : step === "confirm" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Contract</span>
            </div>
            <div className={`w-8 h-0.5 ${step === "confirm" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center space-x-2 ${step === "confirm" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "confirm" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>

          {/* Platform Selection Step */}
          {step === "platform" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select Your Cloud Platform</h3>
                <p className="text-sm text-muted-foreground">Choose where you'd like to receive this data</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cloudPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Card 
                      key={platform.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                        selectedPlatform === platform.id 
                          ? "border-blue-300 bg-white dark:bg-blue-200" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePlatformSelect(platform.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{platform.name}</CardTitle>
                            <CardDescription className="text-xs">{platform.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-muted-foreground">Project:</span>
                            <code className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs text-white">
                              {platform.projectExample}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Table:</span>
                            <code className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs text-white">
                              {platform.tableExample}
                            </code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Data Contract Step */}
          {step === "contract" && selectedPlatformData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Data Contract & Terms</h3>
                <p className="text-sm text-muted-foreground">Review and accept the data usage terms</p>
              </div>

              {/* Selected Platform Info */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${selectedPlatformData.color} flex items-center justify-center`}>
                      <selectedPlatformData.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-black">Destination: {selectedPlatformData.name}</CardTitle>
                      <CardDescription className="text-xs text-black">
                        {selectedPlatformData.projectExample} → {selectedPlatformData.tableExample}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Data Contract */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Data Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Data Freshness</span>
                      </div>
                      <ul className="text-xs space-y-1 ml-6">
                        <li>• Updated every 15 minutes</li>
                        <li>• Maximum latency: 30 minutes</li>
                        <li>• Historical data: 2 years</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Data Quality</span>
                      </div>
                      <ul className="text-xs space-y-1 ml-6">
                        <li>• 99.5% completeness SLA</li>
                        <li>• Automated validation checks</li>
                        <li>• Schema evolution support</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">Usage Rights</span>
                      </div>
                      <ul className="text-xs space-y-1 ml-6">
                        <li>• Internal analytics only</li>
                        <li>• No redistribution allowed</li>
                        <li>• Team access: 50 users max</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-sm">Compliance</span>
                      </div>
                      <ul className="text-xs space-y-1 ml-6">
                        <li>• GDPR compliant</li>
                        <li>• SOC 2 Type II certified</li>
                        <li>• Data residency: US/EU</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  {/* Terms Acceptance */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and 
                        <span className="text-blue-600 underline cursor-pointer ml-1">Privacy Policy</span>
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="contract"
                        checked={acceptedDataContract}
                        onChange={(e) => setAcceptedDataContract(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="contract" className="text-sm">
                        I acknowledge the data usage restrictions and commit to using this data only for internal analytics purposes
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep("platform")}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleContractAccept}
                      disabled={!acceptedTerms || !acceptedDataContract}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Confirmation Step */}
          {step === "confirm" && selectedPlatformData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Confirm Subscription</h3>
                <p className="text-sm text-muted-foreground">Review your subscription details</p>
              </div>

              <Card className="border-green-200 bg-white dark:bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Subscription Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Data Source</h4>
                      <p className="text-sm text-muted-foreground">{dataSourceTitle}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Platform</h4>
                      <div className="flex items-center gap-2">
                        <selectedPlatformData.icon className="h-4 w-4" />
                        <span className="text-sm">{selectedPlatformData.name}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Destination</h4>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-white">
                        {selectedPlatformData.projectExample}
                      </code>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Table Name</h4>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-white">
                        {selectedPlatformData.tableExample}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium">Setup Time: ~15 minutes</p>
                      <p className="text-muted-foreground text-xs">You'll receive an email confirmation once the data is available</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep("contract")}>
                      Back
                    </Button>
                    <Button onClick={handleSubscribe} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
