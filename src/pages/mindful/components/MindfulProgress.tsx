
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfWeek, startOfMonth, isWithinInterval, isSameDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompletedExercise {
  id: string;
  exerciseId: string;
  type: "breathing" | "mindfulness";
  name: string;
  duration: number;
  completed: string; // ISO date string
}

interface MindfulProgressProps {
  completedExercises: CompletedExercise[];
}

export default function MindfulProgress({ completedExercises }: MindfulProgressProps) {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter exercises by the selected time range
  const filteredExercises = useMemo(() => {
    try {
      const currentDate = new Date();
      
      switch (timeRange) {
        case "week": {
          const weekStart = startOfWeek(currentDate);
          return completedExercises.filter(exercise => {
            const exerciseDate = new Date(exercise.completed);
            return isWithinInterval(exerciseDate, { 
              start: weekStart,
              end: currentDate 
            });
          });
        }
        case "month": {
          const monthStart = startOfMonth(currentDate);
          return completedExercises.filter(exercise => {
            const exerciseDate = new Date(exercise.completed);
            return isWithinInterval(exerciseDate, { 
              start: monthStart,
              end: currentDate 
            });
          });
        }
        default:
          return completedExercises;
      }
    } catch (error) {
      console.error("Error filtering exercises:", error);
      setError("Failed to filter exercises. Please try again.");
      return [];
    }
  }, [completedExercises, timeRange]);
  
  // Calculate total time spent in exercises
  const totalMinutes = useMemo(() => {
    try {
      return Math.round(filteredExercises.reduce((acc, exercise) => acc + exercise.duration, 0) / 60);
    } catch (error) {
      console.error("Error calculating total minutes:", error);
      return 0;
    }
  }, [filteredExercises]);
  
  // Prepare data for charts
  const dailyData = useMemo(() => {
    try {
      const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 30;
      const dailyStats: Record<string, { date: Date; breathing: number; mindfulness: number; total: number }> = {};
      
      // Initialize daily data
      for (let i = 0; i < days; i++) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, "yyyy-MM-dd");
        dailyStats[dateStr] = {
          date,
          breathing: 0,
          mindfulness: 0,
          total: 0
        };
      }
      
      // Fill in with actual data
      filteredExercises.forEach(exercise => {
        const exerciseDate = new Date(exercise.completed);
        const dateStr = format(exerciseDate, "yyyy-MM-dd");
        
        if (dailyStats[dateStr]) {
          if (exercise.type === "breathing") {
            dailyStats[dateStr].breathing += exercise.duration / 60; // Convert to minutes
          } else {
            dailyStats[dateStr].mindfulness += exercise.duration / 60; // Convert to minutes
          }
          dailyStats[dateStr].total += exercise.duration / 60;
        }
      });
      
      // Convert to array and sort by date
      return Object.values(dailyStats)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(day => ({
          name: format(day.date, "MMM d"),
          breathing: Math.round(day.breathing),
          mindfulness: Math.round(day.mindfulness),
          total: Math.round(day.total)
        }));
    } catch (error) {
      console.error("Error preparing chart data:", error);
      setError("Failed to prepare chart data. Please try again.");
      return [];
    }
  }, [filteredExercises, timeRange]);
  
  // Calculate streak (consecutive days with exercises)
  const currentStreak = useMemo(() => {
    try {
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i <= 30; i++) { // Check up to 30 days back
        const checkDate = subDays(today, i);
        const exercisesOnDay = completedExercises.filter(ex => 
          isSameDay(new Date(ex.completed), checkDate)
        );
        
        if (exercisesOnDay.length > 0) {
          streak++;
        } else if (i > 0) { // Don't break streak for today
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 0;
    }
  }, [completedExercises]);
  
  // Handle time range change
  const handleTimeRangeChange = (newRange: "week" | "month" | "all") => {
    try {
      setLoading(true);
      setTimeRange(newRange);
      setTimeout(() => setLoading(false), 300); // Small timeout for UX
    } catch (error) {
      console.error("Error changing time range:", error);
      toast({
        title: "Error",
        description: "Failed to change time range. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  // Clear any errors when dependencies change
  useEffect(() => {
    setError(null);
  }, [timeRange, completedExercises]);
  
  // If there's an error, show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-800">
        <p className="font-medium">Error loading progress data</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => setError(null)}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Your Stats</h3>
        <p className="text-sm text-muted-foreground">Track your mindfulness journey</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <h3 className="text-3xl font-bold mt-1">{totalMinutes} min</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <h3 className="text-3xl font-bold mt-1">{currentStreak} days</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
        </TabsList>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Time Range:</h4>
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeRangeChange("week")}
                className="text-xs h-8"
                disabled={loading}
              >
                Week
              </Button>
              <Button 
                variant={timeRange === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeRangeChange("month")}
                className="text-xs h-8"
                disabled={loading}
              >
                Month
              </Button>
              <Button 
                variant={timeRange === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleTimeRangeChange("all")}
                className="text-xs h-8"
                disabled={loading}
              >
                All
              </Button>
            </div>
          </div>
        </div>
        
        <TabsContent value="daily" className="h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dailyData.length > 0 && filteredExercises.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  style={{ fontSize: '0.75rem' }}
                  tickMargin={10}
                />
                <YAxis 
                  style={{ fontSize: '0.75rem' }}
                  tickMargin={10}
                />
                <Tooltip 
                  formatter={(value: any) => [
                    `${value} min`, 
                    typeof value === 'number' && value > 0 ? 'Duration' : 'No activity'
                  ]}
                />
                <Bar dataKey="breathing" name="Breathing" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mindfulness" name="Mindfulness" fill="#A5D6A7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <Flame className="h-10 w-10 text-muted-foreground opacity-20 mb-2" />
              <p className="text-muted-foreground">No data available for this time range</p>
              <p className="text-xs text-muted-foreground mt-1">Complete some exercises to see your progress</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sessions">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="space-y-4">
              {filteredExercises.slice(0, 10).map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(exercise.completed), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">
                          {Math.round(exercise.duration / 60)} min
                        </p>
                        <div className={`ml-3 w-3 h-3 rounded-full ${
                          exercise.type === "breathing" ? "bg-primary" : "bg-green-500"
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredExercises.length > 10 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Showing 10 of {filteredExercises.length} sessions
                </p>
              )}
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <Flame className="h-10 w-10 text-muted-foreground opacity-20 mb-2" />
              <p className="text-muted-foreground">No sessions in this time range</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing the time range or complete some exercises</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="types">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Exercise Types",
                      breathing: filteredExercises.filter(ex => ex.type === "breathing").length,
                      mindfulness: filteredExercises.filter(ex => ex.type === "mindfulness").length,
                    }
                  ]}
                  margin={{
                    top: 20,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [
                      `${value} ${value === 1 ? 'session' : 'sessions'}`,
                      'Count'
                    ]}
                  />
                  <Bar dataKey="breathing" name="Breathing" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mindfulness" name="Mindfulness" fill="#A5D6A7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <Flame className="h-10 w-10 text-muted-foreground opacity-20 mb-2" />
              <p className="text-muted-foreground">No data available for this time range</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing the time range or complete some exercises</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
