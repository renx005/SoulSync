
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MindfulnessExerciseProps {
  exercise: {
    id: string;
    name: string;
    description: string;
    duration: number; // in seconds
    steps?: string[];
  };
  onComplete: () => void;
  onBack: () => void;
}

export default function MindfulnessExercise({ exercise, onComplete, onBack }: MindfulnessExerciseProps) {
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Using useRef to track if the exercise has been completed to prevent multiple calls
  const exerciseCompletedRef = useRef(false);
  // Timer ref to clean up on unmount
  const timerRef = useRef<number | null>(null);
  
  // Calculate step duration - total duration divided by number of steps
  const stepDuration = exercise.steps ? Math.floor(exercise.duration / exercise.steps.length) : 0;
  
  // Main exercise timer
  useEffect(() => {
    if (!isActive) return;
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        // If time's up, complete the exercise
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          
          // Only complete the exercise once
          if (!exerciseCompletedRef.current) {
            exerciseCompletedRef.current = true;
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, onComplete]);
  
  // Step progression
  useEffect(() => {
    if (!isActive || !exercise.steps) return;
    
    const stepInterval = setInterval(() => {
      const elapsedTime = exercise.duration - timeRemaining;
      const shouldBeAtStep = Math.min(
        Math.floor(elapsedTime / stepDuration),
        exercise.steps.length - 1
      );
      
      if (shouldBeAtStep !== currentStepIndex) {
        setCurrentStepIndex(shouldBeAtStep);
      }
    }, 1000);
    
    return () => {
      clearInterval(stepInterval);
    };
  }, [currentStepIndex, exercise.duration, exercise.steps, isActive, stepDuration, timeRemaining]);
  
  const toggleExercise = () => {
    setIsActive(!isActive);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progress = ((exercise.duration - timeRemaining) / exercise.duration) * 100;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium ml-2">{exercise.name}</h2>
      </div>
      
      <Card className="flex-1 p-6 mb-6">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-medium">Current step:</h3>
          <span className="text-lg font-semibold">{formatTime(timeRemaining)}</span>
        </div>
        
        {exercise.steps && (
          <div className="mb-6 bg-primary/5 p-4 rounded-lg">
            <p className="text-base">{exercise.steps[currentStepIndex]}</p>
          </div>
        )}
        
        <Progress value={progress} className="w-full mb-6" />
        
        <Button 
          onClick={toggleExercise} 
          variant={isActive ? "outline" : "default"} 
          size="lg"
          className="min-w-[120px]"
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>{exercise.description}</p>
        {exercise.steps && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">All Steps:</h4>
            <ol className="list-decimal list-inside space-y-1">
              {exercise.steps.map((step, index) => (
                <li 
                  key={index}
                  className={`${currentStepIndex === index && isActive ? "text-primary font-medium" : ""}`}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
