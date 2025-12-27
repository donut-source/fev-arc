"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Star,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  expertise: string[];
  yearsExperience: string;
  education: string;
  certifications: string[];
  preferredTools: string[];
  avatar: string | null;
}

const initialProfile: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  title: "Data Analyst",
  department: "Gaming Analytics",
  location: "San Francisco, CA",
  bio: "Experienced data analyst specializing in gaming analytics and player behavior insights. Passionate about turning data into actionable business intelligence.",
  expertise: ["Data Analysis", "SQL", "Python", "Tableau", "Player Analytics"],
  yearsExperience: "5-7 years",
  education: "MS in Data Science, UC Berkeley",
  certifications: ["Tableau Certified", "Google Analytics Certified"],
  preferredTools: ["Python", "SQL", "Tableau", "R"],
  avatar: null,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [newExpertise, setNewExpertise] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newTool, setNewTool] = useState("");
  const [loading, setLoading] = useState(true);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const result = await response.json();
        
        if (result.success) {
          setProfile(result.data);
        } else {
          console.error('Failed to load profile:', result.error);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          title: profile.title,
          department: profile.department,
          location: profile.location,
          bio: profile.bio,
          expertise: profile.expertise,
          yearsExperience: profile.yearsExperience,
          education: profile.education,
          certifications: profile.certifications,
          preferredTools: profile.preferredTools
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your information has been saved and will help improve AI search results."
        });
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile", {
          description: result.error || "Please try again."
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to update profile", {
        description: "Network error. Please try again."
      });
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    setProfile(initialProfile);
    setIsEditing(false);
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !profile.expertise.includes(newExpertise.trim())) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (expertise: string) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !profile.certifications.includes(newCertification.trim())) {
      setProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const addTool = () => {
    if (newTool.trim() && !profile.preferredTools.includes(newTool.trim())) {
      setProfile(prev => ({
        ...prev,
        preferredTools: [...prev.preferredTools, newTool.trim()]
      }));
      setNewTool("");
    }
  };

  const removeTool = (tool: string) => {
    setProfile(prev => ({
      ...prev,
      preferredTools: prev.preferredTools.filter(t => t !== tool)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your profile information to help colleagues find you and improve AI search results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <Badge variant="secondary">{profile.department}</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-2">{profile.title}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{profile.yearsExperience}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="expertise">Skills & Expertise</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself, your role, and what you're passionate about..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={profile.department}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, department: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gaming Analytics">Gaming Analytics</SelectItem>
                        <SelectItem value="Data Engineering">Data Engineering</SelectItem>
                        <SelectItem value="Product Analytics">Product Analytics</SelectItem>
                        <SelectItem value="Business Intelligence">Business Intelligence</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={profile.yearsExperience}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, yearsExperience: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2 years">0-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-7 years">5-7 years</SelectItem>
                        <SelectItem value="7-10 years">7-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="e.g., MS in Data Science, UC Berkeley"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expertise" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeExpertise(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="Add expertise area..."
                        onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                      />
                      <Button onClick={addExpertise} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{cert}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeCertification(cert)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add certification..."
                        onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                      />
                      <Button onClick={addCertification} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferred Tools */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Preferred Tools & Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredTools.map((tool, index) => (
                      <Badge key={index} variant="default" className="flex items-center space-x-1">
                        <span>{tool}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeTool(tool)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        value={newTool}
                        onChange={(e) => setNewTool(e.target.value)}
                        placeholder="Add preferred tool..."
                        onKeyPress={(e) => e.key === 'Enter' && addTool()}
                      />
                      <Button onClick={addTool} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Help Text */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Why complete your profile?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Better AI Search:</strong> Help the chat AI find you more accurately when colleagues ask questions</li>
                  <li>• <strong>Team Discovery:</strong> Make it easier for teammates to find the right expert for their needs</li>
                  <li>• <strong>Collaboration:</strong> Enable better matching for projects and data requests</li>
                  <li>• <strong>Knowledge Sharing:</strong> Surface your expertise to help others learn and grow</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
