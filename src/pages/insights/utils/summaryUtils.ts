
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { JournalEntry } from '@/types/journal';
import { HabitProgress, WeeklySummary, InsightsData, MindfulnessSession } from '../types';
import { getMoodAverageLabel } from './moodUtils';

export function createWeeklySummary(
  thisWeekMoods: MoodEntry[],
  thisWeekJournals: JournalEntry[],
  habitProgress: HabitProgress[],
  mindfulnessMinutes: number
): WeeklySummary {
  // Calculate completed habits from real data
  const totalCompleted = habitProgress.reduce((sum, habit) => sum + habit.completed, 0);
  const totalHabits = habitProgress.reduce((sum, habit) => sum + habit.total, 0);
  
  // Only show the completed habits ratio if there's actual data
  const completedHabitsText = habitProgress.length > 0 
    ? `${totalCompleted}/${totalHabits}`
    : "No data";
  
  return {
    moodAverage: thisWeekMoods.length > 0 ? getMoodAverageLabel(thisWeekMoods) : "No data",
    journalEntries: thisWeekJournals.length,
    completedHabits: completedHabitsText,
    mindfulnessMinutes: mindfulnessMinutes || 0 // No fallback to random, use 0 if no data
  };
}

export function getDefaultInsightsData(): InsightsData {
  return {
    recentMoods: [],
    weeklyMoodCounts: {},
    moodDistribution: {},
    weeklySummary: {
      moodAverage: "No data",
      journalEntries: 0,
      completedHabits: "No data",
      mindfulnessMinutes: 0
    },
    moodTrend: 0,
    habitProgress: [],
    journalCount: 0,
    mindfulnessData: []
  };
}

// Remove the sample data generation function since we won't use it anymore
