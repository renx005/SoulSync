
import React from "react";
import { Clock, Heart, Play, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BreathingExerciseType } from "../../../types";

interface ExerciseCardProps {
  exercise: BreathingExerciseType;
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
  return (
    <Card 
      key={exercise.id}
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        exercise.color === "blue" && "bg-gradient-to-br from-blue-50 to-transparent border-blue-200/50",
        exercise.color === "purple" && "bg-gradient-to-br from-purple-50 to-transparent border-purple-200/50",
        exercise.color === "green" && "bg-gradient-to-br from-green-50 to-transparent border-green-200/50"
      )}
    >
      <CardHeader className="px-4 py-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{exercise.name}</CardTitle>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(exercise.id);
            }}
            className="text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Heart className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-400 text-red-400" : "fill-transparent"
            )} />
          </button>
        </div>
        <CardDescription className="text-xs mt-1 line-clamp-2">{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="flex gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{exercise.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3.5 w-3.5" />
            <span>{exercise.level}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 pt-0">
        <button 
          className={cn(
            "w-full flex items-center justify-center gap-2 text-sm py-1.5 rounded-md",
            "text-white transition-colors",
            exercise.color === "blue" && "bg-blue-500 hover:bg-blue-600",
            exercise.color === "purple" && "bg-purple-500 hover:bg-purple-600",
            exercise.color === "green" && "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => onStartSession(exercise.id)}
        >
          <Play className="h-3.5 w-3.5" />
          Start Exercise
        </button>
      </CardFooter>
    </Card>
  );
}
