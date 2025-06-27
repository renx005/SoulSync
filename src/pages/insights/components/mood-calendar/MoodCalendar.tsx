
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry } from '@/pages/home/components/mood-tracker/types';
import { addMonths, subMonths } from 'date-fns';
import { MonthNavigator } from './MonthNavigator';
import { CalendarGrid } from './CalendarGrid';
import { MoodLegend } from './MoodLegend';

interface MoodCalendarProps {
  moods: MoodEntry[];
}

export function MoodCalendar({ moods }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(month));
    setCurrentDate(newDate);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-mindscape-primary" />
            Mood Calendar
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MonthNavigator 
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
        
        <CalendarGrid currentDate={currentDate} moods={moods} />
        
        <MoodLegend />
      </CardContent>
    </Card>
  );
}
