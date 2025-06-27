
import { useUser } from '@/contexts/UserContext';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { JournalEntry } from '@/types/journal';
import { HabitEntry, MindfulnessSession, InsightsData } from '../types';
import { 
  filterMoodsByMonth,
  getRecentMoods,
  calculateMoodDistribution,
  calculateWeeklyMoodCounts,
  calculateMoodTrend,
  calculateHabitProgress,
  createWeeklySummary,
  getWeekInterval,
  getDefaultInsightsData
} from '../utils/insightsUtils';
import { isWithinInterval } from 'date-fns';

export function fetchInsightsData(selectedDate: Date, userId: string): InsightsData {
  try {
    // Load mood entries from localStorage - try user-specific first
    const userMoodStorageKey = `soulsync_moods_${userId}`;
    const globalMoodStorageKey = `soulsync_moods`;
    
    let storedMoods = localStorage.getItem(userMoodStorageKey);
    if (!storedMoods) {
      // Fall back to global mood data
      storedMoods = localStorage.getItem(globalMoodStorageKey);
    }
    
    let moodEntries: MoodEntry[] = [];
    
    if (storedMoods) {
      moodEntries = JSON.parse(storedMoods);
      
      // Make sure dates are Date objects
      moodEntries = moodEntries.map(entry => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
    
    // Load habit entries
    const habitsStorageKey = `soulsync_habits_${userId}`;
    const storedHabits = localStorage.getItem(habitsStorageKey);
    let habitEntries: HabitEntry[] = [];
    
    if (storedHabits) {
      habitEntries = JSON.parse(storedHabits);
    }
    
    // Load journal entries
    const journalStorageKey = `soulsync_journal_${userId}`;
    const storedJournals = localStorage.getItem(journalStorageKey);
    let journalEntries: JournalEntry[] = [];
    
    if (storedJournals) {
      journalEntries = JSON.parse(storedJournals);
    }
    
    // Load mindfulness session data
    const mindfulnessStorageKey = `soulsync_mindfulness_${userId}`;
    const storedMindfulness = localStorage.getItem(mindfulnessStorageKey);
    let mindfulnessData: MindfulnessSession[] = [];
    
    if (storedMindfulness) {
      mindfulnessData = JSON.parse(storedMindfulness);
    }
    
    // Filter data based on selected date
    const filteredMoods = filterMoodsByMonth(moodEntries, selectedDate);
    
    // Get moods from the last 31 days for calendar view (regardless of month selection)
    const recentMoods = getRecentMoods(moodEntries);
    
    // Calculate mood distribution for selected month
    const moodDistribution = calculateMoodDistribution(filteredMoods);
    
    // Define week intervals
    const weekIntervals = getWeekInterval(selectedDate);
    
    // Calculate this week's mood counts by day
    const weeklyMoodCounts = calculateWeeklyMoodCounts(moodEntries, weekIntervals.current);
    
    // Calculate mood trend (positive or negative)
    const moodTrend = calculateMoodTrend(moodEntries, weekIntervals);
    
    // Get this week's journal entries
    const thisWeekJournals = journalEntries.filter(entry =>
      isWithinInterval(new Date(entry.date), weekIntervals.current)
    );
    
    // Calculate habit progress
    const habitProgress = calculateHabitProgress(habitEntries, weekIntervals.current, journalEntries);
    
    // Get this week's mindfulness minutes
    const thisWeekMindfulness = mindfulnessData.filter(session => 
      isWithinInterval(new Date(session.date), weekIntervals.current)
    );
    
    const totalMindfulnessMinutes = thisWeekMindfulness.reduce((sum, session) => sum + session.minutes, 0);
    
    // Filter moods for this week for the weekly summary
    const thisWeekMoods = moodEntries.filter(entry => 
      isWithinInterval(new Date(entry.date), weekIntervals.current)
    );
    
    // Construct weekly summary
    const weeklySummary = createWeeklySummary(
      thisWeekMoods, 
      thisWeekJournals, 
      habitProgress, 
      totalMindfulnessMinutes
    );
    
    // Return insights data
    return {
      recentMoods,
      weeklyMoodCounts,
      moodDistribution,
      weeklySummary,
      moodTrend,
      habitProgress,
      journalCount: thisWeekJournals.length,
      mindfulnessData: thisWeekMindfulness
    };
    
  } catch (error) {
    console.error("Failed to load insights data:", error);
    return getDefaultInsightsData();
  }
}
