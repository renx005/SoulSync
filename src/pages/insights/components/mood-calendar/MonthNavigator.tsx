
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { months, generateYearOptions } from './calendarUtils';

interface MonthNavigatorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

export function MonthNavigator({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth, 
  onMonthChange, 
  onYearChange 
}: MonthNavigatorProps) {
  const currentYear = new Date().getFullYear();
  const years = generateYearOptions(currentYear);

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="flex items-center justify-center gap-2 w-full">
          <Select value={currentDate.getMonth().toString()} onValueChange={onMonthChange}>
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={currentDate.getFullYear().toString()} onValueChange={onYearChange}>
            <SelectTrigger className="w-[90px] h-8 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={onPreviousMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{format(currentDate, 'MMMM yyyy')}</span>
        <Button variant="outline" size="icon" onClick={onNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
