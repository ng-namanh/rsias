import React from 'react';
import { Newspaper, Globe, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

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
    <Card className="overflow-hidden h-full flex flex-col p-0">
      <CardHeader className="bg-muted p-3 pb-3 border-b border-border rounded-none flex-row items-center justify-between">
        <CardTitle className="text-primary font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
          <Newspaper size={14} />
          Terminal Broadcast
        </CardTitle>
        <span className="text-[10px] m-0 leading-none font-mono text-muted-foreground animate-pulse">REC // LIVE</span>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {news.length === 0 && (
          <div className="p-10 text-center text-muted-foreground font-mono text-xs">
            AWAITING_INBOUND_SIGNALS...
          </div>
        )}
        {news.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="p-3 hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="text-[9px] font-mono font-bold text-primary rounded-sm py-0 h-4">
                  {item.ticker}
                </Badge>
                <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                  <Globe size={10} />
                  GLOBAL
                </span>
                <span className="text-[9px] font-mono text-muted-foreground ml-auto">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-xs font-mono text-foreground leading-relaxed group-hover:text-primary transition-colors">
                {item.headline}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="default" className="flex items-center gap-1 text-[9px] font-mono rounded-sm py-0 h-4">
                  <ArrowUpRight size={10} />
                  IMPACT: HIGH
                </Badge>
                <div className="text-[9px] font-mono text-muted-foreground uppercase italic">
                  Verified: Source_Alpha
                </div>
              </div>
            </div>
            {index < news.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsBroadcast;
