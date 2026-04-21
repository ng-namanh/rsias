---
name: go-yfinance 
description: use this skill when you need to fetch financial data from yahoo finance using go. 
user-invocable: false
---
# Go YFinance

Go YFinance is an unofficial Go port of the popular Python yfinance library, providing native Go access to Yahoo Finance data. It offers comprehensive financial data retrieval including historical prices, company information, financial statements, options chains, and real-time streaming. The library features TLS fingerprint spoofing via CycleTLS to bypass Yahoo's bot detection, automatic cookie/crumb authentication with CSRF fallback for EU users, and thread-safe concurrent operations.

The library is designed with a modular architecture supporting multiple data access patterns: single ticker operations, batch downloads for multiple symbols, stock screening with predefined and custom queries, market status information, sector/industry analysis, and economic calendars. All modules are thread-safe and include automatic caching with configurable TTL to minimize API calls.

API Document reference: https://wnjoon.github.io/go-yfinance/API/ 

## Installation

```bash
go get github.com/wnjoon/go-yfinance
```

## Ticker - Single Stock Data Access

The Ticker module provides comprehensive access to individual stock data including quotes, historical prices, company information, financial statements, options, and more.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/ticker"
)

func main() {
    // Create a ticker instance
    t, err := ticker.New("AAPL")
    if err != nil {
        log.Fatal(err)
    }
    defer t.Close()

    // Get current quote
    quote, err := t.Quote()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("AAPL: $%.2f (%+.2f%%)\n",
        quote.RegularMarketPrice,
        quote.RegularMarketChangePercent)

    // Get company info
    info, err := t.Info()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Company: %s\n", info.LongName)
    fmt.Printf("Sector: %s\n", info.Sector)
    fmt.Printf("Industry: %s\n", info.Industry)
    fmt.Printf("Market Cap: $%d\n", info.MarketCap)
    fmt.Printf("52-Week High: $%.2f\n", info.FiftyTwoWeekHigh)
    fmt.Printf("52-Week Low: $%.2f\n", info.FiftyTwoWeekLow)
    // Output:
    // AAPL: $178.50 (+1.25%)
    // Company: Apple Inc.
    // Sector: Technology
    // Industry: Consumer Electronics
    // Market Cap: $2800000000000
    // 52-Week High: $199.62
    // 52-Week Low: $164.08
}
```

## Historical Data - OHLCV Prices

Fetch historical OHLCV (Open, High, Low, Close, Volume) data with configurable periods, intervals, and adjustments for splits/dividends.

```go
package main

import (
    "fmt"
    "log"
    "time"

    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/ticker"
)

