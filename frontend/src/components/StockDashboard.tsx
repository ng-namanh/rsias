import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockTick {
  ticker: string;
  price: number;
  timestamp: number;
}

interface StockDashboardProps {
  ticks: StockTick[];
}

const StockDashboard: React.FC<StockDashboardProps> = ({ ticks }) => {
  const [tickerPrices, setTickerPrices] = useState<Record<string, StockTick>>({});

  useEffect(() => {
    ticks.forEach((tick) => {
      setTickerPrices((prev) => ({ ...prev, [tick.ticker]: tick }));
    });
  }, [ticks]);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(tickerPrices).map((tick) => {
        const movement = randMovement();
        const isPositive = movement > 0;

        return (
          <div key={tick.ticker} className="bg-card rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-card-foreground">{tick.ticker}</h3>
              <span className="text-sm text-muted-foreground">
                {new Date(tick.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">${tick.price.toFixed(2)}</span>
              <span className={cn(
                'flex items-center text-sm font-medium',
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'
              )}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(movement).toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper for simulated movement
const randMovement = () => (Math.random() * 2 - 1);

export default StockDashboard;
