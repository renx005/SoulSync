
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ActivityLevelCardProps {
  activityLevel: number | null;
}

export function ActivityLevelCard({ activityLevel }: ActivityLevelCardProps) {
  const hasActivityData = activityLevel !== null && activityLevel > 0;
  
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Activity Level</h3>
            <Activity className={`h-5 w-5 flex-shrink-0 ${hasActivityData ? 'text-purple-500' : 'text-gray-300'}`} />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 pr-6">
            {hasActivityData
              ? (activityLevel >= 60
                  ? "Great progress on wellness goals" 
                  : "Continue building healthy routines")
              : "Use the app regularly to track your activity"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={hasActivityData ? activityLevel : 0}
          indicatorClassName="bg-gradient-to-r from-purple-300 to-purple-500"
        />
      </CardContent>
    </Card>
  );
}
