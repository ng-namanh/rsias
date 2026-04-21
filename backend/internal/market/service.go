package market

import (
	"log"
	"sync"
	"time"

	"github.com/wnjoon/go-yfinance/pkg/market"
	"github.com/wnjoon/go-yfinance/pkg/models"
	"github.com/wnjoon/go-yfinance/pkg/screener"
	"github.com/wnjoon/go-yfinance/pkg/search"
)

// MarketService encapsulates business logic for fetching market data.
type MarketService struct{}

// NewMarketService creates a new MarketService.
func NewMarketService() *MarketService {
	return &MarketService{}
}

// GetDashboard aggregates multiple yfinance feeds concurrently into a single response.
func (s *MarketService) GetDashboard() (*MarketDashboard, error) {
	var wg sync.WaitGroup
	dashboard := &MarketDashboard{
		UpdatedAt: time.Now(),
	}

	// 1. Fetch Indices
	wg.Add(1)
	go func() {
		defer wg.Done()
		m, err := market.New("us_market")
		if err != nil {
			log.Printf("market.New error: %v", err)
			return
		}
		defer m.Close()

		summary, err := m.Summary()
		if err == nil {
			for _, item := range summary {
				dashboard.Indices = append(dashboard.Indices, IndexData{
					Symbol:    item.Symbol,
					ShortName: item.ShortName,
					Price:     item.RegularMarketPrice,
					ChangePct: item.RegularMarketChangePercent,
				})
			}
		}
	}()

	// 2. Fetch Gainers, Losers, Actives via Screener
	wg.Add(1)
	go func() {
		defer wg.Done()
		sc, err := screener.New()
		if err != nil {
			log.Printf("screener.New error: %v", err)
			return
		}
		defer sc.Close()

		if gainers, err := sc.DayGainers(10); err == nil {
			for _, q := range gainers.Quotes {
				dashboard.Gainers = append(dashboard.Gainers, mapScreenerQuote(q))
			}
		}

		if losers, err := sc.DayLosers(10); err == nil {
			for _, q := range losers.Quotes {
				dashboard.Losers = append(dashboard.Losers, mapScreenerQuote(q))
			}
		}

		if actives, err := sc.MostActives(10); err == nil {
			for _, q := range actives.Quotes {
				dashboard.Actives = append(dashboard.Actives, mapScreenerQuote(q))
			}
		}
	}()

	// 3. Fetch AI Digest (News) via Search
	wg.Add(1)
	go func() {
		defer wg.Done()
		sr, err := search.New()
		if err != nil {
			log.Printf("search.New error: %v", err)
			return
		}
		defer sr.Close()

		res, err := sr.SearchWithParams(models.SearchParams{
			Query:            "US stock market",
			MaxResults:       0,
			NewsCount:        8,
			EnableFuzzyQuery: true,
		})
		if err == nil {
			for _, n := range res.News {
				dashboard.AIDigest = append(dashboard.AIDigest, NewsDataset{
					Title:     n.Title,
					Publisher: n.Publisher,
					Link:      n.Link,
				})
			}
		}
	}()

	wg.Wait()

	// Fall back: Trending = Actives if no explicit trending source
	if len(dashboard.Trending) == 0 && len(dashboard.Actives) > 0 {
		dashboard.Trending = dashboard.Actives
	}

	return dashboard, nil
}

func mapScreenerQuote(q models.ScreenerQuote) QuoteData {
	return QuoteData{
		Symbol:    q.Symbol,
		ShortName: q.ShortName,
		Price:     q.RegularMarketPrice,
		ChangePct: q.RegularMarketChangePercent,
		Volume:    int64(q.RegularMarketVolume),
	}
}
