import { useState, useEffect, useRef } from 'react';

export interface NewsIntelligence {
  sentiment_score: number;
  trust_score: number;
  category: string;
}

export interface NewsItem {
  id?: string;
  source_name: string;
  headline: string;
  content_summary?: string;
  url: string;
  published_at: string;
  intelligence?: NewsIntelligence;
}

export const useNewsStream = (url: string) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Check if it's an enriched news article
        if (data.article && data.intelligence) {
          const newItem: NewsItem = {
            ...data.article,
            intelligence: data.intelligence
          };
          setNews((prev) => {
            // Avoid duplicates by URL
            if (prev.some(item => item.url === newItem.url)) {
              return prev;
            }
            return [newItem, ...prev].slice(0, 50);
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return { news, isConnected };
};
