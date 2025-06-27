
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MindfulnessExerciseType } from "../../../types";
import { Clock, Heart, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExerciseCardProps {
  exercise: MindfulnessExerciseType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onStartSession: (id: string) => void;
}

export default function ExerciseCard({
  exercise,
  isFavorite,
  onToggleFavorite,
  onStartSession
}: ExerciseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <Card
      className={cn(
        "overflow-hidden border relative transition-all",
        isHovered && "shadow-md",
        exercise.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
        exercise.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
        exercise.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent",
        exercise.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={cn("p-4", isMobile && "p-3")}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={cn("font-medium mb-1", isMobile && "text-sm")}>{exercise.name}</h3>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {exercise.duration} min
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                {exercise.focus}
              </Badge>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(exercise.id);
            }}
            className="bg-transparent border-none p-1 flex items-center justify-center"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </motion.button>
        </div>
        
        <p className={cn("text-sm text-muted-foreground mb-4 line-clamp-2", isMobile && "text-xs mb-3 line-clamp-1")}>
          {exercise.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{exercise.steps ? exercise.steps.length : "4"} phases</span>
          </div>
          
          <Button
            onClick={() => onStartSession(exercise.id)}
            className={cn(
              "transition-all",
              exercise.color === "blue" && "bg-blue-500 hover:bg-blue-600",
              exercise.color === "purple" && "bg-purple-500 hover:bg-purple-600",
              exercise.color === "green" && "bg-green-500 hover:bg-green-600",
              exercise.color === "orange" && "bg-orange-500 hover:bg-orange-600",
              isMobile && "text-xs h-8 px-3"
            )}
            size={isMobile ? "sm" : "sm"}
          >
            Start
          </Button>
        </div>
      </CardContent>
      
      {/* Card decoration */}
      <div
        className={cn(
          "absolute -z-10 top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl transition-opacity",
          isHovered && "opacity-40",
          exercise.color === "blue" && "bg-blue-300",
          exercise.color === "purple" && "bg-purple-300",
          exercise.color === "green" && "bg-green-300",
          exercise.color === "orange" && "bg-orange-300",
          isMobile && "w-16 h-16"
        )}
      />
    </Card>
  );
}
