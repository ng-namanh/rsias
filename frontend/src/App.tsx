import React from 'react';
import { useMarketStream } from './hooks/useMarketStream';
import { useNewsStream } from './hooks/useNewsStream';
import GlobalHeatmap from './components/GlobalHeatmap';
import NewsFeed from './components/NewsFeed';
import { Activity, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const { ticks, isConnected: isMarketConnected } = useMarketStream('ws://localhost:8081/ws');
  const { news, isConnected: isNewsConnected } = useNewsStream('ws://localhost:8081/ws');
  const isConnected = isMarketConnected || isNewsConnected;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-mono selection:bg-orange-500/30">
      {/* Top Header */}
      <header className="h-14 border-b border-orange-500/20 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-orange-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <Globe2 size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter text-orange-500 uppercase">RSIAS_CORE</h1>
            <p className="text-[9px] text-zinc-500 mt-[-2px]">WORLD_MONITOR_v1.0.4</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase">Latency:</span>
            <span className="text-[10px] text-green-500 font-bold">12MS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'size-2 rounded-full',
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-destructive'
            )} />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
              {isConnected ? 'Network_Stable' : 'Network_Offline'}
            </span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        {/* Left Column: Heatmap & Metrics */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <GlobalHeatmap />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Asset Cards */}
            {['BTC/USD', 'XAU/USD', 'SPX_500'].map((asset) => (
              <div key={asset} className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg hover:border-orange-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-500">{asset}</span>
                  <Activity size={14} className="text-orange-500/50" />
                </div>
                <div className="text-2xl font-bold tracking-tighter">
                  {ticks.find(t => t.ticker === asset.split('/')[0])?.price.toFixed(2) || '---.--'}
                </div>
                <div className="text-[10px] text-green-500 mt-1 font-bold">
                  +0.42% <span className="text-zinc-600 font-normal ml-1">24H</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights Placeholder */}
          <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={80} />
            </div>
            <h3 className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
              <Zap size={14} />
              AI_Analysis_Insight
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl font-mono">
              SENTIMENT_CORE reports high correlation between EUR_ENERGY_POLICY and TSLA production forecasts.
              Macro-risk scores for APAC region have stabilized following recent trade agreements.
              <span className="text-orange-500/80 underline decoration-dotted cursor-pointer ml-1">Analyze Deep Report_</span>
            </p>
          </div>
        </div>

        {/* Right Column: News Ticker */}
        <div className="col-span-12 lg:col-span-4 h-[calc(100vh-120px)]">
          <NewsFeed news={news} />
        </div>
      </main>

      {/* Footer Info-bar */}
      <footer className="fixed bottom-0 w-full h-8 bg-black border-t border-zinc-900 px-6 flex items-center gap-6 z-50 overflow-hidden whitespace-nowrap text-[9px] font-mono text-zinc-600">
        <span className="flex items-center gap-1">
          <ShieldCheck size={10} className="text-green-500" /> SYSTEM_ENCRYPTED
        </span>
        <span className="text-zinc-800">|</span>
        <span className="animate-marquee inline-block">
          MARKET_SENTIMENT: BULLISH // CRUDE_OIL: +1.2% // S&P500: UNCH // GOLD: 2,145.40 // BTC: 64,210.55 // ETH: 3,421.10
        </span>
      </footer>
    </div>
  );
}

export default App;
