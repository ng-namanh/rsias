import React from 'react';
import { Newspaper, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  ticker: string;
  headline: string;
  content: string;
  timestamp: number;
}

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Newspaper size={20} className="text-blue-600" />
          Live News Feed
        </h2>
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">
          Live
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {news.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {item.ticker}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h3 className="text-md font-semibold text-gray-900 leading-tight">
              {item.headline}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
