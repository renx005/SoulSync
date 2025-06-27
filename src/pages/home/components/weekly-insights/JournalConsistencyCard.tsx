
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JournalConsistencyCardProps {
  journalConsistency: number | null;
}

export function JournalConsistencyCard({ journalConsistency }: JournalConsistencyCardProps) {
  const hasJournalData = journalConsistency !== null && journalConsistency > 0;
  
  return (
    <Card className="overflow-hidden border border-mindscape-light hover:shadow-md transition-all h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2 mb-auto">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium">Journal Consistency</h3>
            <BookOpen className={`h-5 w-5 flex-shrink-0 ${hasJournalData ? 'text-amber-500' : 'text-gray-300'}`} />
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 pr-6">
            {hasJournalData
              ? (journalConsistency >= 60 
                  ? "Great job journaling regularly" 
                  : "Try to journal more consistently")
              : "Start journaling to track your consistency"}
          </p>
        </div>
        
        <Progress 
          className="h-2 mt-3"
          value={hasJournalData ? journalConsistency : 0}
          indicatorClassName="bg-gradient-to-r from-yellow-300 to-amber-500"
        />
      </CardContent>
    </Card>
  );
}
