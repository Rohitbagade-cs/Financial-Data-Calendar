import React from 'react';
import { CalendarData, ViewMode } from '@/types/financial';
import { CalendarCell } from './CalendarCell';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format
} from 'date-fns';

interface CalendarGridProps {
  currentMonth: Date;
  data: CalendarData;
  viewMode: ViewMode;
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  onCellHover?: (data: any) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  data,
  viewMode,
  selectedDate,
  onDateSelect,
  onCellHover
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-muted/50">
        {weekdays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border/30 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayData = data[dateKey];
          
          return (
            <CalendarCell
              key={dateKey}
              date={day}
              data={dayData}
              viewMode={viewMode}
              isSelected={selectedDate === dateKey}
              currentMonth={currentMonth}
              onClick={() => onDateSelect?.(dateKey)}
              onHover={onCellHover}
            />
          );
        })}
      </div>
    </div>
  );
};