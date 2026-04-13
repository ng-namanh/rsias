import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

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
          <Card key={tick.ticker} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground tracking-tight">{tick.ticker}</h3>
                <span className="text-sm font-mono text-muted-foreground">
                  {new Date(tick.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground tracking-tighter leading-none">${tick.price.toFixed(2)}</span>
                <Badge variant={isPositive ? "default" : "destructive"} className="font-bold tracking-wide">
                  {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                  {Math.abs(movement).toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Helper for simulated movement
const randMovement = () => (Math.random() * 2 - 1);

export default StockDashboard;
