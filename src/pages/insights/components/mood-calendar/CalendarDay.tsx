
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { getMoodForDay, getMoodColorClass } from './calendarUtils';

interface CalendarDayProps {
  day: Date;
  moods: MoodEntry[];
  isCurrentMonth?: boolean;
}

export function CalendarDay({ day, moods, isCurrentMonth = true }: CalendarDayProps) {
  const mood = getMoodForDay(moods, day);
  const colorClass = getMoodColorClass(mood);
  const isToday = isSameDay(day, new Date());
  
  return (
    <div 
      className={`
        aspect-square rounded-full flex items-center justify-center text-xs font-medium
        ${colorClass} 
        ${!isCurrentMonth ? 'opacity-40' : ''} 
        ${isToday ? 'ring-2 ring-mindscape-primary' : ''}
      `} 
      title={mood ? `${format(day, 'PP')}: ${mood.value}` : format(day, 'PP')}
    >
      {day.getDate()}
    </div>
  );
}
