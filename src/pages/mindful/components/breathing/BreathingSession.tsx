import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, RotateCcw, Bell, Heart, Info, Settings, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BreathingExerciseType, ProgressLogItem } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
import BreathingCircle from "./components/BreathingCircle";
import BreathingControls from "./components/BreathingControls";
import BreathingProgress from "./components/BreathingProgress";
import BreathingFeedback from "./components/BreathingFeedback";
interface BreathingSessionProps {
  exercise: BreathingExerciseType;
  onClose: () => void;
}
export default function BreathingSession({
  exercise,
  onClose
}: BreathingSessionProps) {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState("inhale");
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration * 60);
  const [breathCount, setBreathCount] = useState(0);
  const [circleSize, setCircleSize] = useState(150);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [volume, setVolume] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const exerciseCompletedToastRef = useRef(false);
  const exerciseLoggedToastRef = useRef(false);
  const [progressLog, setProgressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  const breathingTimerRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambAudioRef = useRef<HTMLAudioElement | null>(null);
  const [avgBreathDuration, setAvgBreathDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const lastBreathTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    bellAudioRef.current = new Audio("/bell-sound.mp3");
    bellAudioRef.current.volume = volume / 100;
    ambAudioRef.current = new Audio("/mindful-breath.mp3");
    ambAudioRef.current.loop = true;
    ambAudioRef.current.volume = volume / 100;
    if (soundEnabled && isPlaying && !isCompleted) {
      ambAudioRef.current.play().catch(err => console.error("Ambient sound playback error:", err));
    }
    return () => {
      clearAllTimers();
      if (bellAudioRef.current) {
        bellAudioRef.current.pause();
        bellAudioRef.current = null;
      }
      if (ambAudioRef.current) {
        ambAudioRef.current.pause();
        ambAudioRef.current.currentTime = 0;
        ambAudioRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (bellAudioRef.current) {
      bellAudioRef.current.volume = volume / 100;
    }
    if (ambAudioRef.current) {
      ambAudioRef.current.volume = volume / 100;
    }
  }, [volume]);
  useEffect(() => {
    if (!ambAudioRef.current) return;
    if (!isCompleted && isPlaying && soundEnabled) {
      ambAudioRef.current.loop = true;
      ambAudioRef.current.currentTime = 0;
      ambAudioRef.current.play().catch(err => console.error("Ambient sound playback error:", err));
    } else {
      ambAudioRef.current.pause();
      ambAudioRef.current.currentTime = 0;
    }
  }, [isPlaying, soundEnabled, isCompleted]);
  useEffect(() => {
    if (isCompleted && ambAudioRef.current) {
      ambAudioRef.current.pause();
      ambAudioRef.current.currentTime = 0;
    }
  }, [isCompleted]);
  const clearAllTimers = () => {
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
  const playBellSound = useCallback(() => {
    if (bellAudioRef.current && soundEnabled) {
      bellAudioRef.current.currentTime = 0;
      bellAudioRef.current.play().catch(e => {
        console.error("Bell sound error:", e);
      });
    }
  }, [soundEnabled]);
  const logCompletedSession = useCallback((duration: number) => {
    if (exerciseLoggedToastRef.current) return;
    exerciseLoggedToastRef.current = true;
    const newSession: ProgressLogItem = {
      id: uuidv4(),
      date: new Date().toISOString(),
      exerciseId: exercise.id,
      exerciseType: "breathing",
      duration: duration
    };
    setProgressLog(prev => [...prev, newSession]);
    toast({
      title: "Exercise Logged",
      description: `${exercise.name} exercise completed and saved to your progress.`
    });
  }, [exercise.id, exercise.name, setProgressLog]);
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (isCompleted || !isPlaying) return;
    timerIntervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearAllTimers();
          setIsPlaying(false);
          setIsCompleted(true);
          if (!exerciseCompletedToastRef.current) {
            setShowCompletionAnimation(true);
            playBellSound();
            logCompletedSession(Math.round(exercise.duration * 60 / 60));
            exerciseCompletedToastRef.current = true;
            setTimeout(() => {
              setShowCompletionAnimation(false);
              toast({
                title: "Exercise Complete",
                description: `Great job! You've completed ${exercise.name} with ${breathCount} breaths.`
              });
            }, 3000);
          }
          return 0;
        }
        return prev - 1;
      });
      setCaloriesBurned(prev => prev + 1.5 / 60);
    }, 1000);
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isPlaying, exercise.duration, breathCount, playBellSound, isCompleted, logCompletedSession, exercise.name]);
  useEffect(() => {
    if (isCompleted || !isPlaying) {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
      return;
    }
    let cancelled = false;
    function breathingCycle() {
      if (isCompleted || cancelled) return;
      setCurrentStep("inhale");
      setCircleSize(250);
      const now = Date.now();
      const breathDuration = (now - lastBreathTimeRef.current) / 1000;
      if (breathCount > 0 && breathDuration < 30) {
        setAvgBreathDuration(prev => {
          const newAvg = (prev * (breathCount - 1) + breathDuration) / breathCount;
          return newAvg;
        });
      }
      lastBreathTimeRef.current = now;
      if (breathCount > 0) playBellSound();
      if (isCompleted) return;
      breathingTimerRef.current = window.setTimeout(() => {
        if (isCompleted || cancelled) return;
        setCurrentStep("hold-in");
        breathingTimerRef.current = window.setTimeout(() => {
          if (isCompleted || cancelled) return;
          setCurrentStep("exhale");
          setCircleSize(150);
          breathingTimerRef.current = window.setTimeout(() => {
            if (isCompleted || cancelled) return;
            setCurrentStep("hold-out");
            breathingTimerRef.current = window.setTimeout(() => {
              if (isCompleted || cancelled) return;
              setBreathCount(prev => prev + 1);
              breathingCycle();
            }, (exercise.pattern.holdOut || 0) * 1000);
          }, exercise.pattern.exhale * 1000);
        }, (exercise.pattern.holdIn || 0) * 1000);
      }, exercise.pattern.inhale * 1000);
    }
    breathingCycle();
    return () => {
      cancelled = true;
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
    };
  }, [isPlaying, exercise.pattern, breathCount, playBellSound, isCompleted]);
  const resetSession = () => {
    clearAllTimers();
    setTimeRemaining(exercise.duration * 60);
    setBreathCount(0);
    setCurrentStep("inhale");
    setCircleSize(150);
    setIsPlaying(true);
    setAvgBreathDuration(0);
    setCaloriesBurned(0);
    setIsCompleted(false);
    exerciseCompletedToastRef.current = false;
    exerciseLoggedToastRef.current = false;
    lastBreathTimeRef.current = Date.now();
    setShowCompletionAnimation(false);
    if (ambAudioRef.current && soundEnabled) {
      ambAudioRef.current.currentTime = 0;
      ambAudioRef.current.loop = true;
      ambAudioRef.current.play().catch(err => console.error("Ambient sound playback error (reset):", err));
    }
  };
  const togglePlayPause = () => {
    if (isCompleted) return;
    setIsPlaying(prev => !prev);
  };
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  const getPatternDescription = () => {
    let description = `Inhale for ${exercise.pattern.inhale} seconds`;
    if (exercise.pattern.holdIn && exercise.pattern.holdIn > 0) {
      description += `, hold for ${exercise.pattern.holdIn} seconds`;
    }
    description += `, exhale for ${exercise.pattern.exhale} seconds`;
    if (exercise.pattern.holdOut && exercise.pattern.holdOut > 0) {
      description += `, then rest for ${exercise.pattern.holdOut} seconds before repeating`;
    } else {
      description += ` before repeating`;
    }
    return description;
  };
  const renderBenefits = () => {
    const commonBenefits = ["Reduces stress and anxiety", "Improves focus and concentration", "Helps lower blood pressure", "Promotes better sleep quality"];
    const specificBenefits: {
      [key: string]: string[];
    } = {
      "box-breathing": ["Used by Navy SEALs for stress management", "Creates mental clarity in high-pressure situations", "Balances oxygen and CO2 levels"],
      "4-7-8-breathing": ["Acts as a natural tranquilizer for the nervous system", "Particularly effective for falling asleep", "Can help reduce anger responses"],
      "deep-breathing": ["Activates the parasympathetic nervous system", "Increases oxygen supply to the brain", "Strengthens diaphragm muscles"]
    };
    const benefits = [...(specificBenefits[exercise.id] || []), ...commonBenefits];
    return <ul className="space-y-2 mt-4">
        {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-2">
            <div className={cn("rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0 mt-0.5", exercise.color === "blue" && "bg-blue-100 text-blue-600", exercise.color === "purple" && "bg-purple-100 text-purple-600", exercise.color === "green" && "bg-green-100 text-green-600")}>
              ✓
            </div>
            <span className="text-sm">{benefit}</span>
          </li>)}
      </ul>;
  };
  return <div className="flex flex-col items-center h-full max-h-[calc(100vh-160px)] overflow-auto">
      <div className="w-full sticky top-0 bg-background z-10 flex items-center justify-between mb-4 p-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {exercise.level}
          </Badge>
          <h2 className="text-lg md:text-xl font-semibold">{exercise.name}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="w-full flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="statistics">Stats</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <div className="overflow-auto h-full">
            <TabsContent value="practice" className="mt-0 h-full relative">
              <div className="flex flex-col items-center">
                <div className="w-full">
                  <BreathingCircle currentStep={currentStep} circleSize={circleSize} exercise={exercise} />
                </div>
                
                {showGuide && !isCompleted && <BreathingFeedback currentStep={currentStep} remainingTime={timeRemaining} color={exercise.color} />}
                
                <div className="text-center w-full max-w-md px-4 mt-1 pb-20">
                  <BreathingProgress timeRemaining={timeRemaining} totalDuration={exercise.duration * 60} breathCount={breathCount} color={exercise.color} />
                  
                  <BreathingControls isPlaying={isPlaying} onPlayPause={togglePlayPause} onReset={resetSession} onBell={playBellSound} color={exercise.color} />
                  
                  <div className="mt-2 flex justify-center">
                    
                  </div>
                </div>
                
                <AnimatePresence>
                  {showCompletionAnimation && <motion.div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-20" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }}>
                      <motion.div initial={{
                    scale: 0.8,
                    opacity: 0
                  }} animate={{
                    scale: [0.8, 1.2, 1],
                    opacity: 1
                  }} exit={{
                    scale: 1.5,
                    opacity: 0
                  }} transition={{
                    duration: 2
                  }}>
                        <Heart className={cn("h-16 w-16", exercise.color === "blue" ? "text-blue-500" : exercise.color === "purple" ? "text-purple-500" : "text-green-500")} />
                      </motion.div>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-0 px-4 pb-20">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Breath Count</CardTitle>
                    <CardDescription>Total breaths in this session</CardDescription>
                    <div className={cn("text-3xl font-bold mt-2", exercise.color === "blue" && "text-blue-600", exercise.color === "purple" && "text-purple-600", exercise.color === "green" && "text-green-600")}>
                      {breathCount}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Time Elapsed</CardTitle>
                    <CardDescription>Session duration</CardDescription>
                    <div className={cn("text-3xl font-bold mt-2", exercise.color === "blue" && "text-blue-600", exercise.color === "purple" && "text-purple-600", exercise.color === "green" && "text-green-600")}>
                      {Math.floor((exercise.duration * 60 - timeRemaining) / 60)}:{((exercise.duration * 60 - timeRemaining) % 60).toString().padStart(2, '0')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Avg Breath Cycle</CardTitle>
                    <CardDescription>Average seconds per breath</CardDescription>
                    <div className={cn("text-3xl font-bold mt-2", exercise.color === "blue" && "text-blue-600", exercise.color === "purple" && "text-purple-600", exercise.color === "green" && "text-green-600")}>
                      {avgBreathDuration.toFixed(1)}s
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="text-lg mb-1">Calories</CardTitle>
                    <CardDescription>Estimated calories burned</CardDescription>
                    <div className={cn("text-3xl font-bold mt-2", exercise.color === "blue" && "text-blue-600", exercise.color === "purple" && "text-purple-600", exercise.color === "green" && "text-green-600")}>
                      {Math.round(caloriesBurned)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg mb-1">Efficiency</CardTitle>
                      <CardDescription>How well you're following the pattern</CardDescription>
                    </div>
                    <div className={cn("text-sm font-medium px-2 py-1 rounded", breathCount >= 10 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                      {breathCount >= 10 ? "Excellent" : breathCount >= 5 ? "Good" : "Learning"}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Breathing rhythm</span>
                      <span className="font-medium">{getPatternDescription()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Consistency</span>
                      <span className="font-medium">
                        {breathCount > 3 ? Math.min(100, Math.round(100 - Math.abs(avgBreathDuration - (exercise.pattern.inhale + (exercise.pattern.holdIn || 0) + exercise.pattern.exhale + (exercise.pattern.holdOut || 0))) * 5)) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="mt-0 px-4 pb-20">
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="text-xl mb-2">{exercise.name}</CardTitle>
                  <CardDescription className="text-base">{exercise.description}</CardDescription>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">How to practice</h3>
                    <p className="text-sm text-muted-foreground">{getPatternDescription()}</p>
                    
                    <h3 className="font-medium mt-4 mb-2">Benefits</h3>
                    {renderBenefits()}
                    
                    <h3 className="font-medium mt-4 mb-2">Tips</h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-muted-foreground">Find a comfortable seated position</li>
                      <li className="text-sm text-muted-foreground">Keep your back straight but not rigid</li>
                      <li className="text-sm text-muted-foreground">Try to breathe from your diaphragm, not your chest</li>
                      <li className="text-sm text-muted-foreground">If your mind wanders, gently bring it back to your breath</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>;
}