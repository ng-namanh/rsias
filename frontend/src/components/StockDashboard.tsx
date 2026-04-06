import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
      {Object.values(tickerPrices).map((tick) => (
        <div key={tick.ticker} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{tick.ticker}</h3>
            <span className="text-sm text-gray-500">{new Date(tick.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">${tick.price.toFixed(2)}</span>
            <span className={`flex items-center text-sm font-medium ${randMovement() > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {randMovement() > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(randMovement()).toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper for simulated movement
const randMovement = () => (Math.random() * 2 - 1);

export default StockDashboard;