func main() {
    t, err := ticker.New("MSFT")
    if err != nil {
        log.Fatal(err)
    }
    defer t.Close()

    // Method 1: Using period string
    bars, err := t.History(models.HistoryParams{
        Period:     "1mo",      // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        Interval:   "1d",       // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
        AutoAdjust: true,       // Adjust prices for splits/dividends
        Actions:    true,       // Include dividend and split data
        PrePost:    false,      // Exclude pre/post market data
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Last 5 trading days:")
    for _, bar := range bars[len(bars)-5:] {
        fmt.Printf("%s: O=%.2f H=%.2f L=%.2f C=%.2f V=%d\n",
            bar.Date.Format("2006-01-02"),
            bar.Open, bar.High, bar.Low, bar.Close, bar.Volume)
    }

    // Method 2: Using specific date range
    start := time.Now().AddDate(0, -3, 0)
    end := time.Now()
    rangeBars, err := t.HistoryRange(start, end, "1d")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\n3-month history: %d bars\n", len(rangeBars))

    // Method 3: Convenience method for period
    yearBars, err := t.HistoryPeriod("1y")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("1-year history: %d bars\n", len(yearBars))
    // Output:
    // Last 5 trading days:
    // 2024-01-15: O=378.50 H=380.25 L=377.10 C=379.80 V=22500000
    // 2024-01-16: O=379.80 H=381.50 L=378.00 C=380.15 V=21800000
    // ...
}
```

## Dividends and Stock Splits

Retrieve dividend payment history and stock split information.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/ticker"
)

func main() {
    t, err := ticker.New("AAPL")
    if err != nil {
        log.Fatal(err)
    }
    defer t.Close()

    // Get dividend history
    dividends, err := t.Dividends()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Recent Dividends:")
    for _, div := range dividends[len(dividends)-4:] {
        fmt.Printf("%s: $%.4f\n", div.Date.Format("2006-01-02"), div.Amount)
    }

    // Get stock split history
    splits, err := t.Splits()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nStock Splits:")
    for _, split := range splits {
        fmt.Printf("%s: %s\n", split.Date.Format("2006-01-02"), split.Ratio)
    }

    // Get combined actions (dividends + splits)
    actions, err := t.Actions()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\nTotal: %d dividends, %d splits\n",
        len(actions.Dividends), len(actions.Splits))
    // Output:
    // Recent Dividends:
    // 2024-02-09: $0.2400
    // 2024-05-10: $0.2500
    // 2024-08-12: $0.2500
    // 2024-11-08: $0.2500
    //
    // Stock Splits:
    // 2020-08-31: 4:1
    // 2014-06-09: 7:1
}
```

## Financial Statements

Access income statements, balance sheets, and cash flow statements with annual or quarterly frequency.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/ticker"
)

func main() {
    t, err := ticker.New("GOOGL")
    if err != nil {
        log.Fatal(err)
    }
    defer t.Close()

    // Income Statement (annual)
    income, err := t.IncomeStatement("annual")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Income Statement (Annual):")
    if revenue, ok := income.GetLatest("TotalRevenue"); ok {
        fmt.Printf("  Total Revenue: $%.0f\n", revenue)
    }
    if netIncome, ok := income.GetLatest("NetIncome"); ok {
        fmt.Printf("  Net Income: $%.0f\n", netIncome)
    }

    // Balance Sheet (quarterly)
    balance, err := t.BalanceSheet("quarterly")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nBalance Sheet (Quarterly):")
    if assets, ok := balance.GetLatest("TotalAssets"); ok {
        fmt.Printf("  Total Assets: $%.0f\n", assets)
    }
    if cash, ok := balance.GetLatest("CashAndCashEquivalents"); ok {
        fmt.Printf("  Cash: $%.0f\n", cash)
    }

    // Cash Flow Statement
    cashFlow, err := t.CashFlow("annual")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nCash Flow (Annual):")
    if opCash, ok := cashFlow.GetLatest("OperatingCashFlow"); ok {
        fmt.Printf("  Operating Cash Flow: $%.0f\n", opCash)
    }
    if fcf, ok := cashFlow.GetLatest("FreeCashFlow"); ok {
        fmt.Printf("  Free Cash Flow: $%.0f\n", fcf)
    }
    // Output:
    // Income Statement (Annual):
    //   Total Revenue: $307394000000
    //   Net Income: $73795000000
    //
    // Balance Sheet (Quarterly):
    //   Total Assets: $402392000000
    //   Cash: $24048000000
    //
    // Cash Flow (Annual):
    //   Operating Cash Flow: $101746000000
    //   Free Cash Flow: $69495000000
}
```

## Options Chain

Retrieve options data including expiration dates, strike prices, calls, and puts.

```go
package main

import (
    "fmt"
    "log"
    "time"

    "github.com/wnjoon/go-yfinance/pkg/ticker"
)

func main() {
    t, err := ticker.New("NVDA")
    if err != nil {
        log.Fatal(err)
    }
    defer t.Close()

    // Get available expiration dates
    expirations, err := t.Options()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Available Expirations:")
    for _, exp := range expirations[:5] {
        fmt.Printf("  %s\n", exp.Format("2006-01-02"))
    }

    // Get option chain for nearest expiration
    chain, err := t.OptionChain("")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\nOption Chain (expires %s):\n", chain.Expiration.Format("2006-01-02"))
    fmt.Printf("Underlying: $%.2f\n", chain.Underlying.RegularMarketPrice)

    // Display top 5 calls
    fmt.Println("\nTop 5 Calls:")
    for i, call := range chain.Calls {
        if i >= 5 {
            break
        }
        fmt.Printf("  Strike: $%.2f, Last: $%.2f, Bid: $%.2f, Ask: $%.2f, IV: %.2f%%\n",
            call.Strike, call.LastPrice, call.Bid, call.Ask, call.ImpliedVolatility*100)
    }

    // Display top 5 puts
    fmt.Println("\nTop 5 Puts:")
    for i, put := range chain.Puts {
        if i >= 5 {
            break
        }
        fmt.Printf("  Strike: $%.2f, Last: $%.2f, Bid: $%.2f, Ask: $%.2f, IV: %.2f%%\n",
            put.Strike, put.LastPrice, put.Bid, put.Ask, put.ImpliedVolatility*100)
    }

    // Get option chain for specific date
    specificChain, err := t.OptionChainAtExpiry(time.Now().AddDate(0, 1, 0))
    if err == nil {
        fmt.Printf("\nOptions for %s: %d calls, %d puts\n",
            specificChain.Expiration.Format("2006-01-02"),
            len(specificChain.Calls), len(specificChain.Puts))
    }
    // Output:
    // Available Expirations:
    //   2024-01-19
    //   2024-01-26
    //   2024-02-02
    //   2024-02-09
    //   2024-02-16
    //
    // Option Chain (expires 2024-01-19):
    // Underlying: $547.50
    //
    // Top 5 Calls:
    //   Strike: $200.00, Last: $348.50, Bid: $347.00, Ask: $350.00, IV: 125.50%
    // ...
}
```

## Multi-Ticker Downloads

Download historical data for multiple symbols efficiently with parallel processing.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/multi"
)

func main() {
    // Method 1: Download with symbol slice
    result, err := multi.Download([]string{"AAPL", "MSFT", "GOOGL", "AMZN"}, &models.DownloadParams{
        Period:   "1mo",
        Interval: "1d",
        Threads:  4,  // Parallel downloads
    })
    if err != nil {
        log.Fatal(err)
    }

    for symbol, bars := range result.Data {
        fmt.Printf("%s: %d bars, last close: $%.2f\n",
            symbol, len(bars), bars[len(bars)-1].Close)
    }

    // Check for errors
    for symbol, err := range result.Errors {
        fmt.Printf("Error for %s: %v\n", symbol, err)
    }

    // Method 2: Download from string
    result2, err := multi.DownloadString("TSLA META NFLX", nil)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\nDownloaded %d symbols from string\n", len(result2.Symbols))

    // Method 3: Using Tickers class for more control
    tickers, err := multi.NewTickers([]string{"JPM", "BAC", "WFC"})
    if err != nil {
        log.Fatal(err)
    }
    defer tickers.Close()

    // Access individual ticker
    jpm := tickers.Get("JPM")
    info, _ := jpm.Info()
    fmt.Printf("\n%s: %s\n", jpm.Symbol(), info.LongName)

    // Download history for all tickers
    history, err := tickers.History(&models.DownloadParams{
        Period:   "3mo",
        Interval: "1wk",
    })
    if err != nil {
        log.Fatal(err)
    }
    for symbol, bars := range history.Data {
        fmt.Printf("%s: %d weekly bars\n", symbol, len(bars))
    }
    // Output:
    // AAPL: 22 bars, last close: $178.50
    // MSFT: 22 bars, last close: $380.15
    // GOOGL: 22 bars, last close: $141.80
    // AMZN: 22 bars, last close: $155.20
    //
    // Downloaded 3 symbols from string
    //
    // JPM: JPMorgan Chase & Co.
    // JPM: 13 weekly bars
    // BAC: 13 weekly bars
    // WFC: 13 weekly bars
}
```

## Stock Screener

Screen stocks using predefined screeners or custom queries with validation.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/screener"
)

