# Data Model: Real-time Portfolio Tracking Dashboard

This document outlines the core entities and relationships for the portfolio dashboard, ensuring data integrity across the polyglot microservices.

## Entities

### 1. ExchangeConnection (PostgreSQL)
Represents a user's link to an external cryptocurrency exchange.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key to User |
| `exchange_name` | String | e.g., "Binance", "Coinbase" |
| `api_key_enc` | Bytea | AES-256-GCM encrypted API Key |
| `api_secret_enc`| Bytea | AES-256-GCM encrypted API Secret |
| `status` | Enum | ACTIVE, INVALID, SYNCING, ERROR |
| `last_sync_at` | Timestamp | Last successful data fetch |

### 2. PortfolioHolding (PostgreSQL)
Current state of a specific asset within a user's portfolio.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key to User |
| `exchange_id` | UUID | Foreign Key to ExchangeConnection |
| `asset_symbol` | String | e.g., "BTC", "ETH" |
| `amount` | Decimal | Total balance on the exchange |
| `cost_basis_usd`| Decimal | Original value at time of purchase |
| `last_updated` | Timestamp | Last balance update from exchange |

### 3. PortfolioSnapshot (TimescaleDB)
Time-series data for P&L visualization and historical performance tracking.

| Field | Type | Description |
|-------|------|-------------|
| `time` | Timestamp | **Primary Dimension** (Hypertable) |
| `user_id` | UUID | Dimension |
| `total_value_usd`| Decimal | Sum of all holdings in USD |
| `daily_pnl_usd` | Decimal | Absolute P&L change in 24h |
| `daily_pnl_pct` | Decimal | Percentage P&L change in 24h |

## Relationships
- **User (1) → (N) ExchangeConnection**: A user can connect multiple exchange accounts.
- **ExchangeConnection (1) → (N) PortfolioHolding**: Each connection provides multiple asset balances.
- **User (1) → (N) PortfolioSnapshot**: Aggregated snapshots are stored periodically for historical P&L.

## Validation Rules
- **API Credentials**: MUST be encrypted before persistence.
- **Holdings**: Amount MUST be non-negative.
- **Snapshots**: MUST be generated at least once per hour for active users.
