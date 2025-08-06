import { FinancialData, TimeFrame } from '@/types/financial';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  format, 
  parseISO,
  isWithinInterval,
  eachWeekOfInterval,
  eachMonthOfInterval
} from 'date-fns';

export interface AggregatedData extends FinancialData {
  periodStart: string;
  periodEnd: string;
  tradingDays: number;
  averageVolatility: number;
  totalVolume: number;
  weeklyPerformance?: number;
  monthlyPerformance?: number;
}

export class DataAggregationService {
  static aggregateWeeklyData(data: FinancialData[], year: number, month: number): AggregatedData[] {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    
    const weeks = eachWeekOfInterval({
      start: monthStart,
      end: monthEnd
    });

    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const weekData = data.filter(d => {
        const date = parseISO(d.date);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      });

      if (weekData.length === 0) {
        return {
          date: format(weekStart, 'yyyy-MM-dd'),
          periodStart: format(weekStart, 'yyyy-MM-dd'),
          periodEnd: format(weekEnd, 'yyyy-MM-dd'),
          symbol: '',
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          volatility: 0,
          performance: 0,
          liquidity: 0,
          tradingDays: 0,
          averageVolatility: 0,
          totalVolume: 0,
          weeklyPerformance: 0
        };
      }

      const firstDay = weekData[0];
      const lastDay = weekData[weekData.length - 1];
      const totalVolume = weekData.reduce((sum, d) => sum + d.volume, 0);
      const averageVolatility = weekData.reduce((sum, d) => sum + d.volatility, 0) / weekData.length;
      const weeklyPerformance = ((lastDay.close - firstDay.open) / firstDay.open) * 100;

      return {
        date: format(weekStart, 'yyyy-MM-dd'),
        periodStart: format(weekStart, 'yyyy-MM-dd'),
        periodEnd: format(weekEnd, 'yyyy-MM-dd'),
        symbol: firstDay.symbol,
        open: firstDay.open,
        high: Math.max(...weekData.map(d => d.high)),
        low: Math.min(...weekData.map(d => d.low)),
        close: lastDay.close,
        volume: totalVolume,
        volatility: averageVolatility,
        performance: weeklyPerformance,
        liquidity: totalVolume,
        tradingDays: weekData.length,
        averageVolatility,
        totalVolume,
        weeklyPerformance
      };
    });
  }

  static aggregateMonthlyData(data: FinancialData[], year: number): AggregatedData[] {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    const months = eachMonthOfInterval({
      start: yearStart,
      end: yearEnd
    });

    return months.map(monthStart => {
      const monthEnd = endOfMonth(monthStart);
      const monthData = data.filter(d => {
        const date = parseISO(d.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });

      if (monthData.length === 0) {
        return {
          date: format(monthStart, 'yyyy-MM-dd'),
          periodStart: format(monthStart, 'yyyy-MM-dd'),
          periodEnd: format(monthEnd, 'yyyy-MM-dd'),
          symbol: '',
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          volatility: 0,
          performance: 0,
          liquidity: 0,
          tradingDays: 0,
          averageVolatility: 0,
          totalVolume: 0,
          monthlyPerformance: 0
        };
      }

      const firstDay = monthData[0];
      const lastDay = monthData[monthData.length - 1];
      const totalVolume = monthData.reduce((sum, d) => sum + d.volume, 0);
      const averageVolatility = monthData.reduce((sum, d) => sum + d.volatility, 0) / monthData.length;
      const monthlyPerformance = ((lastDay.close - firstDay.open) / firstDay.open) * 100;

      // Calculate monthly volatility trends
      const volatilityTrend = monthData.length > 1 ? 
        (monthData[monthData.length - 1].volatility - monthData[0].volatility) : 0;

      return {
        date: format(monthStart, 'yyyy-MM-dd'),
        periodStart: format(monthStart, 'yyyy-MM-dd'),
        periodEnd: format(monthEnd, 'yyyy-MM-dd'),
        symbol: firstDay.symbol,
        open: firstDay.open,
        high: Math.max(...monthData.map(d => d.high)),
        low: Math.min(...monthData.map(d => d.low)),
        close: lastDay.close,
        volume: totalVolume,
        volatility: averageVolatility,
        performance: monthlyPerformance,
        liquidity: totalVolume,
        tradingDays: monthData.length,
        averageVolatility,
        totalVolume,
        monthlyPerformance
      };
    });
  }

  static getDetailedMetrics(data: FinancialData): {
    intradayRange: number;
    intradayRangePercent: number;
    volumeIntensity: 'Low' | 'Medium' | 'High';
    priceChangePercent: number;
    liquidityScore: number;
  } {
    const intradayRange = data.high - data.low;
    const intradayRangePercent = (intradayRange / data.open) * 100;
    
    // Volume intensity based on relative volume
    let volumeIntensity: 'Low' | 'Medium' | 'High' = 'Medium';
    if (data.volume < 10000) volumeIntensity = 'Low';
    else if (data.volume > 50000) volumeIntensity = 'High';
    
    const priceChangePercent = ((data.close - data.open) / data.open) * 100;
    const liquidityScore = Math.min(data.volume / 100000, 1) * 100; // 0-100 scale

    return {
      intradayRange,
      intradayRangePercent,
      volumeIntensity,
      priceChangePercent,
      liquidityScore
    };
  }
}