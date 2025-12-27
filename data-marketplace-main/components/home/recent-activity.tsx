import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Download,
  Star,
} from "lucide-react";

const recentActivity = [
  {
    id: "1",
    type: "trending",
    title: "Operation Killshot Preorder Analysis",
    description: "Trending in Marketing Analytics",
    stats: "+45% usage this week",
    time: "2 hours ago",
    category: "Marketing Analytics",
    users: "234",
  },
  {
    id: "2",
    type: "new",
    title: "Cosmic Carnival Event Performance API",
    description: "Just published by Party Games Team",
    stats: "New release",
    time: "4 hours ago",
    category: "Real-time APIs",
    users: "89",
  },
  {
    id: "3",
    type: "popular",
    title: "Dragon Empire Revenue Attribution Model",
    description: "Most viewed this month",
    stats: "2.1K views",
    time: "1 day ago",
    category: "Strategy Revenue",
    users: "456",
  },
  {
    id: "4",
    type: "updated",
    title: "Shadow Strike Performance Dashboard",
    description: "Updated with new FPS metrics",
    stats: "v2.1 released",
    time: "2 days ago",
    category: "FPS Performance",
    users: "678",
  },
];


function getActivityIcon(type: string) {
  switch (type) {
    case "trending":
      return TrendingUp;
    case "new":
      return Star;
    case "popular":
      return Eye;
    case "updated":
      return Download;
    default:
      return Clock;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "trending":
      return "text-green-600 bg-green-50";
    case "new":
      return "text-blue-600 bg-blue-50";
    case "popular":
      return "text-purple-600 bg-purple-50";
    case "updated":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function RecentActivity() {
  return (
    <section className="py-12 sm:py-16 bg-muted/20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          What&apos;s Happening
        </h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/activity">
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {recentActivity.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <Card key={activity.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{activity.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{activity.users}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{activity.stats}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
