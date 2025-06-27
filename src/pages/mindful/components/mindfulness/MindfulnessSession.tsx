import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw, Timer, SkipBack, SkipForward, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { MindfulnessExerciseType, ProgressLogItem } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";

interface MindfulnessSessionProps {
  exercise: MindfulnessExerciseType;
  onClose: () => void;
}

export default function MindfulnessSession({ exercise, onClose }: MindfulnessSessionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [activeTab, setActiveTab] = useState("practice");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showStepCompleteAnimation, setShowStepCompleteAnimation] = useState(false);
  const [stepTimeElapsed, setStepTimeElapsed] = useState(0);
  
  // Refs for timer management and cleanup
  const stepTimerRef = useRef<number | null>(null);
  const mainTimerRef = useRef<number | null>(null);
  const isSessionCompletedRef = useRef<boolean>(false);
  
  const [progressLog, setProgressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  
  useEffect(() => {
    return () => {
      // Cleanup all timers
      clearAllTimers();
    };
  }, []);
  
  // Helper function to clear all timers
  const clearAllTimers = () => {
    if (stepTimerRef.current) {
      window.clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    
    if (mainTimerRef.current) {
      window.clearInterval(mainTimerRef.current);
      mainTimerRef.current = null;
    }
  };
  
  const logCompletedSession = (duration: number) => {
    if (isSessionCompletedRef.current) return; // Prevent duplicate logs
    
    isSessionCompletedRef.current = true;
    
    const newSession: ProgressLogItem = {
      id: uuidv4(),
      date: new Date().toISOString(),
      exerciseId: exercise.id,
      exerciseType: "mindfulness",
      duration: duration
    };
    
    setProgressLog(prev => [...prev, newSession]);
    
    toast({
      title: "Exercise Logged",
      description: `${exercise.name} exercise completed and saved to your progress.`,
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Main timer for overall session duration
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) {
      if (mainTimerRef.current) {
        window.clearInterval(mainTimerRef.current);
        mainTimerRef.current = null;
      }
      return;
    }
    
    mainTimerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          window.clearInterval(mainTimerRef.current!);
          mainTimerRef.current = null;
          setIsPlaying(false);
          
          const durationSpent = exercise.duration * 60;
          logCompletedSession(Math.round(durationSpent / 60));
          
          toast({
            title: "Exercise Complete",
            description: `Great job! You've completed ${exercise.name}.`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (mainTimerRef.current) {
        window.clearInterval(mainTimerRef.current);
        mainTimerRef.current = null;
      }
    };
  }, [isPlaying, exercise.name, exercise.duration]);
  
  // Step progression timer - Using setInterval for continuous updates
  useEffect(() => {
    // Clear any existing step timer
    if (stepTimerRef.current) {
      window.clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    
    if (!isPlaying || currentStepIndex >= exercise.steps.length) {
      return;
    }
    
    const currentStep = exercise.steps[currentStepIndex];
    
    // Start step timer
    setStepTimeElapsed(0);
    
    // Set interval to track step elapsed time and progress to next step when time is up
    const stepInterval = window.setInterval(() => {
      setStepTimeElapsed(prev => {
        const newElapsed = prev + 1;
        
        // When step duration is reached, move to next step
        if (newElapsed >= currentStep.duration) {
          clearInterval(stepInterval);
          
          // Mark current step as completed
          setCompletedSteps(prev => {
            if (!prev.includes(currentStepIndex)) {
              return [...prev, currentStepIndex];
            }
            return prev;
          });
          
          // Show completion animation
          setShowStepCompleteAnimation(true);
          setTimeout(() => setShowStepCompleteAnimation(false), 1500);
          
          // Move to next step if available
          if (currentStepIndex < exercise.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            // All steps completed
            if (!isSessionCompletedRef.current) {
              const durationSpent = exercise.duration * 60 - timeRemaining;
              logCompletedSession(Math.round(durationSpent / 60));
              
              toast({
                title: "Exercise Complete",
                description: "You've completed all steps. Take a moment to reflect on how you feel now.",
              });
              
              setIsPlaying(false);
            }
          }
          
          return 0;
        }
        
        return newElapsed;
      });
    }, 1000);
    
    stepTimerRef.current = stepInterval;
    
    // Cleanup step timer on unmount or when dependencies change
    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepInterval);
        stepTimerRef.current = null;
      }
    };
  }, [currentStepIndex, isPlaying, exercise.steps]);
  
  const resetSession = () => {
    clearAllTimers();
    setTimeRemaining(exercise.duration * 60);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsPlaying(true);
    setActiveTab("practice");
    setStepTimeElapsed(0);
    isSessionCompletedRef.current = false;
  };
  
  const navigateToStep = (index: number) => {
    if (index >= 0 && index < exercise.steps.length) {
      // Clear any existing timers before changing step
      if (stepTimerRef.current) {
        window.clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
      
      setCurrentStepIndex(index);
      setStepTimeElapsed(0);
      
      // Mark all previous steps as completed
      const newCompletedSteps = Array.from(
        new Set([...completedSteps, ...Array.from({ length: index }, (_, i) => i)])
      );
      setCompletedSteps(newCompletedSteps);
    }
  };
  
  const currentStep = exercise.steps[currentStepIndex];
  
  // Calculate current step progress percentage
  const currentStepProgress = currentStep ? (stepTimeElapsed / currentStep.duration) * 100 : 0;
  
  return (
    <div className="flex flex-col items-center justify-start h-[calc(100vh-220px)] relative">
      <div className="w-full flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-center">{exercise.name}</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="steps">All Steps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="mt-2 space-y-4">
          <div className={cn(
            "relative flex items-center justify-center w-full p-6 rounded-xl min-h-[240px] transition-all",
            exercise.color === "blue" && "bg-blue-100/20",
            exercise.color === "purple" && "bg-purple-100/20",
            exercise.color === "green" && "bg-green-100/20",
            exercise.color === "orange" && "bg-orange-100/20"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center relative"
              >
                <Badge 
                  className={cn(
                    "mb-3",
                    exercise.color === "blue" && "bg-blue-500",
                    exercise.color === "purple" && "bg-purple-500",
                    exercise.color === "green" && "bg-green-500",
                    exercise.color === "orange" && "bg-orange-500"
                  )}
                >
                  Step {currentStepIndex + 1} of {exercise.steps.length}
                </Badge>
                <h3 className="text-lg font-medium mb-3">{currentStep?.title}</h3>
                <ScrollArea className="h-[150px] w-full max-w-md">
                  <p className="text-muted-foreground text-left">{currentStep?.instruction}</p>
                </ScrollArea>
                
                <AnimatePresence>
                  {showStepCompleteAnimation && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="bg-white p-6 rounded-full"
                      >
                        <Heart className={cn(
                          "h-8 w-8",
                          exercise.color === "blue" && "text-blue-500",
                          exercise.color === "purple" && "text-purple-500",
                          exercise.color === "green" && "text-green-500",
                          exercise.color === "orange" && "text-orange-500"
                        )} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="text-center space-y-4 w-full max-w-md mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Step Progress</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Overall session progress */}
              <Progress 
                value={(timeRemaining / (exercise.duration * 60)) * 100} 
                className="h-2" 
                indicatorClassName={cn(
                  exercise.color === "blue" && "bg-blue-500",
                  exercise.color === "purple" && "bg-purple-500",
                  exercise.color === "green" && "bg-green-500",
                  exercise.color === "orange" && "bg-orange-500"
                )}
              />
              
              {/* Current step progress */}
              <Progress 
                value={currentStepProgress} 
                className="h-2" 
                indicatorClassName={cn(
                  exercise.color === "blue" && "bg-blue-300",
                  exercise.color === "purple" && "bg-purple-300",
                  exercise.color === "green" && "bg-green-300",
                  exercise.color === "orange" && "bg-orange-300"
                )}
              />
            </div>
            
            <div className="flex gap-2 justify-center pt-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateToStep(currentStepIndex - 1)}
                disabled={currentStepIndex === 0}
                className="rounded-full"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "rounded-full",
                  !isPlaying && exercise.color === "blue" && "border-blue-500 text-blue-500",
                  !isPlaying && exercise.color === "purple" && "border-purple-500 text-purple-500",
                  !isPlaying && exercise.color === "green" && "border-green-500 text-green-500",
                  !isPlaying && exercise.color === "orange" && "border-orange-500 text-orange-500"
                )}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={resetSession}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateToStep(currentStepIndex + 1)}
                disabled={currentStepIndex >= exercise.steps.length - 1}
                className="rounded-full"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="steps" className="mt-2">
          <ScrollArea className="h-[350px]">
            <div className="space-y-3">
              {exercise.steps.map((step, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "p-3 cursor-pointer transition-all",
                    currentStepIndex === index && "border-2",
                    currentStepIndex === index && exercise.color === "blue" && "border-blue-500",
                    currentStepIndex === index && exercise.color === "purple" && "border-purple-500",
                    currentStepIndex === index && exercise.color === "green" && "border-green-500",
                    currentStepIndex === index && exercise.color === "orange" && "border-orange-500",
                    completedSteps.includes(index) && "bg-gray-50"
                  )}
                  onClick={() => {
                    navigateToStep(index);
                    setActiveTab("practice");
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5",
                      completedSteps.includes(index) ? "bg-green-100 text-green-600" : "bg-gray-100"
                    )}>
                      {completedSteps.includes(index) ? "✓" : index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{step.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{step.instruction}</p>
                      <p className="text-xs mt-1">
                        <Timer className="h-3 w-3 inline mr-1" />
                        {step.duration} seconds
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => setActiveTab("practice")}
              className={cn(
                exercise.color === "blue" && "bg-blue-500 hover:bg-blue-600",
                exercise.color === "purple" && "bg-purple-500 hover:bg-purple-600",
                exercise.color === "green" && "bg-green-500 hover:bg-green-600",
                exercise.color === "orange" && "bg-orange-500 hover:bg-orange-600"
              )}
            >
              Return to Practice
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
