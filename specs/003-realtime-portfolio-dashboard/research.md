# Research: Real-time Portfolio Tracking Dashboard

This research document resolves technical unknowns for the Portfolio Dashboard feature, ensuring alignment with RSIAS performance and security standards.

## Decision 1: Exchange Support (Initial Scope)
- **Decision**: Support Binance (v3 REST/WS) and Coinbase (v3 Advanced Trade API) for the MVP.
- **Rationale**: These represent the highest volume and most standardized APIs. Binance provides excellent WebSocket support for ticker data, which aligns with our real-time requirement.
- **Alternatives Considered**: Kraken (considered secondary due to less frequent ticker updates in free tier).

## Decision 2: Historical P&L Data Strategy
- **Decision**: Implement a "Seed and Snapshot" approach.
- **Rationale**: Fetch historical trades upon initial connection to calculate the cost basis (P1). Thereafter, take a daily snapshot using TimescaleDB to build the historical chart.
- **Alternatives Considered**: Fetching full history on every load (rejected due to API rate limits).

## Decision 3: P&L Calculation Methodology
- **Decision**: Rolling 24-Hour Change for primary display; "Cumulative P&L" since connection for secondary.
- **Rationale**: Rolling 24h provides immediate feedback on market volatility, which is the primary "real-time" hook. Cumulative P&L requires cost-basis calculation from trade history.

## Decision 4: Secure Credential Storage
- **Decision**: Use AES-256-GCM (Go `crypto/cipher`) with a master key stored in an environment variable.
- **Rationale**: GCM provides both encryption and integrity checking.
- **Alternatives Considered**: Storing keys in plain text (rejected) or using external Vault (overkill for v1).

## Decision 5: Real-time Frontend Visualization
- **Decision**: Use `recharts` with a fixed-length data buffer in a custom React hook (`usePortfolioStream`).
- **Rationale**: Recharts handles dynamic updates well if the data array is updated via `requestAnimationFrame` or controlled state intervals.
- **Alternatives Considered**: `D3.js` (too complex for this dashboard) or `Chart.js` (standard, but `recharts` is more idiomatic with React components).

## Best Practices Identified
- **Go Microservices**: Implement a common `ExchangeClient` interface to allow for easy addition of future exchanges (Polymorphism).
- **Kafka Strategy**: Produce "Portfolio Snapshot" events to a dedicated Kafka topic to allow the `bff` to serve different dashboard views.
- **Rate Limiting**: Use a token bucket algorithm to respect exchange API limits per user account.
