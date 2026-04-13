# Portfolio WebSocket Contract

The BFF broadcasts real-time portfolio updates to the frontend via the `/ws/portfolio` endpoint.

## Message Types

### 1. PortfolioUpdate (Outbound)
Sent whenever prices or balances change.

```json
{
  "type": "PORTFOLIO_UPDATE",
  "payload": {
    "total_value_usd": 12450.75,
    "pnl_24h_usd": 450.25,
    "pnl_24h_pct": 3.75,
    "holdings": [
      {
        "symbol": "BTC",
        "amount": 0.25,
        "price_usd": 45000.0,
        "value_usd": 11250.0,
        "change_24h_pct": 2.5
      }
    ]
  },
  "timestamp": "2026-04-13T10:00:00Z"
}
```

### 2. ConnectionStatus (Outbound)
Status updates for individual exchange APIs.

```json
{
  "type": "CONNECTION_STATUS",
  "payload": {
    "exchange": "Binance",
    "status": "SYNCING",
    "last_sync": "2026-04-13T09:55:00Z"
  }
}
```

### 3. Subscribe (Inbound)
Frontend requests updates for a specific user session.

```json
{
  "type": "SUBSCRIBE",
  "payload": {
    "user_id": "uuid-v4-string"
  }
}
```
