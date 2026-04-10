import React from 'react';
import { Newspaper, Clock } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Newspaper size={20} className="text-blue-600" />
          Intelligence News Feed
        </h2>
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">
          Real-time
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {news.length === 0 ? (
           <div className="p-8 text-center text-gray-400 italic">Waiting for news intelligence...</div>
        ) : (
          news.map((item, index) => (
            <div key={item.id || index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {item.source_name}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.published_at).toLocaleTimeString()}
                  </span>
                </div>
                {item.intelligence && (
                  <div className="flex gap-2">
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      item.intelligence.sentiment_score > 0 ? 'bg-green-50 text-green-700 border-green-200' : 
                      item.intelligence.sentiment_score < 0 ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      SENT: {item.intelligence.sentiment_score.toFixed(1)}
                    </div>
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      item.intelligence.trust_score > 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      item.intelligence.trust_score < 40 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      TRUST: {item.intelligence.trust_score.toFixed(0)}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-md font-semibold text-gray-900 leading-tight mb-1">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline-offset-2 hover:underline">
                  {item.headline}
                </a>
              </h3>
              {item.intelligence?.category && (
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Category: {item.intelligence.category}
                </div>
              )}
              <p className="text-sm text-gray-600 line-clamp-2">
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
