
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { MOOD_SCORES } from '../types';
import { isWithinInterval, format, eachDayOfInterval } from 'date-fns';

export function calculateMoodDistribution(moods: MoodEntry[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  moods.forEach(entry => {
    distribution[entry.value] = (distribution[entry.value] || 0) + 1;
  });
  
  return distribution;
}

export function calculateWeeklyMoodCounts(
  moodEntries: MoodEntry[], 
  weekInterval: { start: Date; end: Date }
): Record<string, number> {
  const daysInWeek = eachDayOfInterval(weekInterval);
  
  const weeklyMoodCounts: Record<string, number> = {};
  daysInWeek.forEach(day => {
    const dayName = format(day, 'EEE');
    weeklyMoodCounts[dayName] = 0;
  });
  
  moodEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (isWithinInterval(entryDate, weekInterval)) {
      const dayName = format(entryDate, 'EEE');
      weeklyMoodCounts[dayName] = (weeklyMoodCounts[dayName] || 0) + 1;
    }
  });
  
  return weeklyMoodCounts;
}

export function calculateMoodTrend(
  moodEntries: MoodEntry[],
  weekIntervals: { 
    current: { start: Date; end: Date }; 
    previous: { start: Date; end: Date } 
  }
): number {
  const lastWeekMoods = moodEntries.filter(entry => 
    isWithinInterval(new Date(entry.date), weekIntervals.previous)
  );
  
  const thisWeekMoods = moodEntries.filter(entry => 
    isWithinInterval(new Date(entry.date), weekIntervals.current)
  );
  
  // If there's no data for either week, return 0
  if (lastWeekMoods.length === 0 && thisWeekMoods.length === 0) {
    return 0;
  }
  
  const lastWeekAvg = lastWeekMoods.length > 0 
    ? lastWeekMoods.reduce((sum, entry) => sum + MOOD_SCORES[entry.value], 0) / lastWeekMoods.length 
    : 0;
    
  const thisWeekAvg = thisWeekMoods.length > 0 
    ? thisWeekMoods.reduce((sum, entry) => sum + MOOD_SCORES[entry.value], 0) / thisWeekMoods.length 
    : 0;
  
  // If there's no data from last week, but we have data this week
  if (lastWeekAvg === 0 && thisWeekAvg > 0) {
    // Instead of a dramatic 100% jump, provide a modest positive trend
    return 15; 
  }
  
  // If there's data last week but none this week, show a slight decline
  if (lastWeekAvg > 0 && thisWeekAvg === 0) {
    return -10;
  }
  
  // Calculate a more realistic percent change (capping at +/-35% to avoid extreme swings)
  if (lastWeekAvg > 0) {
    const percentChange = Math.round(((thisWeekAvg - lastWeekAvg) / Math.max(1, lastWeekAvg)) * 100);
    return Math.max(-35, Math.min(35, percentChange));
  }
  
  return 0;
}

export function getMoodAverageLabel(moods: MoodEntry[]): string {
  if (!moods.length) return "No Data";
  
  const avgScore = moods.reduce((sum, entry) => sum + (MOOD_SCORES[entry.value] || 3), 0) / moods.length;
  
  if (avgScore >= 4.5) return "Amazing";
  if (avgScore >= 3.5) return "Good";
  if (avgScore >= 2.5) return "Okay";
  if (avgScore >= 1.5) return "Sad";
  return "Awful";
}
