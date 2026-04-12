import React from 'react';

const GlobalHeatmap: React.FC = () => {
  return (
    <div className="bg-zinc-950 border border-orange-500/20 rounded-lg p-4 h-[400px] relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-orange-500 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="size-1.5 bg-orange-500 rounded-full animate-ping" />
          Global Sentiment Heatmap
        </h2>
        <div className="flex gap-3 text-[10px] font-mono text-zinc-500">
          <span>LIVE_FEED: KAFKA_CLUSTER_01</span>
          <span className="text-orange-500/50">REGION: GLOBAL</span>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center opacity-60">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Stylized regions */}
          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="100" y="100" width="250" height="180" rx="4" className="fill-orange-500/10 stroke-orange-500/30 stroke-1" />
            <text x="225" y="190" className="fill-orange-500/40 font-mono text-[10px]" textAnchor="middle">NORTH_AMERICA</text>
            <text x="225" y="210" className="fill-green-500 font-mono text-[14px] font-bold" textAnchor="middle">+2.41%</text>
          </g>

          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="420" y="80" width="120" height="120" rx="4" className="fill-green-500/10 stroke-green-500/30 stroke-1" />
            <text x="480" y="140" className="fill-green-500/40 font-mono text-[10px]" textAnchor="middle">EUROPE</text>
            <text x="480" y="160" className="fill-green-500 font-mono text-[14px] font-bold" textAnchor="middle">+0.85%</text>
          </g>

          <g className="hover:opacity-100 transition-opacity cursor-crosshair">
            <rect x="600" y="120" width="300" height="220" rx="4" className="fill-red-500/10 stroke-red-500/30 stroke-1" />
            <text x="750" y="230" className="fill-red-500/40 font-mono text-[10px]" textAnchor="middle">ASIA_PACIFIC</text>
            <text x="750" y="250" className="fill-red-500 font-mono text-[14px] font-bold" textAnchor="middle">-1.12%</text>
          </g>
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-600 flex flex-col gap-1">
        <div>LATENCY: 12ms</div>
        <div>Uptime: 99.99%</div>
      </div>
    </div>
  );
};

export default GlobalHeatmap;
