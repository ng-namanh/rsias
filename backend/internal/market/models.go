package market

import "time"

// MarketDashboard is the aggregated response for the market overview page.
type MarketDashboard struct {
	Indices   []IndexData   `json:"indices"`
	Gainers   []QuoteData   `json:"gainers"`
	Losers    []QuoteData   `json:"losers"`
	Actives   []QuoteData   `json:"actives"`
	Trending  []QuoteData   `json:"trending"`
	AIDigest  []NewsDataset `json:"ai_digest"`
	UpdatedAt time.Time     `json:"updated_at"`
}

// IndexData represents a major market index (S&P 500, DOW, NASDAQ).
type IndexData struct {
	Symbol    string  `json:"symbol"`
	ShortName string  `json:"short_name"`
	Price     float64 `json:"price"`
	ChangePct float64 `json:"change_pct"`
}

// QuoteData represents a single stock quote in a screener list.
type QuoteData struct {
	Symbol    string  `json:"symbol"`
	ShortName string  `json:"short_name"`
	Price     float64 `json:"price"`
	ChangePct float64 `json:"change_pct"`
	Volume    int64   `json:"volume"`
}

// NewsDataset represents a single news headline for the AI Digest.
type NewsDataset struct {
	Title     string `json:"title"`
	Publisher string `json:"publisher"`
	Link      string `json:"link"`
}
