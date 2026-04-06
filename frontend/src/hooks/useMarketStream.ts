import { useState, useEffect, useRef } from 'react';

export const useMarketStream = (url: string) => {
  const [ticks, setTicks] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected to BFF');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Determine if it's a tick or news by the presence of fields
      if (data.price !== undefined) {
        setTicks((prev) => [data, ...prev].slice(0, 50));
      } else if (data.headline !== undefined) {
        setNews((prev) => [data, ...prev].slice(0, 20));
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return { ticks, news, isConnected };
};
