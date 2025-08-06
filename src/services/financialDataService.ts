import axios from 'axios';
import { FinancialData, OrderBookData, TickerData } from '@/types/financial';
import { format, subDays, parseISO } from 'date-fns';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

export class FinancialDataService {
  // Get ticker data for a symbol
  static async getTickerData(symbol: string): Promise<TickerData> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ticker data:', error);
      throw error;
    }
  }

  // Get historical kline data
  static async getHistoricalData(
    symbol: string, 
    interval: string = '1d', 
    limit: number = 30
  ): Promise<FinancialData[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/klines`, {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          limit
        }
      });

      return response.data.map((kline: any[]) => {
        const [timestamp, open, high, low, close, volume] = kline;
        const openPrice = parseFloat(open);
        const closePrice = parseFloat(close);
        const highPrice = parseFloat(high);
        const lowPrice = parseFloat(low);
        
        // Calculate volatility as a percentage of the price range
        const volatility = ((highPrice - lowPrice) / openPrice) * 100;
        
        // Calculate performance as price change percentage
        const performance = ((closePrice - openPrice) / openPrice) * 100;
        
        // Use volume as liquidity indicator
        const liquidity = parseFloat(volume);

        return {
          date: format(new Date(timestamp), 'yyyy-MM-dd'),
          symbol: symbol.toUpperCase(),
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: liquidity,
          volatility,
          performance,
          liquidity
        };
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Get order book data
  static async getOrderBookData(symbol: string): Promise<OrderBookData> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/depth`, {
        params: { 
          symbol: symbol.toUpperCase(),
          limit: 20
        }
      });
      
      return {
        symbol: symbol.toUpperCase(),
        bids: response.data.bids,
        asks: response.data.asks,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching order book data:', error);
      throw error;
    }
  }

  // Generate mock data for demo purposes when API is unavailable
  static generateMockData(symbol: string, days: number = 30): FinancialData[] {
    const data: FinancialData[] = [];
    const basePrice = 50000; // Base price for BTCUSDT-like data
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      
      // Generate somewhat realistic price movements
      const randomFactor = 0.95 + Math.random() * 0.1; // ±5% daily movement
      const open = basePrice * randomFactor;
      const volatility = 1 + Math.random() * 8; // 1-9% volatility
      const high = open * (1 + volatility / 100);
      const low = open * (1 - volatility / 100);
      const close = low + Math.random() * (high - low);
      
      const volume = 10000 + Math.random() * 50000;
      const performance = ((close - open) / open) * 100;
      
      data.push({
        date,
        symbol: symbol.toUpperCase(),
        open,
        high,
        low,
        close,
        volume,
        volatility,
        performance,
        liquidity: volume
      });
    }
    
    return data;
  }

  // Get available trading symbols
  static async getAvailableSymbols(): Promise<string[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/exchangeInfo`);
      return response.data.symbols
        .filter((symbol: any) => symbol.status === 'TRADING' && symbol.symbol.includes('USDT'))
        .slice(0, 10) // Limit to first 10 for demo
        .map((symbol: any) => symbol.symbol);
    } catch (error) {
      console.error('Error fetching symbols:', error);
      // Return mock symbols if API fails
      return ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];
    }
  }
}