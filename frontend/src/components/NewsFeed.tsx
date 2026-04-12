import { cn } from '@/lib/utils';
import { Clock, Newspaper } from 'lucide-react';
import React from 'react';

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
    <div className="bg-card rounded-lg shadow-md border overflow-hidden">
      <div className="bg-muted border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
          <Newspaper size={20} className="text-primary" />
          Intelligence News Feed
        </h2>
        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
          Real-time
        </span>
      </div>

      <div className="divide-y max-h-[600px] overflow-y-auto">
        {news.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic">
            Waiting for news intelligence...
          </div>
        ) : (
          news.map((item, index) => (
            <div key={item.id || index} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {item.source_name}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.published_at).toLocaleTimeString()}
                  </span>
                </div>

                {item.intelligence && (
                  <div className="flex gap-2">
                    <div className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded border',
                      item.intelligence.sentiment_score > 0
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900'
                        : item.intelligence.sentiment_score < 0
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-muted text-muted-foreground border'
                    )}>
                      SENT: {item.intelligence.sentiment_score.toFixed(1)}
                    </div>
                    <div className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded border',
                      item.intelligence.trust_score > 70
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900'
                        : item.intelligence.trust_score < 40
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900'
                          : 'bg-primary/10 text-primary border-primary/20'
                    )}>
                      TRUST: {item.intelligence.trust_score.toFixed(0)}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-md font-semibold text-foreground leading-tight mb-1">
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
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
