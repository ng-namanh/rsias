import React, { useEffect, useState } from 'react'
import {
  TrendingUp, TrendingDown, Newspaper, RefreshCw, BarChart2, Hash
} from 'lucide-react'

// Make sure shadcn UI card components exist or we output styled HTML equivalents.
// From earlier contexts, rsias uses a custom/shadcn design system on standard HTML tags if components are missing.
// I will compose the UI carefully using standard Tailwind + typical Intercom/shadcn tokens.

export interface QuoteData {
  symbol: string
  short_name: string
  price: number
  change_pct: number
  volume: number
}

export interface NewsDataset {
  title: string
  publisher: string
  link: string
}

export interface IndexData {
  symbol: string
  short_name: string
  price: number
  change_pct: number
}

export interface MarketDashboardPayload {
  indices: IndexData[]
  gainers: QuoteData[]
  losers: QuoteData[]
  actives: QuoteData[]
  trending: QuoteData[]
  ai_digest: NewsDataset[]
  updated_at: string
}

export function MarketDashboard() {
  const [data, setData] = useState<MarketDashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8081/api/v1/market/dashboard')
      if (!res.ok) throw new Error('Failed to fetch market data')
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-52px)] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <RefreshCw className="animate-spin text-[#ff5600]" size={24} />
          <p className="text-[14px]">Loading market data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[calc(100vh-52px)] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-[8px] bg-rose-500/10 text-rose-500">
             <BarChart2 size={24} />
          </div>
          <p className="text-[14px] text-rose-500">{error || 'Failed to load'}</p>
          <button 
            onClick={fetchMarketData}
            className="mt-2 rounded-[6px] border border-border bg-secondary px-4 py-2 text-[14px] font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-52px)] flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      
      {/* 1. Header & AI Digest */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground">Market Snapshot</h1>
          <p className="text-[14px] text-muted-foreground">
            Real-time market insights powered by Go-YFinance. Updated at {new Date(data.updated_at).toLocaleTimeString()}.
          </p>
        </div>
        
        {/* AI Digest Card */}
        {data.ai_digest && data.ai_digest.length > 0 && (
          <div className="flex-1 w-full lg:max-w-md rounded-[12px] border border-[#ff5600]/20 bg-[#ff5600]/5 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper size={18} className="text-[#ff5600]" />
              <h2 className="text-[14px] font-semibold text-[#ff5600]">AI Digest: Top News</h2>
            </div>
            <div className="flex flex-col gap-3">
              {data.ai_digest.slice(0, 3).map((news, idx) => (
                <a key={idx} href={news.link} target="_blank" rel="noreferrer" className="group flex flex-col gap-1">
                  <p className="text-[13px] font-medium leading-snug text-foreground transition-colors group-hover:text-[#ff5600] line-clamp-2">
                    {news.title}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground uppercase">{news.publisher}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Indices Top Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.indices?.map((idx) => (
          <div key={idx.symbol} className="flex flex-col rounded-[12px] border border-border bg-card p-5 shadow-sm transition-all hover:border-border/80">
            <p className="text-[13px] font-medium text-muted-foreground">{idx.short_name || idx.symbol}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[20px] font-semibold tracking-tight text-foreground">
                ${idx.price.toFixed(2)}
              </span>
              <span className={`flex items-center text-[13px] font-medium ${idx.change_pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {idx.change_pct >= 0 ? '+' : ''}{idx.change_pct.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Market Categories: Trending, Gainers, Losers, Actives */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Trending / Actives */}
        <QuoteList title="Trending" icon={<Hash size={16} />} data={data.trending} />

        {/* Gainers */}
        <QuoteList 
          title="Top Gainers" 
          icon={<TrendingUp size={16} className="text-emerald-500" />} 
          data={data.gainers} 
          positive
        />

        {/* Losers */}
        <QuoteList 
          title="Top Losers" 
          icon={<TrendingDown size={16} className="text-rose-500" />} 
          data={data.losers} 
          negative
        />
        
      </div>
    </div>
  )
}

function QuoteList({ title, icon, data, positive, negative }: { title: string, icon: React.ReactNode, data: QuoteData[], positive?: boolean, negative?: boolean }) {
  if (!data || data.length === 0) return null
  
  return (
    <div className="flex flex-col rounded-[12px] border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-4 py-3">
        {icon}
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex flex-col divide-y divide-border/50">
        {data.slice(0, 10).map((q) => (
          <div key={q.symbol} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-secondary/20">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-foreground">{q.symbol}</span>
              <span className="text-[12px] text-muted-foreground w-32 truncate" title={q.short_name}>{q.short_name}</span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[14px] font-medium text-foreground">${q.price.toFixed(2)}</span>
              <span className={`text-[12px] font-medium ${positive ? 'text-emerald-500' : negative ? 'text-rose-500' : (q.change_pct >= 0 ? 'text-emerald-500' : 'text-rose-500')}`}>
                {q.change_pct >= 0 && !negative ? '+' : ''}{q.change_pct.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
