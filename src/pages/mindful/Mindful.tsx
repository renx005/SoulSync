
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulHeader from "./components/MindfulHeader";
import BreathingExercises from "./components/breathing/BreathingExercises";
import MindfulnessExercises from "./components/mindfulness/MindfulnessExercises";
import MentalHealthQuiz from "./components/quiz/MentalHealthQuiz";
import ProgressTracker from "./components/progress/ProgressTracker";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flower, Heart, Shield, CloudSun, HelpCircle, Menu, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { mindfulSummaryStats } from "./data/summaryData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Mindful() {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("breathing");
  const [showHelp, setShowHelp] = useState(false);
  const [isInSession, setIsInSession] = useState(false);
  
  const handleFloatingButtonClick = () => {
    setShowHelp(true);
  };

  // Handler to pass to exercise components to update the session state
  const handleSessionChange = (inSession: boolean) => {
    setIsInSession(inSession);
  };
  
  return (
    <div className="space-y-6">
      <MindfulHeader username={user?.username || 'Friend'} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {mindfulSummaryStats.map(stat => (
          <Sheet key={stat.id}>
            <SheetTrigger asChild>
              <Card 
                className={cn(
                  "overflow-hidden border-border/50 transition-all hover:shadow-md cursor-pointer",
                  stat.color === "purple" && "bg-gradient-to-br from-purple-50/30 to-transparent",
                  stat.color === "blue" && "bg-gradient-to-br from-blue-50/30 to-transparent",
                  stat.color === "orange" && "bg-gradient-to-br from-orange-50/30 to-transparent",
                  stat.color === "green" && "bg-gradient-to-br from-green-50/30 to-transparent"
                )}
              >
                <CardContent className="p-3 flex items-start gap-2">
                  <div className={cn(
                    "p-2 rounded-full",
                    stat.color === "purple" && "bg-purple-100",
                    stat.color === "blue" && "bg-blue-100",
                    stat.color === "orange" && "bg-orange-100",
                    stat.color === "green" && "bg-green-100"
                  )}>
                    <stat.icon className={cn(
                      "h-4 w-4",
                      stat.color === "purple" && "text-purple-600",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "orange" && "text-orange-500",
                      stat.color === "green" && "text-green-600"
                    )} />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{stat.description}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{stat.title}</SheetTitle>
                <SheetDescription>
                  {stat.description}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Benefits</h3>
                <div className="space-y-2">
                  {stat.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className={cn(
                        "p-1 rounded-full mt-0.5",
                        stat.color === "purple" && "bg-purple-100",
                        stat.color === "blue" && "bg-blue-100",
                        stat.color === "orange" && "bg-orange-100",
                        stat.color === "green" && "bg-green-100"
                      )}>
                        <stat.icon className={cn(
                          "h-3 w-3",
                          stat.color === "purple" && "text-purple-600",
                          stat.color === "blue" && "text-blue-600",
                          stat.color === "orange" && "text-orange-500",
                          stat.color === "green" && "text-green-600"
                        )} />
                      </div>
                      <p className="text-sm">{benefit}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mt-4">Research</h3>
                <p className="text-sm text-muted-foreground">
                  {stat.research}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
      
      <div className="relative">
        <div className="absolute -z-10 top-1/3 left-1/4 w-40 h-40 rounded-full bg-purple-100/20 blur-3xl"></div>
        <div className="absolute -z-10 bottom-0 right-1/4 w-40 h-40 rounded-full bg-blue-100/20 blur-3xl"></div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="bg-background/50 backdrop-blur-md border border-border/50 rounded-lg p-1 overflow-x-auto">
            <TabsList className="grid grid-cols-4 w-full h-auto">
              <TabsTrigger 
                value="breathing" 
                className="rounded-md py-2 px-1 data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary flex flex-col items-center text-xs sm:text-sm gap-1"
              >
                <Brain className="h-4 w-4" />
                <span className="line-clamp-1">Breathing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mindfulness" 
                className="rounded-md py-2 px-1 data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary flex flex-col items-center text-xs sm:text-sm gap-1"
              >
                <Flower className="h-4 w-4" />
                <span className="line-clamp-1">Mindfulness</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quiz" 
                className="rounded-md py-2 px-1 data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary flex flex-col items-center text-xs sm:text-sm gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="line-clamp-1">Quiz</span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="rounded-md py-2 px-1 data-[state=active]:bg-mindscape-light data-[state=active]:text-mindscape-tertiary flex flex-col items-center text-xs sm:text-sm gap-1"
              >
                <Menu className="h-4 w-4" />
                <span className="line-clamp-1">Progress</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pt-4"
            >
              <TabsContent value="breathing" className="mt-0">
                <BreathingExercises onSessionChange={handleSessionChange} />
              </TabsContent>
              
              <TabsContent value="mindfulness" className="mt-0">
                <MindfulnessExercises onSessionChange={handleSessionChange} />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                <MentalHealthQuiz onSessionChange={handleSessionChange} />
              </TabsContent>
              
              <TabsContent value="progress" className="mt-0">
                <ProgressTracker />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mindfulness Guide</DialogTitle>
            <DialogDescription>
              Welcome to your mindfulness journey. Here's how to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Begin with Breathing</h3>
              <p className="text-sm text-muted-foreground">
                Start with simple breathing exercises to calm your mind and center yourself.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Explore Mindfulness Practices</h3>
              <p className="text-sm text-muted-foreground">
                Gradually try different mindfulness exercises to find what works best for you.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Consistency is key. Use the progress tab to monitor your practice and celebrate small victories.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Take the Quiz</h3>
              <p className="text-sm text-muted-foreground">
                Not sure where to start? Take our mental health quiz for personalized recommendations.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {!isInSession && (
        <button 
          onClick={handleFloatingButtonClick}
          className={cn(
            "fixed bottom-20 right-6 z-30 p-4 rounded-full bg-mindscape-light shadow-md",
            "animate-bounce-soft transition-all"
          )}
        >
          <Info className="text-mindscape-primary w-5 h-5" />
        </button>
      )}
    </div>
  );
}
