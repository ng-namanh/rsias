# Watchlist WebSocket Contract

The BFF broadcasts real-time ticker data filtered by the active watchlist to the frontend via the `/ws/watchlists` endpoint.

## Message Types

### 1. WatchlistTick (Outbound)
Real-time price update for a ticker in the active watchlist.

```json
{
  "type": "WATCHLIST_TICK",
  "payload": {
    "symbol": "AAPL",
    "price": 175.25,
    "change_pct": 1.25,
    "intelligence_score": 0.82,
    "timestamp": "2026-04-13T10:00:00Z"
  }
}
```

### 2. TickerRemoved (Outbound)
Notification to purge a ticker from the live view immediately.

```json
{
  "type": "TICKER_REMOVED",
  "payload": {
    "symbol": "TSLA"
  }
}
```

### 3. SetActiveWatchlist (Inbound)
Frontend command to switch the active filtering context.

```json
{
  "type": "SET_ACTIVE_WATCHLIST",
  "payload": {
    "watchlist_id": "uuid-v4-string"
  }
}
```
