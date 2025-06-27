
import { InsightData } from "../types";
import { processMoodData, getMoodEngagementRate } from "../utils/moodUtils";
import { processJournalData } from "../utils/journalUtils";
import { processHabitData } from "../utils/habitUtils";
import { calculateActivityLevel } from "../utils/activityUtils";

export function useInsightsDataFetcher() {
  const fetchData = (userId?: string): InsightData => {
    if (!userId) {
      return {
        moodTrend: null,
        journalConsistency: null,
        habitStreaks: null,
        activityLevel: null
      };
    }
    
    try {
      // Try to use user-specific mood data first, fall back to global if none
      const userMoodStorageKey = `soulsync_moods_${userId}`;
      const globalMoodStorageKey = `soulsync_moods`;
      
      let storedMoods = localStorage.getItem(userMoodStorageKey);
      if (!storedMoods) {
        // Fall back to global mood data if user-specific doesn't exist
        storedMoods = localStorage.getItem(globalMoodStorageKey);
      }
      
      const journalStorageKey = `soulsync_journal_${userId}`;
      const storedJournals = localStorage.getItem(journalStorageKey);
      
      const habitsStorageKey = `soulsync_habits_${userId}`;
      const storedHabits = localStorage.getItem(habitsStorageKey);
      
      // Process mood data
      const moodTrend = storedMoods ? processMoodData(storedMoods) : null;
      
      // Process journal data
      const journalConsistency = storedJournals ? processJournalData(storedJournals) : null;
      
      // Process habit data
      const habitData = storedHabits ? processHabitData(storedHabits) : { 
        habitStreaks: null, 
        habitCompletionRate: 0,
        moodEngagementRate: 0
      };
      
      // Get mood engagement rate
      const moodEngagementRate = storedMoods ? getMoodEngagementRate(storedMoods) : 0;
      
      // Calculate activity level
      const activityLevel = calculateActivityLevel(
        habitData.habitCompletionRate,
        journalConsistency || 0,
        moodEngagementRate
      );
      
      return {
        moodTrend,
        journalConsistency,
        habitStreaks: habitData.habitStreaks,
        activityLevel
      };
    } catch (err) {
      console.error("Failed to load insights data", err);
      return {
        moodTrend: null,
        journalConsistency: null,
        habitStreaks: null,
        activityLevel: null
      };
    }
  };

  return { fetchData };
}
