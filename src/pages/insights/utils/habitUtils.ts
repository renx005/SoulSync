
import { HabitEntry, HabitProgress } from '../types';
import { JournalEntry } from '@/types/journal';
import { isWithinInterval } from 'date-fns';

export function calculateHabitProgress(
  habits: HabitEntry[],
  weekInterval: { start: Date; end: Date },
  journals: JournalEntry[] = []
): HabitProgress[] {
  // Calculate habit progress
  const habitTracker: Record<string, { completed: number; total: number }> = {};
  
  habits.forEach(habit => {
    const habitDate = new Date(habit.date);
    if (isWithinInterval(habitDate, weekInterval)) {
      if (!habitTracker[habit.name]) {
        habitTracker[habit.name] = { completed: 0, total: habit.targetDays || 7 };
      }
      
      if (habit.completed) {
        habitTracker[habit.name].completed += 1;
      }
    }
  });
  
  // Return only real user data, no sample data
  return Object.entries(habitTracker).map(([name, data]) => ({
    name,
    completed: data.completed,
    total: data.total
  }));
}
