
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths, 
  getDay 
} from 'date-fns';

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getMonthDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Generate all days in the current month
  return eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
}

export function getPreviousMonthDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const firstDayOfMonth = getDay(monthStart);
  
  // Get days before the first of the month to fill up the first row
  return firstDayOfMonth > 0 
    ? eachDayOfInterval({
        start: subMonths(monthStart, 1),
        end: subMonths(monthStart, 1)
      }).slice(-firstDayOfMonth) 
    : [];
}

export function getNextMonthDays(days: Date[]) {
  // Calculate remaining days needed to complete the grid
  const remainingDays = (7 - (days.length % 7)) % 7;
  
  if (remainingDays === 0) return [];
  
  const nextMonthDays: Date[] = [];
  const lastDay = days[days.length - 1];
  
  for (let i = 1; i <= remainingDays; i++) {
    const nextDay = new Date(lastDay);
    nextDay.setDate(lastDay.getDate() + i);
    nextMonthDays.push(nextDay);
  }
  
  return nextMonthDays;
}

export function getMoodForDay(moods: MoodEntry[], day: Date): MoodEntry | undefined {
  return moods.find(mood => isSameDay(new Date(mood.date), day));
}

export function getMoodColorClass(mood?: MoodEntry): string {
  if (!mood) return 'bg-gray-100';
  
  switch (mood.value) {
    case 'amazing':
      return 'bg-green-400';
    case 'good':
    case 'peaceful':
      return 'bg-green-300';
    case 'calm':
      return 'bg-blue-200';
    case 'energetic':
      return 'bg-amber-300';
    case 'okay':
      return 'bg-blue-300';
    case 'tired':
      return 'bg-gray-300';
    case 'stressed':
      return 'bg-orange-200';
    case 'anxious':
      return 'bg-indigo-300';
    case 'sad':
      return 'bg-orange-300';
    case 'angry':
      return 'bg-red-400';
    case 'awful':
      return 'bg-red-300';
    default:
      return 'bg-gray-100';
  }
}

export const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" }
];

export function generateYearOptions(currentYear: number, range: number = 10): number[] {
  return Array.from(
    { length: range * 2 + 1 },
    (_, i) => currentYear - range + i
  );
}
