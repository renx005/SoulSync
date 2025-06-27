
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BreathingExerciseProps {
  exercise: {
    id: string;
    name: string;
    description: string;
    duration: number; // in seconds
    breathPattern: {
      inhale: number;
      hold1?: number;
      exhale: number;
      hold2?: number;
    };
  };
  onComplete: () => void;
  onBack: () => void;
}

export default function BreathingExercise({ exercise, onComplete, onBack }: BreathingExerciseProps) {
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(exercise.breathPattern.inhale);
  
  // Using useRef to track if the exercise has been completed to prevent multiple calls
  const exerciseCompletedRef = useRef(false);
  // Timer ref to clean up on unmount
  const timerRef = useRef<number | null>(null);
  const bellSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Calculate the total breath cycle time
  const totalCycleTime = 
    exercise.breathPattern.inhale + 
    (exercise.breathPattern.hold1 || 0) + 
    exercise.breathPattern.exhale + 
    (exercise.breathPattern.hold2 || 0);
  
  // Initialize bell sound
  useEffect(() => {
    bellSoundRef.current = new Audio('/bell-sound.mp3');
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (bellSoundRef.current) {
        bellSoundRef.current.pause();
        bellSoundRef.current = null;
      }
    };
  }, []);
  
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
  
  // Handle breath phases
  useEffect(() => {
    if (!isActive) return;
    
    const phaseInterval = setInterval(() => {
      setPhaseTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next phase
          try {
            if (bellSoundRef.current) {
              bellSoundRef.current.play().catch(err => {
                console.error("Error playing sound:", err);
              });
            }
          } catch (error) {
            console.error("Error playing sound:", error);
          }
          
          switch (breathPhase) {
            case "inhale":
              if (exercise.breathPattern.hold1 && exercise.breathPattern.hold1 > 0) {
                setBreathPhase("hold1");
                return exercise.breathPattern.hold1;
              } else {
                setBreathPhase("exhale");
                return exercise.breathPattern.exhale;
              }
            case "hold1":
              setBreathPhase("exhale");
              return exercise.breathPattern.exhale;
            case "exhale":
              if (exercise.breathPattern.hold2 && exercise.breathPattern.hold2 > 0) {
                setBreathPhase("hold2");
                return exercise.breathPattern.hold2;
              } else {
                setBreathPhase("inhale");
                return exercise.breathPattern.inhale;
              }
            case "hold2":
              setBreathPhase("inhale");
              return exercise.breathPattern.inhale;
            default:
              return prev;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(phaseInterval);
    };
  }, [breathPhase, exercise.breathPattern, isActive]);
  
  const toggleExercise = () => {
    setIsActive(!isActive);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getBubbleSize = () => {
    switch (breathPhase) {
      case "inhale":
        return "scale-100 transform transition-transform duration-500";
      case "hold1":
      case "hold2":
        return "scale-100 transform transition-none";
      case "exhale":
        return "scale-75 transform transition-transform duration-500";
      default:
        return "scale-100";
    }
  };
  
  const getInstructionText = () => {
    switch (breathPhase) {
      case "inhale":
        return "Breathe in...";
      case "hold1":
        return "Hold...";
      case "exhale":
        return "Breathe out...";
      case "hold2":
        return "Hold...";
      default:
        return "Breathe...";
    }
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
      
      <Card className="flex-1 flex flex-col items-center justify-center p-6 mb-6">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium mb-2">{getInstructionText()}</h3>
          <p className="text-sm text-muted-foreground">
            Phase: {phaseTimeRemaining}s
          </p>
        </div>
        
        <div className="relative flex items-center justify-center w-full mb-8">
          <div className={`w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-1000 ${getBubbleSize()}`}>
            <div className={`w-36 h-36 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-1000 ${getBubbleSize()}`}>
              <div className={`w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center text-2xl font-semibold transition-all duration-1000 ${getBubbleSize()}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
        
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
      </div>
    </div>
  );
}
