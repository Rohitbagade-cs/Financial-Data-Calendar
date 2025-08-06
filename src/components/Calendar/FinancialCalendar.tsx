import React, { useState, useEffect } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { CalendarControls } from './CalendarControls';
import { DataPanel } from '../Dashboard/DataPanel';
import { FinancialDataService } from '@/services/financialDataService';
import { DataAggregationService, AggregatedData } from '@/services/dataAggregationService';
import { CalendarData, FinancialData, TimeFrame, ViewMode } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const FinancialCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedDate, setSelectedDate] = useState<string>();
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [historicalData, setHistoricalData] = useState<FinancialData[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredData, setHoveredData] = useState<FinancialData | null>(null);
  
  const { toast } = useToast();

  // Load available symbols on mount
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const symbols = await FinancialDataService.getAvailableSymbols();
        setAvailableSymbols(symbols);
      } catch (error) {
        // Fallback to mock symbols
        setAvailableSymbols(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']);
      }
    };
    loadSymbols();
  }, []);

  // Load financial data when symbol or timeframe changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try to get real data first, fallback to mock data
        let data: FinancialData[];
        try {
          data = await FinancialDataService.getHistoricalData(selectedSymbol, '1d', 90);
        } catch (error) {
          console.warn('API unavailable, using mock data');
          data = FinancialDataService.generateMockData(selectedSymbol, 90);
          toast({
            title: "Using Demo Data",
            description: "Live API is unavailable. Showing simulated financial data for demonstration.",
            variant: "default"
          });
        }

        setHistoricalData(data);
        
        // Aggregate data based on timeFrame
        let processedData: (FinancialData | AggregatedData)[];
        
        if (timeFrame === 'weekly') {
          processedData = DataAggregationService.aggregateWeeklyData(
            data, 
            currentMonth.getFullYear(), 
            currentMonth.getMonth()
          );
        } else if (timeFrame === 'monthly') {
          processedData = DataAggregationService.aggregateMonthlyData(
            data, 
            currentMonth.getFullYear()
          );
        } else {
          processedData = data;
        }
        
        // Convert array to calendar data object
        const calendarDataObj: CalendarData = {};
        processedData.forEach(item => {
          calendarDataObj[item.date] = item as FinancialData;
        });
        setCalendarData(calendarDataObj);
        
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load financial data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSymbol) {
      loadData();
    }
  }, [selectedSymbol, timeFrame, currentMonth, toast]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (calendarData[date]) {
      setIsPanelVisible(true);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    const todayString = today.toISOString().split('T')[0];
    if (calendarData[todayString]) {
      setSelectedDate(todayString);
      setIsPanelVisible(true);
    }
  };

  const selectedData = selectedDate ? calendarData[selectedDate] : undefined;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Financial Data Calendar
          </h1>
          <p className="text-muted-foreground">
            Interactive visualization of volatility, liquidity, and performance data across time periods
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading financial data...</span>
          </div>
        )}

        {/* Calendar Controls */}
        <CalendarControls
          currentMonth={currentMonth}
          timeFrame={timeFrame}
          viewMode={viewMode}
          selectedSymbol={selectedSymbol}
          availableSymbols={availableSymbols}
          onMonthChange={setCurrentMonth}
          onTimeFrameChange={setTimeFrame}
          onViewModeChange={setViewMode}
          onSymbolChange={setSelectedSymbol}
          onToday={handleToday}
        />

        {/* Calendar Grid */}
        <div className="relative">
          <CalendarGrid
            currentMonth={currentMonth}
            data={calendarData}
            viewMode={viewMode}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onCellHover={setHoveredData}
          />

          {/* Hover Tooltip */}
          {hoveredData && (
            <div className="fixed bottom-4 left-4 bg-popover border border-border rounded-lg p-3 shadow-lg z-40 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{hoveredData.symbol}</span>
                <span className="text-muted-foreground text-sm">{hoveredData.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Close:</span>
                  <div className="font-mono">${hoveredData.close.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Change:</span>
                  <div className={`font-mono ${hoveredData.performance >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {hoveredData.performance.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Volatility:</span>
                  <div className="font-mono">{hoveredData.volatility.toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Volume:</span>
                  <div className="font-mono">{(hoveredData.volume / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Panel */}
        <DataPanel
          selectedData={selectedData}
          historicalData={historicalData}
          symbol={selectedSymbol}
          isVisible={isPanelVisible}
          onClose={() => setIsPanelVisible(false)}
        />
      </div>
    </div>
  );
};