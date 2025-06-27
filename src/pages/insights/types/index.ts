
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { JournalEntry } from '@/types/journal';

export interface HabitEntry {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  targetDays: number;
}

export interface WeeklySummary {
  moodAverage: string;
  journalEntries: number;
  completedHabits: string;
  mindfulnessMinutes: number;
}

export interface MindfulnessSession {
  date: string;
  minutes: number;
}

export interface HabitProgress {
  name: string;
  completed: number;
  total: number;
}

export interface InsightsData {
  recentMoods: MoodEntry[];
  weeklyMoodCounts: Record<string, number>;
  moodDistribution: Record<string, number>;
  weeklySummary: WeeklySummary;
  moodTrend: number;
  habitProgress: HabitProgress[];
  journalCount: number;
  mindfulnessData: MindfulnessSession[];
}

export const MOOD_SCORES: Record<string, number> = {
  "amazing": 5,
  "good": 4,
  "peaceful": 4,
  "calm": 4,
  "energetic": 4,
  "okay": 3,
  "sad": 2,
  "tired": 2,
  "stressed": 2,
  "anxious": 2,
  "angry": 1,
  "awful": 1
};
