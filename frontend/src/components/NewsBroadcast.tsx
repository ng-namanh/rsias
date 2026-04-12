import React from 'react';
import { Newspaper, Globe, ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: string;
  ticker: string;
  headline: string;
  content: string;
  timestamp: number;
}

interface NewsBroadcastProps {
  news: NewsItem[];
}

const NewsBroadcast: React.FC<NewsBroadcastProps> = ({ news }) => {
  return (
    <div className="bg-zinc-950 border border-orange-500/20 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-zinc-900/50 p-3 border-b border-orange-500/10 flex items-center justify-between">
        <h2 className="text-orange-500 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
          <Newspaper size={14} />
          Terminal Broadcast
        </h2>
        <span className="text-[10px] font-mono text-zinc-500 animate-pulse">REC // LIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {news.length === 0 && (
          <div className="p-10 text-center text-zinc-700 font-mono text-xs">
            AWAITING_INBOUND_SIGNALS...
          </div>
        )}
        {news.map((item) => (
          <div key={item.id} className="p-3 border-b border-zinc-900 hover:bg-orange-500/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-mono font-bold bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded border border-orange-500/20">
                {item.ticker}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                <Globe size={10} />
                GLOBAL
              </span>
              <span className="text-[9px] font-mono text-zinc-600 ml-auto">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h3 className="text-xs font-mono text-zinc-300 leading-relaxed group-hover:text-orange-400 transition-colors">
              {item.headline}
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1 text-[9px] font-mono text-green-500 bg-green-500/5 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={10} />
                IMPACT: HIGH
              </div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase italic">
                Verified: Source_Alpha
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsBroadcast;
