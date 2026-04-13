import { cn } from '@/lib/utils';
import { Clock, Newspaper } from 'lucide-react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface NewsIntelligence {
  sentiment_score: number;
  trust_score: number;
  category: string;
}

interface NewsItem {
  id?: string;
  source_name: string;
  headline: string;
  content_summary?: string;
  url: string;
  published_at: string;
  intelligence?: NewsIntelligence;
}

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-card shadow-sm p-0">
      <CardHeader className="bg-muted border-b border-border p-4 flex flex-row items-center justify-between rounded-none">
        <CardTitle className="text-xl font-bold tracking-tight leading-none text-foreground flex items-center gap-2">
          <Newspaper size={20} className="text-primary" />
          Intelligence News Feed
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-bold tracking-widest text-primary border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full uppercase">
          Real-time
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto">
        {news.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic">
            Waiting for news intelligence...
          </div>
        ) : (
          news.map((item, index) => (
            <React.Fragment key={item.id || index}>
              <div className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold text-primary bg-primary/5 rounded-sm h-5 py-0 px-1.5">
                      {item.source_name}
                    </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.published_at).toLocaleTimeString()}
                  </span>
                </div>

                {item.intelligence && (
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0 h-5 rounded-sm tracking-wide',
                        item.intelligence.sentiment_score > 0
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : item.intelligence.sentiment_score < 0
                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                            : 'bg-muted text-muted-foreground border-border'
                      )}>
                      SENT: {item.intelligence.sentiment_score.toFixed(1)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0 h-5 rounded-sm tracking-wide',
                        item.intelligence.trust_score > 70
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : item.intelligence.trust_score < 40
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-primary/10 text-primary border-primary/20'
                      )}>
                      TRUST: {item.intelligence.trust_score.toFixed(0)}
                    </Badge>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold tracking-tight text-foreground leading-tight mb-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary underline-offset-2 hover:underline"
                >
                  {item.headline}
                </a>
              </h3>

              {item.intelligence?.category && (
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Category: {item.intelligence.category}
                </div>
              )}

              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.content_summary}
              </p>
            </div>
            {index < news.length - 1 && <Separator />}
          </React.Fragment>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
