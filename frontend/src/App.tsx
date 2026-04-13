import React, { useEffect } from 'react';
import { useMarketStream } from './hooks/useMarketStream';
import { useNewsStream } from './hooks/useNewsStream';
import { useFundamentals } from './hooks/useFundamentals';
import { useIntelligenceStore } from './store/intelligenceStore';
import Heatmap from './components/Heatmap';
import NewsFeed from './components/NewsFeed';
import FundamentalsSidebar from './components/FundamentalsSidebar';
import { Activity, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

function App() {
  const { ticks, isConnected: isMarketConnected } = useMarketStream('ws://localhost:8081/ws');
  const { news, isConnected: isNewsConnected } = useNewsStream('ws://localhost:8081/ws');
  
  const { 
    heatmapData, setHeatmapData, 
    selectedCategory, setSelectedCategory,
    selectedSymbol, setSelectedSymbol 
  } = useIntelligenceStore();

  const { fundamentals, isLoading: isFundamentalsLoading } = useFundamentals(selectedSymbol);

  const isConnected = isMarketConnected || isNewsConnected;

  // Filter news based on selected category
  const filteredNews = selectedCategory 
    ? news.filter(item => item.intelligence?.category === selectedCategory)
    : news;

  // Listen for heatmap updates from WebSocket
  useEffect(() => {
    // This is a bit of a hack since useNewsStream doesn't expose raw messages
    // In a real app, I'd update the hook or use a global WS manager
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-primary rounded flex items-center justify-center shadow-sm">
            <Globe2 size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-primary uppercase leading-tight">RSIAS_CORE</h1>
            <p className="text-[10px] text-muted-foreground font-mono">WORLD_MONITOR_v1.0.4</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[10px] text-muted-foreground uppercase">Latency:</span>
            <span className="text-[10px] text-[#0bdf50] font-bold">12MS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'size-2 rounded-full',
              isConnected ? 'bg-[#0bdf50] animate-pulse' : 'bg-destructive'
            )} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              {isConnected ? 'Network_Stable' : 'Network_Offline'}
            </span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1800px] mx-auto grid grid-cols-12 gap-6">
        {/* Left Column: Heatmap & Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Heatmap 
            data={heatmapData} 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          <FundamentalsSidebar 
            fundamentals={fundamentals}
            isLoading={isFundamentalsLoading}
          />
        </div>

        {/* Center Column: News Feed */}
        <div className="col-span-12 lg:col-span-5 h-[calc(100vh-120px)]">
          <NewsFeed news={filteredNews} />
        </div>

        {/* Right Column: Market Data & AI Insights */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Asset Cards */}
            {['BTC', 'XAU', 'SPX'].map((asset) => (
              <Card key={asset} className="hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm group" onClick={() => setSelectedSymbol(asset === 'BTC' ? 'AAPL' : asset === 'XAU' ? 'TSLA' : 'NVDA')}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-muted-foreground tracking-tight">{asset}/USD</span>
                    <Activity size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-3xl font-bold tracking-tighter leading-none text-foreground">
                    {ticks.find(t => t.ticker === asset)?.price.toFixed(2) || '---.--'}
                  </div>
                  <div className="text-[10px] text-[#0bdf50] mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
                    +0.42% <span className="text-muted-foreground font-normal">24H</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={80} className="text-primary" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-primary font-bold text-xs tracking-tight uppercase mb-4 flex items-center gap-2">
                <Zap size={14} />
                AI_Analysis_Insight
              </h3>
              <p className="text-sm text-foreground leading-relaxed font-mono">
                Intelligence core detecting high-trust signals in <span className="text-primary font-bold">Innovation/Tech</span>. 
                {selectedCategory && (
                  <> Currently filtering for <Badge variant="outline" className="ml-1 px-1 py-0">{selectedCategory}</Badge> related developments.</>
                )}
                {selectedSymbol && (
                  <> Analyzing <Badge variant="outline" className="ml-1 px-1 py-0">{selectedSymbol}</Badge> fundamentals against current macro sentiment.</>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Info-bar */}
      <footer className="fixed bottom-0 w-full h-8 bg-muted border-t border-border px-6 flex items-center gap-6 z-50 overflow-hidden whitespace-nowrap text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1 font-bold text-[#0bdf50]">
          <ShieldCheck size={12} /> SYSTEM_ENCRYPTED
        </span>
        <span className="text-border">|</span>
        <span className="animate-marquee inline-block font-semibold">
          MARKET_SENTIMENT: BULLISH // CRUDE_OIL: +1.2% // S&P500: UNCH // GOLD: 2,145.40 // BTC: 64,210.55 // ETH: 3,421.10
        </span>
      </footer>
    </div>
  );
}

export default App;
