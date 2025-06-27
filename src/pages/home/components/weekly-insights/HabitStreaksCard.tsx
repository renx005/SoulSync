
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HabitStreaksCardProps {
  habitStreaks: number | null;
}

export function HabitStreaksCard({ habitStreaks }: HabitStreaksCardProps) {
  const hasHabitData = habitStreaks !== null && habitStreaks > 0;
  
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Habit Streaks</h3>
            <TrendingUp className={`h-5 w-5 flex-shrink-0 ${hasHabitData ? 'text-blue-500' : 'text-gray-300'}`} />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 pr-6">
            {hasHabitData
              ? (habitStreaks >= 50 
                  ? "You're building consistent habits" 
                  : "Keep working on your daily habits")
              : "Add and track habits to see your streaks"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={hasHabitData ? habitStreaks : 0}
          indicatorClassName="bg-gradient-to-r from-indigo-300 to-indigo-500"
        />
      </CardContent>
    </Card>
  );
}
