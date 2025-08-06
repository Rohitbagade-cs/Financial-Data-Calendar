import React from 'react';
import { cn } from '@/lib/utils';
import { FinancialData, ViewMode } from '@/types/financial';
import { format, isToday, isSameMonth } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface CalendarCellProps {
  date: Date;
  data?: FinancialData;
  viewMode: ViewMode;
  isSelected?: boolean;
  currentMonth: Date;
  onClick?: () => void;
  onHover?: (data: FinancialData | null) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  data,
  viewMode,
  isSelected,
  currentMonth,
  onClick,
  onHover
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);
  
  const getVolatilityColor = (volatility: number) => {
    if (volatility < 2) return 'bg-volatility-low/20 border-volatility-low/40';
    if (volatility < 5) return 'bg-volatility-medium/20 border-volatility-medium/40';
    return 'bg-volatility-high/20 border-volatility-high/40';
  };

  const getPerformanceIndicator = (performance: number) => {
    if (performance > 0.5) return { icon: TrendingUp, color: 'text-bullish' };
    if (performance < -0.5) return { icon: TrendingDown, color: 'text-bearish' };
    return { icon: Minus, color: 'text-neutral' };
  };

  const getLiquidityIntensity = (liquidity: number, maxLiquidity: number) => {
    const intensity = Math.min(liquidity / maxLiquidity, 1);
    return Math.floor(intensity * 5) + 1; // 1-5 scale
  };

  const cellContent = () => {
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-sm">{format(date, 'd')}</span>
        </div>
      );
    }

    const { icon: PerformanceIcon, color: performanceColor } = getPerformanceIndicator(data.performance);

    return (
      <div className="flex flex-col items-center justify-center h-full relative">
        <span className="text-sm font-medium">{format(date, 'd')}</span>
        
        {viewMode === 'volatility' && (
          <div className="text-xs mt-1 font-mono">
            {data.volatility.toFixed(1)}%
          </div>
        )}
        
        {viewMode === 'performance' && (
          <div className={cn("mt-1", performanceColor)}>
            <PerformanceIcon size={12} />
          </div>
        )}
        
        {viewMode === 'liquidity' && (
          <div className="mt-1">
            <BarChart3 size={12} className="text-chart-1" />
          </div>
        )}
        
        {viewMode === 'all' && (
          <div className="flex items-center gap-1 mt-1">
            <div className={cn("w-1 h-1 rounded-full", getVolatilityColor(data.volatility))} />
            <PerformanceIcon size={8} className={performanceColor} />
          </div>
        )}
      </div>
    );
  };

  const getCellBackground = () => {
    if (!data) return '';
    
    switch (viewMode) {
      case 'volatility':
        return getVolatilityColor(data.volatility);
      case 'performance':
        if (data.performance > 0) return 'bg-bullish/10 border-bullish/30';
        if (data.performance < 0) return 'bg-bearish/10 border-bearish/30';
        return 'bg-neutral/10 border-neutral/30';
      case 'liquidity':
        const intensity = Math.min(data.liquidity / 100000, 1);
        return `bg-chart-1/10 border-chart-1/30 opacity-${Math.floor(intensity * 100)}`;
      default:
        return getVolatilityColor(data.volatility);
    }
  };

  return (
    <div
      className={cn(
        "relative h-16 border border-border/30 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:shadow-sm",
        getCellBackground(),
        {
          'opacity-40': !isCurrentMonth,
          'ring-2 ring-primary ring-offset-1 ring-offset-background': isSelected,
          'ring-1 ring-chart-1': isCurrentDay,
          'bg-card/50': !data
        }
      )}
      onClick={onClick}
      onMouseEnter={() => onHover?.(data || null)}
      onMouseLeave={() => onHover?.(null)}
    >
      {cellContent()}
      
      {isCurrentDay && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-chart-1 rounded-full" />
      )}
    </div>
  );
};