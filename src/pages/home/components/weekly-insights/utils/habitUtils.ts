
export function processHabitData(storedHabits: string): { 
  habitStreaks: number | null;
  habitCompletionRate: number;
  moodEngagementRate: number;
} {
  try {
    const habitEntries = JSON.parse(storedHabits);
    
    // Default return values
    const result = {
      habitStreaks: null,
      habitCompletionRate: 0,
      moodEngagementRate: 0
    };
    
    // Calculate habit streaks only if there are habit entries
    if (!habitEntries || habitEntries.length === 0) {
      return result;
    }
    
    // Group habits by name
    const habitGroups: Record<string, any[]> = {};
    habitEntries.forEach((entry: any) => {
      if (!habitGroups[entry.name]) {
        habitGroups[entry.name] = [];
      }
      habitGroups[entry.name].push(entry);
    });
    
    // Check if we have actual completed habits
    const hasCompletedHabits = habitEntries.some((entry: any) => entry.completed);
    
    if (!hasCompletedHabits) {
      return result;
    }
    
    // Calculate streaks for each habit
    const habitStreakValues: number[] = [];
    
    Object.values(habitGroups).forEach((entries: any[]) => {
      // Sort entries by date
      const sortedEntries = [...entries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Find the longest streak of completed habits
      let currentStreak = 0;
      let maxStreak = 0;
      
      sortedEntries.forEach((entry) => {
        if (entry.completed) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      // Calculate streak percentage (max 100%)
      const streakPercentage = Math.min(100, Math.round((maxStreak / 7) * 100));
      habitStreakValues.push(streakPercentage);
    });
    
    // Average of all habit streaks
    result.habitStreaks = habitStreakValues.length > 0
      ? Math.round(habitStreakValues.reduce((sum, val) => sum + val, 0) / habitStreakValues.length)
      : null;
      
    // Calculate habit completion rate for this week
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const thisWeekHabits = habitEntries.filter((entry: any) => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    const completedThisWeek = thisWeekHabits.filter((entry: any) => entry.completed).length;
    const totalHabitsThisWeek = thisWeekHabits.length;
    
    result.habitCompletionRate = totalHabitsThisWeek > 0 
      ? Math.round((completedThisWeek / totalHabitsThisWeek) * 100)
      : 0;
    
    return result;
  } catch (error) {
    console.error("Error processing habit data:", error);
    return {
      habitStreaks: null,
      habitCompletionRate: 0,
      moodEngagementRate: 0
    };
  }
}