func main() {
    s, err := screener.New()
    if err != nil {
        log.Fatal(err)
    }
    defer s.Close()

    // Predefined screener: Day gainers
    gainers, err := s.DayGainers(10)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Today's Top Gainers:")
    for _, q := range gainers.Quotes {
        fmt.Printf("  %s: $%.2f (+%.2f%%)\n",
            q.Symbol, q.RegularMarketPrice, q.RegularMarketChangePercent)
    }

    // Predefined screener: Most actives
    actives, err := s.MostActives(10)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nMost Active Stocks:")
    for _, q := range actives.Quotes {
        fmt.Printf("  %s: %d shares traded\n", q.Symbol, q.RegularMarketVolume)
    }

    // Custom query: US tech stocks with price > $50 and market cap > $10B
    q1, _ := models.NewEquityQuery("eq", []any{"region", "us"})
    q2, _ := models.NewEquityQuery("eq", []any{"sector", "Technology"})
    q3, _ := models.NewEquityQuery("gt", []any{"intradayprice", 50})
    q4, _ := models.NewEquityQuery("gt", []any{"intradaymarketcap", 10000000000})
    query, _ := models.NewEquityQuery("and", []any{q1, q2, q3, q4})

    customResult, err := s.ScreenWithQuery(query, &models.ScreenerParams{
        Count:     25,
        SortField: "intradaymarketcap",
        SortAsc:   false,
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\nLarge Cap Tech Stocks (>$50): %d results\n", customResult.Total)
    for _, q := range customResult.Quotes[:5] {
        fmt.Printf("  %s: $%.2f, Cap: $%dB\n",
            q.Symbol, q.RegularMarketPrice, q.MarketCap/1000000000)
    }

    // Fund screener: Top mutual funds
    funds, err := s.Screen(models.ScreenerTopMutualFunds, &models.ScreenerParams{Count: 5})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nTop Mutual Funds:")
    for _, f := range funds.Quotes {
        fmt.Printf("  %s: %s (Rating: %d/5)\n",
            f.Symbol, f.ShortName, f.PerformanceRatingOverall)
    }
    // Output:
    // Today's Top Gainers:
    //   XYZ: $45.20 (+15.30%)
    //   ABC: $28.75 (+12.80%)
    // ...
    //
    // Most Active Stocks:
    //   TSLA: 125000000 shares traded
    //   NVDA: 98000000 shares traded
    // ...
    //
    // Large Cap Tech Stocks (>$50): 245 results
    //   AAPL: $178.50, Cap: $2800B
    //   MSFT: $380.15, Cap: $2850B
    // ...
}
```

## Search and Lookup

Search for ticker symbols, company names, and filter by instrument type.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/lookup"
    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/search"
)

func main() {
    // Search for symbols
    s, err := search.New()
    if err != nil {
        log.Fatal(err)
    }
    defer s.Close()

    result, err := s.SearchWithParams(models.SearchParams{
        Query:            "electric vehicle",
        MaxResults:       10,
        NewsCount:        5,
        EnableFuzzyQuery: true,
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Search Results for 'electric vehicle':")
    for _, q := range result.Quotes {
        fmt.Printf("  %s: %s (%s - %s)\n",
            q.Symbol, q.ShortName, q.Exchange, q.QuoteType)
    }

    fmt.Println("\nRelated News:")
    for _, n := range result.News {
        fmt.Printf("  %s: %s\n", n.Publisher, n.Title)
    }

    // Lookup by instrument type
    l, err := lookup.New("bitcoin")
    if err != nil {
        log.Fatal(err)
    }
    defer l.Close()

    // Find cryptocurrencies only
    cryptos, err := l.Cryptocurrency(10)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nCryptocurrency Results:")
    for _, doc := range cryptos {
        fmt.Printf("  %s: %s ($%.2f)\n",
            doc.Symbol, doc.Name, doc.RegularMarketPrice)
    }

    // Find ETFs only
    etfs, err := l.ETF(5)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nETF Results:")
    for _, doc := range etfs {
        fmt.Printf("  %s: %s\n", doc.Symbol, doc.Name)
    }
    // Output:
    // Search Results for 'electric vehicle':
    //   TSLA: Tesla, Inc. (NMS - EQUITY)
    //   RIVN: Rivian Automotive, Inc. (NMS - EQUITY)
    //   LCID: Lucid Group, Inc. (NMS - EQUITY)
    // ...
    //
    // Related News:
    //   Reuters: Tesla announces new EV factory
    // ...
    //
    // Cryptocurrency Results:
    //   BTC-USD: Bitcoin USD ($43250.50)
    //   BTC-EUR: Bitcoin EUR ($39850.25)
    // ...
}
```

## Market Status and Summary

Get market opening hours, timezone information, and index summaries.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/market"
    "github.com/wnjoon/go-yfinance/pkg/models"
)

func main() {
    // US Market
    m, err := market.New("us_market")
    if err != nil {
        log.Fatal(err)
    }
    defer m.Close()

    // Get market status
    status, err := m.Status()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("US Market Status:")
    if status.Open != nil {
        fmt.Printf("  Opens: %s\n", status.Open.Format("2006-01-02 15:04 MST"))
    }
    if status.Close != nil {
        fmt.Printf("  Closes: %s\n", status.Close.Format("2006-01-02 15:04 MST"))
    }
    if status.Timezone != nil {
        fmt.Printf("  Timezone: %s (%s)\n", status.Timezone.Long, status.Timezone.Short)
    }

    // Check if market is open
    isOpen, err := m.IsOpen()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("  Currently Open: %v\n", isOpen)

    // Get market summary (major indices)
    summary, err := m.Summary()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nMajor Indices:")
    for _, item := range summary {
        fmt.Printf("  %s (%s): %.2f (%+.2f%%)\n",
            item.ShortName, item.Symbol,
            item.RegularMarketPrice, item.RegularMarketChangePercent)
    }

    // Other markets using predefined constant
    jpMarket, err := market.NewWithPredefined(models.MarketJP)
    if err != nil {
        log.Fatal(err)
    }
    defer jpMarket.Close()
    jpStatus, _ := jpMarket.Status()
    fmt.Printf("\nJapan Market Timezone: %s\n", jpStatus.Timezone.Short)
    // Output:
    // US Market Status:
    //   Opens: 2024-01-15 09:30 EST
    //   Closes: 2024-01-15 16:00 EST
    //   Timezone: Eastern Standard Time (EST)
    //   Currently Open: true
    //
    // Major Indices:
    //   S&P 500 (^GSPC): 4783.35 (+0.85%)
    //   Dow Jones (^DJI): 37592.98 (+0.62%)
    //   NASDAQ (^IXIC): 14972.76 (+1.12%)
}
```

## Sector and Industry Data

Retrieve sector-level and industry-level financial data including top companies, market weights, and research reports.

```go
package main

import (
    "fmt"
    "log"

    "github.com/wnjoon/go-yfinance/pkg/industry"
    "github.com/wnjoon/go-yfinance/pkg/models"
    "github.com/wnjoon/go-yfinance/pkg/sector"
)

func main() {
    // Sector data
    s, err := sector.NewWithPredefined(models.SectorTechnology)
    if err != nil {
        log.Fatal(err)
    }
    defer s.Close()

    data, err := s.Data()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Sector: %s\n", data.Name)
    fmt.Printf("  Companies: %d\n", data.Overview.CompaniesCount)
    fmt.Printf("  Industries: %d\n", data.Overview.IndustriesCount)
    fmt.Printf("  Market Weight: %.2f%%\n", data.Overview.MarketWeight*100)

    // Top companies in sector
    fmt.Println("\nTop Companies:")
    for _, c := range data.TopCompanies[:5] {
        fmt.Printf("  %s: %s (Weight: %.2f%%)\n",
            c.Symbol, c.Name, c.MarketWeight*100)
    }

    // Industries within sector
    fmt.Println("\nIndustries:")
    for _, ind := range data.Industries[:5] {
        fmt.Printf("  %s: %.2f%% market weight\n", ind.Name, ind.MarketWeight*100)
    }

    // Industry-specific data
    ind, err := industry.New("semiconductors")
    if err != nil {
        log.Fatal(err)
    }
    defer ind.Close()

    indData, err := ind.Data()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("\nIndustry: %s (in %s)\n", indData.Name, indData.SectorName)
    fmt.Printf("  Companies: %d\n", indData.Overview.CompaniesCount)

    // Top performing companies
    performers, err := ind.TopPerformingCompanies()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nTop Performers (YTD):")
    for _, c := range performers[:3] {
        fmt.Printf("  %s: YTD %.2f%%, Target: $%.2f\n",
            c.Symbol, c.YTDReturn*100, c.TargetPrice)
    }

    // Top growth companies
    growth, err := ind.TopGrowthCompanies()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nTop Growth Companies:")
    for _, c := range growth[:3] {
        fmt.Printf("  %s: Growth Est: %.2f%%\n", c.Symbol, c.GrowthEstimate*100)
    }
    // Output:
    // Sector: Technology
    //   Companies: 760
    //   Industries: 8
    //   Market Weight: 28.50%
    //
    // Top Companies:
    //   AAPL: Apple Inc. (Weight: 7.25%)
    //   MSFT: Microsoft Corporation (Weight: 7.10%)
    // ...
    //
    // Industry: Semiconductors (in Technology)
    //   Companies: 92
    //
    // Top Performers (YTD):
    //   NVDA: YTD 245.50%, Target: $625.00
    // ...
}
```

## Economic Calendars

Access earnings, IPO, economic events, and stock splits calendars.

```go
package main

import (
    "fmt"
    "log"
    "time"

    "github.com/wnjoon/go-yfinance/pkg/calendars"
    "github.com/wnjoon/go-yfinance/pkg/models"
)

func main() {
    // Create calendars instance with date range
    cal, err := calendars.New(
        calendars.WithDateRange(
            time.Now(),
            time.Now().AddDate(0, 0, 14), // Next 2 weeks
        ),
    )
    if err != nil {
        log.Fatal(err)
    }
    defer cal.Close()

    // Earnings calendar
    earnings, err := cal.Earnings(&models.CalendarOptions{Limit: 10})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Upcoming Earnings:")
    for _, e := range earnings {
        fmt.Printf("  %s (%s): EPS Est: $%.2f",
            e.Symbol, e.CompanyName, e.EPSEstimate)
        if e.EventTime != nil {
            fmt.Printf(" on %s", e.EventTime.Format("Jan 2"))
        }
        fmt.Println()
    }

    // IPO calendar
    ipos, err := cal.IPOs(&models.CalendarOptions{Limit: 5})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nUpcoming IPOs:")
    for _, ipo := range ipos {
        fmt.Printf("  %s: %s, Price Range: $%.2f-$%.2f\n",
            ipo.Symbol, ipo.CompanyName, ipo.PriceFrom, ipo.PriceTo)
    }

    // Economic events calendar
    events, err := cal.EconomicEvents(&models.CalendarOptions{Limit: 10})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nEconomic Events:")
    for _, e := range events {
        fmt.Printf("  %s (%s): Expected: %.2f, Last: %.2f\n",
            e.Event, e.Region, e.Expected, e.Last)
    }

    // Stock splits calendar
    splits, err := cal.Splits(&models.CalendarOptions{Limit: 5})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("\nUpcoming Splits:")
    for _, s := range splits {
        fmt.Printf("  %s (%s): %s\n", s.Symbol, s.CompanyName, s.Ratio)
    }
    // Output:
    // Upcoming Earnings:
    //   AAPL (Apple Inc.): EPS Est: $2.10 on Jan 25
    //   MSFT (Microsoft Corporation): EPS Est: $2.78 on Jan 30
    // ...
    //
    // Upcoming IPOs:
    //   XYZ: XYZ Corp, Price Range: $18.00-$21.00
    // ...
    //
    // Economic Events:
    //   CPI (US): Expected: 3.20, Last: 3.40
    //   Unemployment Rate (US): Expected: 3.70, Last: 3.70
    // ...
}
```

## Real-Time WebSocket Streaming

Subscribe to real-time price updates via WebSocket streaming.

```go
package main

import (
    "fmt"
    "log"
    "time"

    "github.com/wnjoon/go-yfinance/pkg/live"
    "github.com/wnjoon/go-yfinance/pkg/models"
)

func main() {
    ws, err := live.New(
        live.WithHeartbeatInterval(15*time.Second),
        live.WithReconnectDelay(3*time.Second),
        live.WithErrorHandler(func(err error) {
            log.Printf("WebSocket error: %v\n", err)
        }),
    )
    if err != nil {
        log.Fatal(err)
    }
    defer ws.Close()

    // Subscribe to symbols
    err = ws.Subscribe([]string{"AAPL", "MSFT", "GOOGL", "TSLA"})
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Subscribed to:", ws.Subscriptions())

    // Start listening asynchronously
    err = ws.ListenAsync(func(data *models.PricingData) {
        fmt.Printf("[%s] %s: $%.2f (Vol: %d)\n",
            time.Now().Format("15:04:05"),
            data.ID,
            data.Price,
            data.DayVolume)
    })
    if err != nil {
        log.Fatal(err)
    }

    // Run for 30 seconds
    fmt.Println("Listening for 30 seconds...")
    time.Sleep(30 * time.Second)

    // Add more symbols dynamically
    ws.Subscribe([]string{"NVDA", "AMD"})
    time.Sleep(10 * time.Second)

    // Unsubscribe from some symbols
    ws.Unsubscribe([]string{"TSLA"})
    time.Sleep(10 * time.Second)

    fmt.Println("Done")
    // Output:
    // Subscribed to: [AAPL MSFT GOOGL TSLA]
    // Listening for 30 seconds...
    // [14:30:05] AAPL: $178.52 (Vol: 45230000)
    // [14:30:05] MSFT: $380.18 (Vol: 22150000)
    // [14:30:06] GOOGL: $141.82 (Vol: 18760000)
    // [14:30:06] TSLA: $248.35 (Vol: 85420000)
    // ...
}
```

## Configuration

Configure global settings for timeouts, retries, caching, and proxy.

```go
package main

import (
    "fmt"
    "time"

    "github.com/wnjoon/go-yfinance/pkg/config"
)

func main() {
    // Get global configuration
    cfg := config.Get()

    // Chain configuration methods
    cfg.SetTimeout(60*time.Second).
        SetMaxRetries(5).
        SetRetryDelay(2*time.Second).
        SetMaxConcurrent(20).
        SetDebug(true)

    // Enable caching with 10-minute TTL
    cfg.EnableCache(10 * time.Minute)

    // Set proxy (optional)
    cfg.SetProxy("http://proxy.example.com:8080")

    // Custom JA3 fingerprint (optional)
    cfg.SetJA3("771,4865-4866-4867...")

    // Check current settings
    fmt.Printf("Timeout: %v\n", cfg.GetTimeout())
    fmt.Printf("Debug: %v\n", cfg.IsDebug())
    fmt.Printf("Cache Enabled: %v\n", cfg.IsCacheEnabled())

    // Create custom config for specific use case
    customCfg := config.NewDefault().
        SetTimeout(120*time.Second).
        SetMaxRetries(10)

    // Clone configuration
    clonedCfg := cfg.Clone()
    clonedCfg.SetDebug(false)

    // Reset global config to defaults
    config.Reset()
    // Output:
    // Timeout: 1m0s
    // Debug: true
    // Cache Enabled: true
}
```

## Summary

Go YFinance provides a comprehensive suite of tools for accessing Yahoo Finance data in Go applications. The library supports both synchronous and asynchronous operations, with all modules being thread-safe for concurrent use. Key use cases include building trading bots, financial analysis tools, portfolio trackers, market research applications, and real-time price monitoring systems. The modular design allows developers to use only the components they need while maintaining consistent error handling and resource management patterns.

Integration is straightforward with the standard Go module system. Each module follows a consistent pattern: create an instance with `New()`, use `defer Close()` for cleanup, and call methods to fetch data. The library handles authentication automatically, caches responses where appropriate, and provides comprehensive error types for robust error handling. For high-throughput applications, the multi-ticker download functionality with configurable thread pools and the WebSocket streaming API enable efficient bulk data retrieval and real-time updates respectively.
