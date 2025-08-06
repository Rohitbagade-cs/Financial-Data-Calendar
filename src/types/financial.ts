export interface FinancialData {
  date: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility: number;
  performance: number;
  liquidity: number;
}

export interface CalendarData {
  [date: string]: FinancialData;
}

export interface OrderBookData {
  symbol: string;
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
  timestamp: number;
}

export interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  count: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly';
export type ViewMode = 'volatility' | 'liquidity' | 'performance' | 'all';

export interface CalendarConfig {
  timeFrame: TimeFrame;
  viewMode: ViewMode;
  selectedSymbol: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}