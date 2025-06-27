
import React from 'react';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { CalendarDay } from './CalendarDay';
import { weekDays, getMonthDays } from './calendarUtils';

interface CalendarGridProps {
  currentDate: Date;
  moods: MoodEntry[];
}

export function CalendarGrid({ currentDate, moods }: CalendarGridProps) {
  const days = getMonthDays(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Create empty cells for the first row before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null);
  
  // Calculate rows based on the number of days plus empty cells
  const totalCells = emptyCells.length + days.length;
  const rows = Math.ceil(totalCells / 7);
  const finalCellCount = rows * 7;
  
  // Create empty cells for the end of the month to maintain grid structure
  const endEmptyCells = Array(finalCellCount - totalCells).fill(null);
  
  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before the first day of the month */}
        {emptyCells.map((_, index) => (
          <div key={`empty-start-${index}`} className="aspect-square"></div>
        ))}
        
        {/* Current month days */}
        {days.map((day, index) => (
          <CalendarDay 
            key={`current-${index}`} 
            day={day} 
            moods={moods} 
            isCurrentMonth={true}
          />
        ))}
        
        {/* Empty cells after the last day of the month */}
        {endEmptyCells.map((_, index) => (
          <div key={`empty-end-${index}`} className="aspect-square"></div>
        ))}
      </div>
    </>
  );
}
