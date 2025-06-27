
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  getDay, 
  isWithinInterval,
  isSameMonth,
  isSameYear,
  subDays
} from 'date-fns';

export function getWeekInterval(selectedDate: Date) {
  const currentWeekStart = startOfWeek(selectedDate);
  const currentWeekEnd = endOfWeek(selectedDate);
  return { 
    current: { start: currentWeekStart, end: currentWeekEnd },
    previous: { 
      start: subDays(currentWeekStart, 7), 
      end: subDays(currentWeekEnd, 7) 
    }
  };
}

export function filterMoodsByMonth(moods: any[], selectedDate: Date): any[] {
  return moods.filter(entry => 
    isSameMonth(new Date(entry.date), selectedDate) && 
    isSameYear(new Date(entry.date), selectedDate)
  );
}

export function getRecentMoods(moods: any[], days: number = 31): any[] {
  const thirtyOneDaysAgo = subDays(new Date(), days);
  return moods
    .filter(entry => new Date(entry.date) >= thirtyOneDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
