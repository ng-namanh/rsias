import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const GlobalHeatmap: React.FC = () => {
  return (
    <Card className="h-[400px] relative overflow-hidden group shadow-sm transition-all hover:border-primary/30 flex flex-col p-0 gap-0">
      <CardHeader className="flex flex-row justify-between items-center p-4 pb-0">
        <CardTitle className="text-primary font-mono text-xs font-bold tracking-tight uppercase flex items-center gap-2">
          <span className="size-1.5 bg-primary rounded-full animate-ping" />
          Global Sentiment Heatmap
        </CardTitle>
        <div className="flex gap-3 text-[10px] font-mono text-muted-foreground mt-0">
          <span>LIVE_FEED: KAFKA_CLUSTER_01</span>
          <span className="font-semibold text-foreground">REGION: GLOBAL</span>
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 w-full flex items-center justify-center opacity-80 mix-blend-multiply p-0">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Stylized regions */}
          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="100" y="100" width="250" height="180" rx="4" className="fill-primary/5 stroke-primary/20 stroke-1 hover:fill-primary/10 transition-colors" />
            <text x="225" y="190" className="fill-muted-foreground font-mono text-[10px]" textAnchor="middle">NORTH_AMERICA</text>
            <text x="225" y="210" className="fill-[#0bdf50] font-mono text-[14px] font-bold" textAnchor="middle">+2.41%</text>
          </g>

          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="420" y="80" width="120" height="120" rx="4" className="fill-[#0bdf50]/5 stroke-[#0bdf50]/30 stroke-1 hover:fill-[#0bdf50]/10 transition-colors" />
            <text x="480" y="140" className="fill-muted-foreground font-mono text-[10px]" textAnchor="middle">EUROPE</text>
            <text x="480" y="160" className="fill-[#0bdf50] font-mono text-[14px] font-bold" textAnchor="middle">+0.85%</text>
          </g>

          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="600" y="120" width="300" height="220" rx="4" className="fill-destructive/5 stroke-destructive/30 stroke-1 hover:fill-destructive/10 transition-colors" />
            <text x="750" y="230" className="fill-muted-foreground font-mono text-[10px]" textAnchor="middle">ASIA_PACIFIC</text>
            <text x="750" y="250" className="fill-destructive font-mono text-[14px] font-bold" textAnchor="middle">-1.12%</text>
          </g>
        </svg>
      </CardContent>

      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted-foreground flex flex-col gap-1 pointer-events-none">
        <div>LATENCY: 12ms</div>
        <div>Uptime: 99.99%</div>
      </div>
    </Card>
  );
};

export default GlobalHeatmap;
