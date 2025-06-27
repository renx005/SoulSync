
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BreathingExercise from "./components/BreathingExercise";
import MindfulnessExercise from "./components/MindfulnessExercise";
import MindfulProgress from "./components/MindfulProgress";
import { useUser } from "@/contexts/UserContext";

interface MindfulExercise {
  id: string;
  type: "breathing" | "mindfulness";
  name: string;
  description: string;
  duration: number; // in seconds
  steps?: string[];
  breathPattern?: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
}

interface BreathingExerciseType {
  id: string;
  name: string;
  description: string;
  duration: number;
  breathPattern: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
}

interface CompletedExercise {
  id: string;
  exerciseId: string;
  type: "breathing" | "mindfulness";
  name: string;
  duration: number;
  completed: string; // ISO date string
}

export default function MindfulPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [exercises, setExercises] = useState<MindfulExercise[]>([]);
  const [activeTab, setActiveTab] = useState<string>("breathing");
  const [selectedExercise, setSelectedExercise] = useState<MindfulExercise | null>(null);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate a storage key based on user ID or use a default
  const getStorageKey = () => {
    if (user?.id) {
      return `soulsync_completed_exercises_${user.id}`;
    }
    return 'soulsync_completed_exercises';
  };

  useEffect(() => {
    const loadExercises = () => {
      try {
        const breathingExercises: MindfulExercise[] = [
          {
            id: "box-breathing",
            type: "breathing",
            name: "Box Breathing",
            description: "A technique used to calm the nervous system. Inhale, hold, exhale, and hold for equal counts.",
            duration: 300,
            breathPattern: {
              inhale: 4,
              hold1: 4,
              exhale: 4,
              hold2: 4
            }
          },
          {
            id: "4-7-8-breathing",
            type: "breathing",
            name: "4-7-8 Breathing",
            description: "A relaxation technique that can help reduce anxiety and help you fall asleep.",
            duration: 300,
            breathPattern: {
              inhale: 4,
              hold1: 7,
              exhale: 8
            }
          },
          {
            id: "deep-breathing",
            type: "breathing",
            name: "Deep Breathing",
            description: "Simple deep breathing for stress relief and increased oxygen flow.",
            duration: 180,
            breathPattern: {
              inhale: 5,
              exhale: 6
            }
          }
        ];

        const mindfulnessExercises: MindfulExercise[] = [
          {
            id: "body-scan",
            type: "mindfulness",
            name: "Body Scan",
            description: "A practice that involves paying attention to parts of the body and bodily sensations in a gradual sequence.",
            duration: 600,
            steps: [
              "Find a comfortable position sitting or lying down.",
              "Close your eyes and bring awareness to your body.",
              "Start with your feet and slowly move up through your body.",
              "Notice any sensations, tensions, or feelings in each area.",
              "If you find tension, breathe into it and allow it to soften."
            ]
          },
          {
            id: "mindful-listening",
            type: "mindfulness",
            name: "Mindful Listening",
            description: "Practice focusing completely on sounds without judging them.",
            duration: 300,
            steps: [
              "Find a comfortable seated position.",
              "Close your eyes and take a few deep breaths.",
              "Begin to notice the sounds around you.",
              "Don't label or judge the sounds, just observe them.",
              "If your mind wanders, gently bring it back to the sounds."
            ]
          },
          {
            id: "loving-kindness",
            type: "mindfulness",
            name: "Loving-Kindness Meditation",
            description: "A practice of directing well wishes toward yourself and others.",
            duration: 480,
            steps: [
              "Find a comfortable seated position.",
              "Begin by focusing on your breath.",
              "Direct loving thoughts toward yourself: 'May I be happy. May I be healthy.'",
              "Extend these wishes to someone you care about.",
              "Gradually extend to acquaintances, difficult people, and all beings."
            ]
          }
        ];

        setExercises([...breathingExercises, ...mindfulnessExercises]);
        setLoading(false);
      } catch (error) {
        console.error("Error loading exercises:", error);
        setError("Failed to load exercises. Please try refreshing the page.");
        setLoading(false);
      }
    };

    const loadCompletedExercises = () => {
      try {
        const storageKey = getStorageKey();
        const storedExercises = localStorage.getItem(storageKey);
        
        if (storedExercises) {
          const parsed = JSON.parse(storedExercises);
          if (Array.isArray(parsed)) {
            setCompletedExercises(parsed);
          }
        }
      } catch (error) {
        console.error("Error parsing completed exercises:", error);
        toast({
          title: "Error",
          description: "Failed to load your progress. Your data may be corrupted.",
          variant: "destructive",
        });
      }
    };

    loadExercises();
    loadCompletedExercises();
  }, [user, toast]);

  // Save completed exercises to localStorage whenever they change
  useEffect(() => {
    if (completedExercises.length > 0) {
      try {
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(completedExercises));
        
        // Trigger a storage event to inform other tabs
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error("Error saving completed exercises:", error);
        toast({
          title: "Error saving progress",
          description: "Failed to save your progress. Please check your browser storage settings.",
          variant: "destructive",
        });
      }
    }
  }, [completedExercises, toast]);

  const handleSelectExercise = (exercise: MindfulExercise) => {
    setSelectedExercise(exercise);
  };

  const handleStartExercise = () => {
    if (selectedExercise) {
      setIsExerciseStarted(true);
    } else {
      toast({
        title: "No exercise selected",
        description: "Please select an exercise to begin",
        variant: "destructive"
      });
    }
  };

  const handleCompleteExercise = () => {
    if (selectedExercise) {
      try {
        const newCompletedExercise: CompletedExercise = {
          id: crypto.randomUUID(),
          exerciseId: selectedExercise.id,
          type: selectedExercise.type,
          name: selectedExercise.name,
          duration: selectedExercise.duration,
          completed: new Date().toISOString()
        };

        setCompletedExercises(prev => [newCompletedExercise, ...prev]);
        
        toast({
          title: "Exercise complete",
          description: `You completed ${selectedExercise.name} exercise.`,
        });

        setIsExerciseStarted(false);
        setSelectedExercise(null);
      } catch (error) {
        console.error("Error completing exercise:", error);
        toast({
          title: "Error",
          description: "Failed to save your completed exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBackToSelection = () => {
    setIsExerciseStarted(false);
    setSelectedExercise(null);
  };

  const filteredExercises = exercises.filter(ex => ex.type === activeTab);

  // If there's an error loading exercises
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center space-y-4">
          <div className="bg-red-100 p-3 rounded-full inline-block mb-2">
            <Flame className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-semibold mb-4">Mindfulness</h1>
      
      <Tabs defaultValue="breathing" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindful</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breathing" className="h-full">
          {isExerciseStarted && selectedExercise ? (
            <BreathingExercise 
              exercise={{
                id: selectedExercise.id,
                name: selectedExercise.name,
                description: selectedExercise.description,
                duration: selectedExercise.duration,
                breathPattern: selectedExercise.breathPattern || {
                  inhale: 4,
                  hold1: 0,
                  exhale: 4,
                  hold2: 0
                }
              }}
              onComplete={handleCompleteExercise} 
              onBack={handleBackToSelection}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Breathing exercises can help reduce stress, increase focus, and improve emotional well-being.
              </p>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-290px)]">
                  <div className="space-y-4 pr-4">
                    {filteredExercises.map((exercise) => (
                      <Card 
                        key={exercise.id}
                        className={`hover:border-primary transition-all cursor-pointer ${
                          selectedExercise?.id === exercise.id ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{exercise.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                              <p className="text-xs text-primary mt-2">{Math.floor(exercise.duration / 60)} min</p>
                            </div>
                            
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Flame className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedExercise}
                  onClick={handleStartExercise}
                >
                  Start Exercise
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mindfulness" className="h-full">
          {isExerciseStarted && selectedExercise ? (
            <MindfulnessExercise 
              exercise={selectedExercise} 
              onComplete={handleCompleteExercise} 
              onBack={handleBackToSelection}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Mindfulness exercises help you focus on the present moment, reduce rumination, and improve mental clarity.
              </p>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-290px)]">
                  <div className="space-y-4 pr-4">
                    {filteredExercises.map((exercise) => (
                      <Card 
                        key={exercise.id}
                        className={`hover:border-primary transition-all cursor-pointer ${
                          selectedExercise?.id === exercise.id ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{exercise.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                              <p className="text-xs text-primary mt-2">{Math.floor(exercise.duration / 60)} min</p>
                            </div>
                            
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Flame className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedExercise}
                  onClick={handleStartExercise}
                >
                  Start Exercise
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="progress">
          <MindfulProgress completedExercises={completedExercises} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
