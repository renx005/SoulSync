
import { getMoodScores, calculateMoodTrend } from "../utils";

export function processMoodData(storedMoods: string): number | null {
  try {
    const moodEntries = JSON.parse(storedMoods);
    
    // Only calculate if there are actually mood entries
    if (!moodEntries || moodEntries.length === 0) {
      return null;
    }
    
    // Map mood values to numeric scores
    const moodScores = getMoodScores();
    
    // Get today and one week ago
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    // Calculate current week vs previous week mood score
    const recentMoods = moodEntries.filter((entry: any) => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    // Only proceed if there are recent moods
    if (recentMoods.length === 0) {
      return null;
    }
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const previousWeekMoods = moodEntries.filter((entry: any) => 
      new Date(entry.date) >= twoWeeksAgo && new Date(entry.date) < oneWeekAgo
    );
    
    const recentAvg = recentMoods.reduce((sum: number, entry: any) => 
      sum + (moodScores[entry.value] || 3), 0) / recentMoods.length;
      
    const prevAvg = previousWeekMoods.length > 0 
      ? previousWeekMoods.reduce((sum: number, entry: any) => 
        sum + (moodScores[entry.value] || 3), 0) / previousWeekMoods.length 
      : 0;
    
    // Calculate trend percent change (capped at ±40%)
    let trendValue = calculateMoodTrend(recentAvg, prevAvg);
    return Math.max(-40, Math.min(40, trendValue));
  } catch (error) {
    console.error("Error processing mood data:", error);
    return null;
  }
}

export function getMoodEngagementRate(storedMoods: string | null): number {
  if (!storedMoods) return 0;
  
  try {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const recentMoods = JSON.parse(storedMoods).filter((entry: any) => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    if (recentMoods.length === 0) {
      return 0;
    }
    
    const daysWithMoods = new Set(
      recentMoods.map((entry: any) => new Date(entry.date).toDateString())
    ).size;
    
    return Math.round((daysWithMoods / 7) * 100);
  } catch (error) {
    console.error("Error calculating mood engagement:", error);
    return 0;
  }
}
