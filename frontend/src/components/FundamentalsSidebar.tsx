import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Fundamentals {
  symbol: string;
  name: string;
  market_cap: number;
  pe_ratio: number;
  revenue_growth: number;
}

interface FundamentalsSidebarProps {
  fundamentals: Fundamentals | null;
  isLoading: boolean;
}

const FundamentalsSidebar: React.FC<FundamentalsSidebarProps> = ({ fundamentals, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center p-6 bg-muted/20">
        <div className="text-muted-foreground font-mono text-xs animate-pulse">FETCHING_FINANCIAL_DATA...</div>
      </Card>
    );
  }

  if (!fundamentals) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20">
        <BarChart3 size={40} className="text-muted-foreground mb-4" />
        <h3 className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Select a company from the news feed to view metrics</h3>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="bg-muted p-4 border-b border-border rounded-none">
        <CardTitle className="text-primary font-mono text-xs flex items-center gap-2">
          <Activity size={14} />
          Business Intelligence
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-8 flex-1 overflow-y-auto">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-tighter mb-1">Company_Identity</div>
          <div className="text-2xl font-bold tracking-tighter text-foreground">{fundamentals.name}</div>
          <div className="text-sm font-mono text-primary/80">{fundamentals.symbol}</div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <MetricCard 
            label="Market_Cap" 
            value={`$${(fundamentals.market_cap / 1e12).toFixed(2)}T`} 
            icon={<DollarSign size={14} />} 
          />
          <MetricCard 
            label="P/E_Ratio" 
            value={fundamentals.pe_ratio.toFixed(2)} 
            icon={<Activity size={14} />} 
          />
          <MetricCard 
            label="Revenue_Growth" 
            value={`${fundamentals.revenue_growth.toFixed(1)}%`} 
            icon={<TrendingUp size={14} />} 
            isPositive={fundamentals.revenue_growth > 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ label, value, icon, isPositive }: { label: string, value: string, icon: React.ReactNode, isPositive?: boolean }) => (
  <Card className="shadow-sm hover:border-primary/30 transition-colors">
    <CardContent className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</span>
        <div className="text-primary/50">{icon}</div>
      </div>
      <div className="text-xl font-bold tracking-tighter text-foreground">{value}</div>
      {isPositive !== undefined && (
        <Badge variant={isPositive ? "default" : "destructive"} className="mt-1 w-fit rounded-sm px-1.5 font-bold uppercase tracking-wider text-[9px]">
          {isPositive ? '+' : '-'}{Math.abs(1.2).toFixed(2)}% <span className="font-normal opacity-80 ml-1">LTM</span>
        </Badge>
      )}
    </CardContent>
  </Card>
);

export default FundamentalsSidebar;
