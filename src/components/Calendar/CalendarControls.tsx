import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { TimeFrame, ViewMode } from '@/types/financial';
import { format } from 'date-fns';

interface CalendarControlsProps {
  currentMonth: Date;
  timeFrame: TimeFrame;
  viewMode: ViewMode;
  selectedSymbol: string;
  availableSymbols: string[];
  onMonthChange: (date: Date) => void;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  onSymbolChange: (symbol: string) => void;
  onToday: () => void;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  currentMonth,
  timeFrame,
  viewMode,
  selectedSymbol,
  availableSymbols,
  onMonthChange,
  onTimeFrameChange,
  onViewModeChange,
  onSymbolChange,
  onToday
}) => {
  const previousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    onMonthChange(next);
  };

  const viewModeConfig = {
    all: { label: 'All Metrics', icon: Activity, color: 'bg-primary' },
    volatility: { label: 'Volatility', icon: TrendingUp, color: 'bg-volatility-medium' },
    liquidity: { label: 'Liquidity', icon: BarChart3, color: 'bg-chart-1' },
    performance: { label: 'Performance', icon: TrendingUp, color: 'bg-bullish' }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 min-w-[200px]">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
          </div>
          
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onToday}>
            Today
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Symbol Selection */}
          <Select value={selectedSymbol} onValueChange={onSymbolChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              {availableSymbols.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Frame */}
          <div className="flex bg-muted rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as TimeFrame[]).map((frame) => (
              <Button
                key={frame}
                variant={timeFrame === frame ? 'default' : 'ghost'}
                size="sm"
                className="capitalize"
                onClick={() => onTimeFrameChange(frame)}
              >
                {frame}
              </Button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            {(Object.entries(viewModeConfig) as [ViewMode, typeof viewModeConfig[ViewMode]][]).map(([mode, config]) => {
              const IconComponent = config.icon;
              return (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange(mode)}
                  className="flex items-center gap-1"
                >
                  <IconComponent className="h-3 w-3" />
                  <span className="hidden sm:inline">{config.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-volatility-low/40 border border-volatility-low rounded" />
            <span>Low Volatility (&lt;2%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-volatility-medium/40 border border-volatility-medium rounded" />
            <span>Medium Volatility (2-5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-volatility-high/40 border border-volatility-high rounded" />
            <span>High Volatility (&gt;5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-bullish" />
            <span>Positive Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-bearish rotate-180" />
            <span>Negative Performance</span>
          </div>
        </div>
      </div>
    </Card>
  );
};