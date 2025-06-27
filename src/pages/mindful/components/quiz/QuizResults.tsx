
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit, RotateCcw, Play, ArrowRight, Brain, Heart, Clock, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizResult, QuizRecommendation } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { breathingExercises } from "../../data/breathingExercises";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";

interface QuizResultsProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  quizType: string;
}

export default function QuizResults({ result, onRetakeQuiz, quizType }: QuizResultsProps) {
  const [activeTab, setActiveTab] = useState("results");
  
  const quizTypeInfo = {
    "stress-anxiety": {
      title: "Stress & Anxiety Assessment",
      icon: Brain,
      color: "blue"
    },
    "focus-mood": {
      title: "Focus & Mood Assessment",
      icon: CloudSun,
      color: "purple"
    },
    "sleep-energy": {
      title: "Sleep & Energy Assessment",
      icon: Clock,
      color: "green"
    },
    "balance": {
      title: "Life Balance Assessment",
      icon: Heart,
      color: "orange"
    }
  };
  
  const currentQuizInfo = quizTypeInfo[quizType as keyof typeof quizTypeInfo] || quizTypeInfo["stress-anxiety"];
  
  const getColorForScore = (score: number, category: string) => {
    // For focus, energy, social - higher is better
    const inversedCategories = ["focus", "energy", "social", "work-life"];
    const isInversed = inversedCategories.includes(category);
    
    if (isInversed) {
      if (score >= 70) return "green";
      if (score >= 40) return "yellow";
      return "red";
    } else {
      // For stress, anxiety, etc. - lower is better
      if (score < 30) return "green";
      if (score < 60) return "yellow";
      return "red";
    }
  };
  
  const getTextColorForLevel = (level: string, category: string) => {
    // For focus, energy, social - higher is better
    const inversedCategories = ["focus", "energy", "social", "work-life"];
    const isInversed = inversedCategories.includes(category);
    
    if (isInversed) {
      if (level === "High") return "text-green-600";
      if (level === "Moderate") return "text-yellow-600";
      return "text-red-600";
    } else {
      // For stress, anxiety, etc. - lower is better
      if (level === "Low") return "text-green-600";
      if (level === "Moderate") return "text-yellow-600";
      return "text-red-600";
    }
  };
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "stress": return "Stress";
      case "anxiety": return "Anxiety";
      case "mood": return "Mood";
      case "focus": return "Focus";
      case "sleep": return "Sleep Quality";
      case "energy": return "Energy Levels";
      case "work-life": return "Work-Life Balance";
      case "social": return "Social Connection";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  const getCategoryDescription = (category: string, level: string) => {
    const descriptions = {
      "stress": {
        "High": "You're experiencing significant stress that may be affecting your daily life.",
        "Moderate": "You're handling some stress, but have room for improvement in stress management.",
        "Low": "Your stress levels appear to be well-managed."
      },
      "anxiety": {
        "High": "You're experiencing notable anxiety symptoms that may benefit from attention.",
        "Moderate": "You have some anxiety symptoms that could be addressed.",
        "Low": "Your anxiety levels appear to be well-managed."
      },
      "mood": {
        "High": "Your mood patterns show some challenges that may benefit from attention.",
        "Moderate": "Your mood is relatively stable with some fluctuations.",
        "Low": "Your mood appears to be stable and positive."
      },
      "focus": {
        "High": "You're maintaining good focus and attention.",
        "Moderate": "You have moderate ability to maintain focus.",
        "Low": "You may be experiencing some challenges with focus and attention."
      },
      "sleep": {
        "High": "Your sleep quality appears to be compromised.",
        "Moderate": "Your sleep quality is adequate but could be improved.",
        "Low": "You appear to have healthy sleep patterns."
      },
      "energy": {
        "High": "You have good energy levels throughout the day.",
        "Moderate": "Your energy levels are adequate but fluctuate.",
        "Low": "You may be experiencing low energy or fatigue."
      },
      "work-life": {
        "High": "You maintain a healthy balance between work and personal life.",
        "Moderate": "You have some balance but it could be improved.",
        "Low": "You may be experiencing challenges with work-life boundaries."
      },
      "social": {
        "High": "You have strong social connections and support.",
        "Moderate": "You have some social connection but could benefit from more.",
        "Low": "You may be experiencing social isolation or disconnection."
      }
    };
    
    // Return description if it exists, otherwise return generic message
    return descriptions[category as keyof typeof descriptions]?.[level as keyof typeof descriptions["stress"]] || 
      "No specific description available.";
  };
  
  const getExercisesFromRecommendation = (recommendation: QuizRecommendation) => {
    const allExercises = recommendation.exerciseType === "breathing" 
      ? breathingExercises 
      : mindfulnessExercises;
      
    return allExercises.filter(ex => recommendation.exerciseIds.includes(ex.id));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium flex items-center gap-2">
          <div 
            className={cn(
              "rounded-full p-1",
              currentQuizInfo.color === "blue" && "bg-blue-100/50 text-blue-600",
              currentQuizInfo.color === "purple" && "bg-purple-100/50 text-purple-600",
              currentQuizInfo.color === "green" && "bg-green-100/50 text-green-600",
              currentQuizInfo.color === "orange" && "bg-orange-100/50 text-orange-600"
            )}
          >
            <currentQuizInfo.icon className="h-3.5 w-3.5" />
          </div>
          {currentQuizInfo.title}
        </h2>
        <span className="text-xs text-muted-foreground">
          {format(new Date(result.date), "MMM d, yyyy")}
        </span>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex w-full h-auto bg-muted/30 rounded-lg p-1">
          <TabsTrigger 
            value="results" 
            className="flex-1 py-1.5 rounded-md data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            Results
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className="flex-1 py-1.5 rounded-md data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="mt-4 space-y-4">
          <Card className="border border-border/50">
            <CardHeader className="px-4 py-3 pb-2">
              <CardTitle className="text-base">Your Mental Health Profile</CardTitle>
              <CardDescription className="text-xs">
                Based on your responses, here's a summary of your current state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-3">
              {result.categoryScores.map((categoryScore) => {
                const colorName = getColorForScore(categoryScore.score, categoryScore.category);
                const textColorClass = getTextColorForLevel(categoryScore.level, categoryScore.category);
                
                return (
                  <div key={categoryScore.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{getCategoryTitle(categoryScore.category)}</span>
                      <span className={cn(
                        "text-xs font-medium",
                        textColorClass
                      )}>
                        {categoryScore.level}
                      </span>
                    </div>
                    <Progress 
                      value={categoryScore.score} 
                      className="h-2"
                      indicatorClassName={cn(
                        colorName === "green" && "bg-green-500",
                        colorName === "yellow" && "bg-yellow-500",
                        colorName === "red" && "bg-red-500"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      {getCategoryDescription(categoryScore.category, categoryScore.level)}
                    </p>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="px-4 py-3 pt-2 border-t border-border/50">
              <Button 
                onClick={onRetakeQuiz}
                variant="outline"
                size="sm"
                className="w-full text-xs h-8"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retake Assessment
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-mindscape-primary" />
              Recommended Exercises
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => setActiveTab("results")}
            >
              View Results
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">
            Based on your assessment, we recommend these exercises to support your mental wellbeing:
          </p>
          
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {result.recommendations.length > 0 ? (
                result.recommendations.map((recommendation, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-mindscape-primary"></div>
                      For {getCategoryTitle(recommendation.category)}:
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {getExercisesFromRecommendation(recommendation).map((exercise) => (
                        <Card 
                          key={exercise.id}
                          className={cn(
                            "overflow-hidden border border-border/50",
                            exercise.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
                            exercise.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
                            exercise.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent",
                            exercise.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent"
                          )}
                        >
                          <CardHeader className="px-3 py-2.5 pb-1">
                            <CardTitle className="text-sm font-medium">{exercise.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">{exercise.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="px-3 py-2 pt-0 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{exercise.duration} min</span>
                            <Button 
                              variant="link"
                              size="sm"
                              className={cn(
                                "p-0 h-auto text-xs",
                                exercise.color === "blue" && "text-blue-600",
                                exercise.color === "purple" && "text-purple-600",
                                exercise.color === "green" && "text-green-600",
                                exercise.color === "orange" && "text-orange-600"
                              )}
                            >
                              Go to exercise
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <Card className="border border-border/50">
                  <CardContent className="py-8 px-4 text-center">
                    <p className="text-muted-foreground text-sm">Great job! No specific recommendations needed based on your results.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
