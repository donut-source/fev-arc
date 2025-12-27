"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  User,
  Building,
  Clock,
  Shield,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'data-source' | 'collection';
  resourceName: string;
  dataOwner: string;
  steward?: string;
  accessLevel?: string;
}

export function AccessRequestModal({
  isOpen,
  onClose,
  resourceType,
  resourceName,
  dataOwner,
  steward,
  accessLevel = 'public'
}: AccessRequestModalProps) {
  const [businessJustification, setBusinessJustification] = useState("");
  const [accessType, setAccessType] = useState("");
  const [urgency, setUrgency] = useState("");
  const [projectName, setProjectName] = useState("");
  const [expectedUsage, setExpectedUsage] = useState("");

  const handleSubmitRequest = () => {
    if (!businessJustification.trim() || !accessType || !urgency || !projectName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Open Google in new tab
    const gameKitUrl = "https://google.com";
    window.open(gameKitUrl, '_blank');

    // Show success message
    toast.success("Request sent to GameKit!", {
      description: "GameKit has opened in a new tab. Complete your request there.",
      duration: 5000,
    });

    onClose();
    
    // Reset form
    setBusinessJustification("");
    setAccessType("");
    setUrgency("");
    setProjectName("");
    setExpectedUsage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <span>Access Requests Managed through GameKit</span>
          </DialogTitle>
          <DialogDescription>
            All data access requests are processed through our GameKit governance platform. 
            Please provide the required information below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resource Information */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Resource Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Resource:</span>
                <p className="font-medium">{resourceName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className="text-xs">
                  {resourceType === 'data-source' ? 'Data Source' : 'Collection'}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Data Owner:</span>
                <p className="font-medium flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{dataOwner}</span>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Access Level:</span>
                <Badge variant={accessLevel === 'public' ? 'default' : 'secondary'} className="text-xs">
                  {accessLevel}
                </Badge>
              </div>
              {steward && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Data Steward:</span>
                  <p className="font-medium">{steward}</p>
                </div>
              )}
            </div>
          </div>

          {/* Request Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Player Retention Analysis Q1"
                />
              </div>
              <div>
                <Label htmlFor="access-type">Access Type *</Label>
                <Select value={accessType} onValueChange={setAccessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read-only">Read-Only Access</SelectItem>
                    <SelectItem value="api-access">API Access</SelectItem>
                    <SelectItem value="download">Download/Export</SelectItem>
                    <SelectItem value="streaming">Real-time Streaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency *</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (7-14 days)</SelectItem>
                    <SelectItem value="medium">Medium (3-7 days)</SelectItem>
                    <SelectItem value="high">High (1-3 days)</SelectItem>
                    <SelectItem value="critical">Critical (Same day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expected-usage">Expected Usage</Label>
                <Input
                  id="expected-usage"
                  value={expectedUsage}
                  onChange={(e) => setExpectedUsage(e.target.value)}
                  placeholder="e.g., 1000 queries/month"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business-justification">Business Justification *</Label>
              <Textarea
                id="business-justification"
                value={businessJustification}
                onChange={(e) => setBusinessJustification(e.target.value)}
                placeholder="Explain why you need access to this data, how it will be used, and the business value it will provide..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* GameKit Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">GameKit Processing</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Your request will be reviewed by the data governance team and the data owner.
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Typical response: 2-5 business days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>Email notifications enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Send to GameKit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
