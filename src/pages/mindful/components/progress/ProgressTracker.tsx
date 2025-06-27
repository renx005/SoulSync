
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, Trophy, Target, Clock, Activity, CheckCircle2, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format, subDays, isToday, isYesterday, parseISO } from "date-fns";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ProgressLogItem, MindfulStat } from "../../types";
import { mindfulSummaryStats } from "../../data/summaryData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { breathingExercises } from "../../data/breathingExercises";
import { mindfulnessExercises } from "../../data/mindfulnessExercises";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProgressTracker() {
  const [progressLog, setProgressLog] = useLocalStorage<ProgressLogItem[]>("mindful-progress-log", []);
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage<number>("mindful-weekly-goal", 3);
  const [currentStreak, setCurrentStreak] = useLocalStorage<number>("mindful-current-streak", 0);
  const [bestStreak, setBestStreak] = useLocalStorage<number>("mindful-best-streak", 0);
  const [totalSessions, setTotalSessions] = useLocalStorage<number>("mindful-total-sessions", 0);
  const [totalMinutes, setTotalMinutes] = useLocalStorage<number>("mindful-total-minutes", 0);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Calculate current streak based on consecutive days with exercises
    const now = new Date();
    const dates = [...new Set(progressLog.map(log => log.date.split('T')[0]))].sort();
    
    if (dates.length === 0) {
      setCurrentStreak(0);
      return;
    }
    
    let streak = 0;
    const today = format(now, 'yyyy-MM-dd');
    
    // Check if there's an exercise today
    const hasExerciseToday = dates.includes(today);
    
    if (!hasExerciseToday) {
      // Check if there's an exercise yesterday
      const yesterday = format(subDays(now, 1), 'yyyy-MM-dd');
      if (!dates.includes(yesterday)) {
        setCurrentStreak(0);
        return;
      }
    }
    
    // Count back from today/yesterday to find the streak
    let checkDate = hasExerciseToday ? now : subDays(now, 1);
    let checking = true;
    
    while (checking) {
      const formattedDate = format(checkDate, 'yyyy-MM-dd');
      if (dates.includes(formattedDate)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        checking = false;
      }
    }
    
    setCurrentStreak(streak);
    
    if (streak > bestStreak) {
      setBestStreak(streak);
    }
    
    // Update total sessions and minutes
    setTotalSessions(progressLog.length);
    const minutes = progressLog.reduce((total, log) => total + log.duration, 0);
    setTotalMinutes(minutes);
    
  }, [progressLog, setBestStreak, setCurrentStreak, setTotalMinutes, setTotalSessions]);
  
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const sessionsThisWeek = progressLog.filter(log => 
      new Date(log.date) >= startOfWeek
    ).length;
    
    return Math.min((sessionsThisWeek / weeklyGoal) * 100, 100);
  };
  
  const weeklyProgress = calculateWeeklyProgress();
  
  const getExerciseName = (log: ProgressLogItem) => {
    if (log.exerciseType === "breathing") {
      const exercise = breathingExercises.find(ex => ex.id === log.exerciseId);
      return exercise?.name || "Unknown";
    } else {
      const exercise = mindfulnessExercises.find(ex => ex.id === log.exerciseId);
      return exercise?.name || "Unknown";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-mindscape-primary" />
          Your Progress
        </h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy")}</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-muted/30 rounded-lg p-1 h-auto">
          <TabsTrigger 
            value="overview" 
            className="flex-1 py-1.5 rounded-md data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex-1 py-1.5 rounded-md data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary"
          >
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="bg-gradient-to-br from-mindscape-light/30 to-transparent border-mindscape-primary/20">
            <CardHeader className="px-4 py-3 pb-2">
              <CardTitle className="text-base">Weekly Goal</CardTitle>
              <CardDescription className="text-xs">
                {weeklyProgress >= 100 
                  ? "Congratulations! You've met your weekly goal."
                  : `${weeklyGoal - Math.floor(weeklyGoal * (weeklyProgress / 100))} more sessions to reach your goal`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <Progress 
                value={weeklyProgress} 
                className="h-2.5"
                indicatorClassName="bg-mindscape-primary"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0/{weeklyGoal}</span>
                <span>{Math.floor(weeklyGoal/2)}/{weeklyGoal}</span>
                <span>{weeklyGoal}/{weeklyGoal}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-2.5">
            <Card className="border border-border/50">
              <CardHeader className="p-3 pb-1.5 space-y-0.5">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-mindscape-tertiary">{currentStreak}</span>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50">
              <CardHeader className="p-3 pb-1.5 space-y-0.5">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-mindscape-primary" />
                  Best Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-mindscape-tertiary">{bestStreak}</span>
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            <Card className="border border-border/50">
              <CardHeader className="p-3 pb-1.5 space-y-0.5">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-mindscape-tertiary">{totalSessions}</span>
                  <span className="text-xs text-muted-foreground">completed</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50">
              <CardHeader className="p-3 pb-1.5 space-y-0.5">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  Total Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-mindscape-tertiary">{totalMinutes}</span>
                  <span className="text-xs text-muted-foreground">minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-base font-semibold mt-2 flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-mindscape-primary" />
            Mindfulness Benefits
          </h3>
          
          <div className="bg-background/50 rounded-lg border border-border/50 p-0.5">
            <Accordion type="single" collapsible className="w-full">
              {mindfulSummaryStats.map((stat: MindfulStat, index) => (
                <AccordionItem key={stat.id} value={`item-${index}`} className="border-b border-border/30 last:border-b-0">
                  <AccordionTrigger className="py-2.5 px-3 hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center gap-2 text-left">
                      <div 
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          stat.color === "blue" && "bg-blue-100/50 text-blue-600",
                          stat.color === "purple" && "bg-purple-100/50 text-purple-600",
                          stat.color === "green" && "bg-green-100/50 text-green-600",
                          stat.color === "orange" && "bg-orange-100/50 text-orange-600"
                        )}
                      >
                        <stat.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{stat.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <p className="text-sm text-muted-foreground py-2">{stat.description}</p>
                    
                    {stat.benefits && (
                      <div className="mt-2 pl-3 border-l-2 border-mindscape-light space-y-2">
                        <h4 className="text-xs font-medium text-mindscape-tertiary">Key Benefits:</h4>
                        <ul className="space-y-1.5">
                          {stat.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <div className="rounded-full bg-mindscape-light/50 p-0.5 mt-0.5 shrink-0">
                                <CheckCircle2 className="h-2.5 w-2.5 text-mindscape-primary" />
                              </div>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-xs italic text-muted-foreground">{stat.research}</p>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card className="border border-border/50">
            <CardHeader className="px-4 py-3 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-mindscape-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs">
                Your latest mindfulness sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {progressLog.length === 0 ? (
                <div className="text-center py-8 px-4 text-muted-foreground">
                  <div className="inline-flex rounded-full bg-muted/30 p-3 mb-3">
                    <Activity className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium">No activity recorded yet</p>
                  <p className="text-xs mt-1">Start a session to track your progress!</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-360px)]">
                  <div className="divide-y divide-border/30">
                    {progressLog
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((log, idx) => (
                        <div key={idx} className="flex justify-between items-center px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{getExerciseName(log)}</p>
                            <div className="flex items-center flex-wrap gap-x-2 text-xs text-muted-foreground">
                              <span>{formatDate(log.date)}</span>
                              <span className="text-muted-foreground/40">•</span>
                              <span>{log.duration} min</span>
                              <span className="text-muted-foreground/40">•</span>
                              <span className="capitalize">{log.exerciseType}</span>
                            </div>
                          </div>
                          <div 
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              log.exerciseType === "breathing" ? "bg-blue-100/50 text-blue-600" : "bg-purple-100/50 text-purple-600"
                            )}
                          >
                            {log.exerciseType === "breathing" ? (
                              <Activity className="h-4 w-4" />
                            ) : (
                              <Target className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
