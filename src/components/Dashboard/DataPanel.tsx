import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialData } from '@/types/financial';
import { DataAggregationService } from '@/services/dataAggregationService';
import { format, parseISO } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DataPanelProps {
  selectedData?: FinancialData;
  historicalData: FinancialData[];
  symbol: string;
  isVisible: boolean;
  onClose: () => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  selectedData,
  historicalData,
  symbol,
  isVisible,
  onClose
}) => {
  if (!isVisible || !selectedData) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance > 0) return 'text-bullish';
    if (performance < 0) return 'text-bearish';
    return 'text-neutral';
  };

  const getVolatilityLevel = (volatility: number) => {
    if (volatility < 2) return { level: 'Low', color: 'bg-volatility-low' };
    if (volatility < 5) return { level: 'Medium', color: 'bg-volatility-medium' };
    return { level: 'High', color: 'bg-volatility-high' };
  };

  const recentData = historicalData.slice(-7).map(d => ({
    date: format(parseISO(d.date), 'MMM dd'),
    price: d.close,
    volume: d.volume,
    volatility: d.volatility
  }));

  const volatilityInfo = getVolatilityLevel(selectedData.volatility);

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
    volume: {
      label: "Volume",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border/50 shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{symbol}</h2>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(selectedData.date), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-chart-1" />
                <span className="text-sm font-medium">Close Price</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(selectedData.close)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-chart-2" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedData.performance > 0 ? 
                  <TrendingUp className="h-4 w-4 text-bullish" /> : 
                  <TrendingDown className="h-4 w-4 text-bearish" />
                }
                <p className={`text-lg font-bold ${getPerformanceColor(selectedData.performance)}`}>
                  {selectedData.performance.toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium">Volatility</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={volatilityInfo.color}>
                  {volatilityInfo.level}
                </Badge>
                <p className="text-lg font-bold">{selectedData.volatility.toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-chart-4" />
                <span className="text-sm font-medium">Volume</span>
              </div>
              <p className="text-lg font-bold">{formatVolume(selectedData.volume)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Daily Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open</p>
                <p className="font-bold">{formatCurrency(selectedData.open)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">High</p>
                <p className="font-bold text-bullish">{formatCurrency(selectedData.high)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Low</p>
                <p className="font-bold text-bearish">{formatCurrency(selectedData.low)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Intraday Range</p>
                <p className="font-bold">{formatCurrency(selectedData.high - selectedData.low)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Range %</p>
                <p className="font-bold">{(((selectedData.high - selectedData.low) / selectedData.open) * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Volume Intensity</p>
                <Badge variant="outline">
                  {DataAggregationService.getDetailedMetrics(selectedData).volumeIntensity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Price Trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">7-Day Price Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Volatility Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">7-Day Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    type="monotone"
                    dataKey="volatility"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};