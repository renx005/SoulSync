import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BrainCircuit, 
  ArrowRight, 
  BarChart2, 
  CheckCheck, 
  Activity, 
  Brain, 
  Heart, 
  Clock, 
  CloudSun,
  RotateCcw 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { stressAnxietyQuiz, focusMoodQuiz, sleepEnergyQuiz, balanceQuiz } from "../../data/quizQuestions";
import { QuizAnswer, QuizQuestion, QuizRecommendation, QuizResult } from "../../types";
import QuizResults from "./QuizResults";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface MentalHealthQuizProps {
  onSessionChange?: (inSession: boolean) => void;
}

export default function MentalHealthQuiz({ onSessionChange }: MentalHealthQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizType, setQuizType] = useState<string>("stress-anxiety");
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  useEffect(() => {
    if (onSessionChange) {
      onSessionChange(quizStarted);
    }
  }, [quizStarted, onSessionChange]);
  
  const quizTypes = [
    {
      id: "stress-anxiety",
      title: "Stress & Anxiety",
      description: "Assess your current stress levels and anxiety symptoms",
      icon: Brain,
      color: "blue",
      questions: stressAnxietyQuiz
    },
    {
      id: "focus-mood",
      title: "Focus & Mood",
      description: "Evaluate your attention span and emotional well-being",
      icon: CloudSun,
      color: "purple",
      questions: focusMoodQuiz
    },
    {
      id: "sleep-energy",
      title: "Sleep & Energy",
      description: "Analyze your sleep quality and energy levels",
      icon: Clock,
      color: "green",
      questions: sleepEnergyQuiz
    },
    {
      id: "balance",
      title: "Life Balance",
      description: "Reflect on your overall life balance and fulfillment",
      icon: Heart,
      color: "orange",
      questions: balanceQuiz
    }
  ];
  
  const activeQuiz = quizTypes.find(q => q.id === quizType)?.questions || stressAnxietyQuiz;
  
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  };
  
  const handleAnswerSelect = (question: QuizQuestion, answerValue: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: question.id,
      category: question.category,
      value: answerValue
    };
    
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < activeQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };
  
  const calculateResults = (quizAnswers: QuizAnswer[]) => {
    const categories = [...new Set(quizAnswers.map(a => a.category))];
    const categoryScores = categories.map(category => {
      const categoryAnswers = quizAnswers.filter(a => a.category === category);
      const totalScore = categoryAnswers.reduce((sum, answer) => sum + answer.value, 0);
      const maxPossibleScore = categoryAnswers.length * 4;
      const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
      
      let level = "Low";
      if (percentageScore >= 75) level = "High";
      else if (percentageScore >= 40) level = "Moderate";
      
      return {
        category,
        score: percentageScore,
        level
      };
    });
    
    const recommendations: QuizRecommendation[] = [];
    
    const recommendationMap: Record<string, {
      high: { type: "breathing" | "mindfulness", ids: string[] },
      moderate: { type: "breathing" | "mindfulness", ids: string[] }
    }> = {
      "stress": {
        high: { type: "breathing", ids: ["box-breathing", "4-7-8-breathing"] },
        moderate: { type: "breathing", ids: ["deep-breathing"] }
      },
      "anxiety": {
        high: { type: "mindfulness", ids: ["body-scan", "progressive-muscle-relaxation"] },
        moderate: { type: "mindfulness", ids: ["mindful-breathing"] }
      },
      "focus": {
        high: { type: "mindfulness", ids: ["mindful-awareness", "present-moment"] },
        moderate: { type: "breathing", ids: ["focused-breathing"] }
      },
      "mood": {
        high: { type: "mindfulness", ids: ["loving-kindness", "gratitude-practice"] },
        moderate: { type: "mindfulness", ids: ["self-compassion"] }
      },
      "sleep": {
        high: { type: "breathing", ids: ["4-7-8-breathing"] },
        moderate: { type: "mindfulness", ids: ["body-scan"] }
      },
      "energy": {
        high: { type: "breathing", ids: ["energizing-breath"] },
        moderate: { type: "mindfulness", ids: ["present-moment"] }
      },
      "work-life": {
        high: { type: "mindfulness", ids: ["present-moment", "gratitude-practice"] },
        moderate: { type: "breathing", ids: ["deep-breathing"] }
      },
      "social": {
        high: { type: "mindfulness", ids: ["loving-kindness"] },
        moderate: { type: "mindfulness", ids: ["self-compassion"] }
      }
    };
    
    categoryScores.forEach(score => {
      const categoryRecs = recommendationMap[score.category];
      if (!categoryRecs) return;
      
      if (score.score >= 75) {
        recommendations.push({
          category: score.category,
          exerciseType: categoryRecs.high.type,
          exerciseIds: categoryRecs.high.ids
        });
      } else if (score.score >= 40) {
        recommendations.push({
          category: score.category,
          exerciseType: categoryRecs.moderate.type,
          exerciseIds: categoryRecs.moderate.ids
        });
      }
    });
    
    setQuizResult({
      categoryScores,
      recommendations,
      date: new Date().toISOString()
    });
    
    setQuizCompleted(true);
  };
  
  if (quizCompleted && quizResult) {
    return (
      <QuizResults 
        result={quizResult} 
        onRetakeQuiz={startQuiz}
        quizType={quizType}
      />
    );
  }
  
  if (!quizStarted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-mindscape-primary" />
            Mental Health Assessments
          </h2>
          <span className="text-xs text-muted-foreground">Select a quiz</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quizTypes.map((quiz) => (
            <Card 
              key={quiz.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border border-border/50",
                quiz.color === "blue" && "bg-gradient-to-br from-blue-50/40 to-transparent",
                quiz.color === "purple" && "bg-gradient-to-br from-purple-50/40 to-transparent",
                quiz.color === "green" && "bg-gradient-to-br from-green-50/40 to-transparent",
                quiz.color === "orange" && "bg-gradient-to-br from-orange-50/40 to-transparent"
              )}
              onClick={() => {
                setQuizType(quiz.id);
                startQuiz();
              }}
            >
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold">{quiz.title}</CardTitle>
                  <div 
                    className={cn(
                      "rounded-full p-1.5",
                      quiz.color === "blue" && "bg-blue-100/60 text-blue-600",
                      quiz.color === "purple" && "bg-purple-100/60 text-purple-600",
                      quiz.color === "green" && "bg-green-100/60 text-green-600",
                      quiz.color === "orange" && "bg-orange-100/60 text-orange-600"
                    )}
                  >
                    <quiz.icon className="h-4 w-4" />
                  </div>
                </div>
                <CardDescription className="text-xs mt-1">{quiz.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 pb-4 px-4">
                <div className="text-xs flex justify-between items-center w-full">
                  <span className="text-muted-foreground">{quiz.questions.length} questions</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-mindscape-primary">
                    Start
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  const currentQuestion = activeQuiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeQuiz.length) * 100;
  
  const currentQuizType = quizTypes.find(q => q.id === quizType);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium flex items-center gap-2">
          <div 
            className={cn(
              "rounded-full p-1",
              currentQuizType?.color === "blue" && "bg-blue-100/50 text-blue-600",
              currentQuizType?.color === "purple" && "bg-purple-100/50 text-purple-600",
              currentQuizType?.color === "green" && "bg-green-100/50 text-green-600",
              currentQuizType?.color === "orange" && "bg-orange-100/50 text-orange-600"
            )}
          >
            {currentQuizType?.icon && <currentQuizType.icon className="h-3.5 w-3.5" />}
          </div>
          {currentQuizType?.title} Assessment
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs" 
          onClick={() => setQuizStarted(false)}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Back
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">
          Question {currentQuestionIndex + 1} of {activeQuiz.length}
        </span>
        <span className="text-xs font-medium">
          {Math.round(progress)}% complete
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-1.5 mb-4"
        indicatorClassName={cn(
          currentQuizType?.color === "blue" && "bg-blue-600",
          currentQuizType?.color === "purple" && "bg-purple-600",
          currentQuizType?.color === "green" && "bg-green-600",
          currentQuizType?.color === "orange" && "bg-orange-600",
          !currentQuizType?.color && "bg-mindscape-primary"
        )}
      />
      
      <Card className="border border-border/50">
        <CardHeader className="px-4 py-3 pb-2">
          <CardTitle className="text-base">{currentQuestion.text}</CardTitle>
          <CardDescription className="text-xs">{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 0, label: "Not at all" },
              { value: 1, label: "A little bit" },
              { value: 2, label: "Moderately" },
              { value: 3, label: "Quite a bit" },
              { value: 4, label: "Extremely" }
            ].map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={cn(
                  "justify-between h-auto py-2.5 px-3 border-border/50 text-sm",
                  answers[currentQuestionIndex]?.value === option.value && 
                  cn(
                    "border-border bg-background",
                    currentQuizType?.color === "blue" && "border-blue-600/40 bg-blue-50/30",
                    currentQuizType?.color === "purple" && "border-purple-600/40 bg-purple-50/30",
                    currentQuizType?.color === "green" && "border-green-600/40 bg-green-50/30",
                    currentQuizType?.color === "orange" && "border-orange-600/40 bg-orange-50/30",
                    !currentQuizType?.color && "border-mindscape-primary bg-mindscape-light/40"
                  )
                )}
                onClick={() => handleAnswerSelect(currentQuestion, option.value)}
              >
                <span>{option.label}</span>
                {answers[currentQuestionIndex]?.value === option.value && (
                  <CheckCheck className={cn(
                    "h-4 w-4",
                    currentQuizType?.color === "blue" && "text-blue-600",
                    currentQuizType?.color === "purple" && "text-purple-600",
                    currentQuizType?.color === "green" && "text-green-600",
                    currentQuizType?.color === "orange" && "text-orange-600",
                    !currentQuizType?.color && "text-mindscape-primary"
                  )} />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
