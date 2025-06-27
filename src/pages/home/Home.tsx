
import { useUser } from "@/contexts/UserContext";
import { MoodTracker } from "./components/mood-tracker";
import { DailyMotivation } from "./components/DailyMotivation";
import { UpcomingHabits } from "./components/upcoming-habits";
import { RecentJournals } from "./components/RecentJournals";
import { WeeklyInsights } from "./components/weekly-insights";
import { MoodSuggestions } from "./components/mood-suggestions";
import { LightbulbIcon, SparklesIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const [animationClass, setAnimationClass] = useState("animate-pulse");
  
  useEffect(() => {
    const animationClasses = ["animate-pulse", "animate-bounce-soft", "animate-fade-in"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % animationClasses.length;
      setAnimationClass(animationClasses[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-8">
      <header className="pt-2 bg-gradient-to-r from-mindscape-light/30 to-transparent p-4 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold font-display text-mindscape-primary flex items-center gap-2">
            Hi, {user?.username || 'Friend'}!
            <SparklesIcon className={`h-5 w-5 text-yellow-400 ${animationClass}`} />
          </h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>
        
        {/* Animated shapes */}
        <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-blue-100/40 blur-lg transform -translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-0 right-12 w-8 h-8 rounded-full bg-purple-100/30 blur-md animate-bounce-soft"></div>
        <div className="absolute bottom-0 right-1/4 w-10 h-10 rounded-full bg-green-100/30 blur-lg animate-pulse delay-700"></div>
      </header>
      
      <MoodTracker />
      
      <div className="relative">
        <div className="absolute -z-10 top-1/2 left-12 w-24 h-24 rounded-full bg-mindscape-light/20 blur-xl"></div>
        <div className="absolute -z-10 bottom-8 right-8 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
        <DailyMotivation />
      </div>
      
      {/* Mood Suggestions component */}
      <MoodSuggestions />
      
      <div className="space-y-4 bg-gradient-to-br from-blue-50/50 to-transparent p-5 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary flex items-center gap-2">
            Today's Habits
            <LightbulbIcon className="h-4 w-4 text-yellow-500" />
          </h2>
          <a href="/habit-tracker" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <UpcomingHabits />
      </div>
      
      <div className="space-y-4 bg-gradient-to-bl from-mindscape-light/20 to-transparent p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Recent Journal Entries</h2>
          <a href="/journal" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <RecentJournals />
      </div>
      
      <div className="space-y-4 bg-gradient-to-tr from-purple-50/50 to-transparent p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mindscape-tertiary">Weekly Insights</h2>
          <a href="/insights" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <WeeklyInsights />
      </div>
      
      <div className="fixed -z-10 top-20 right-0 w-64 h-64 rounded-full bg-purple-100/30 blur-3xl opacity-70"></div>
      <div className="fixed -z-10 bottom-20 left-10 w-40 h-40 rounded-full bg-blue-100/20 blur-2xl opacity-60"></div>
    </div>
  );
}
