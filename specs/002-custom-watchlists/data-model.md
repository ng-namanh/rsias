# Data Model: Custom Watchlists

This document outlines the core entities and relationships for the custom watchlist feature, ensuring data integrity across the RSIAS microservices.

## Entities

### 1. Watchlist (PostgreSQL)
Represents a user-created collection of tickers.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key to User |
| `name` | String(50) | Unique name for the user's watchlist |
| `is_active` | Boolean | Whether this is the currently monitored watchlist |
| `created_at`| Timestamp | Creation time |
| `updated_at`| Timestamp | Last modification time |

**Constraints**:
- `UNIQUE (user_id, name)`: A user cannot have two watchlists with the same name.

### 2. WatchlistTicker (PostgreSQL)
Represents the many-to-many relationship between watchlists and tickers.

| Field | Type | Description |
|-------|------|-------------|
| `watchlist_id` | UUID | Foreign Key to Watchlist (Composite PK Part 1) |
| `ticker_symbol`| String(10) | The asset ticker (e.g., "AAPL") (Composite PK Part 2) |
| `added_at` | Timestamp | When the ticker was added to this watchlist |

**Constraints**:
- `PRIMARY KEY (watchlist_id, ticker_symbol)`: Prevents duplicate tickers in a single watchlist.
- `MAX 20` tickers per `watchlist_id` (enforced by application logic).

## Relationships
- **User (1) → (N) Watchlist**: A user can own up to 10 watchlists.
- **Watchlist (1) → (N) WatchlistTicker**: A watchlist contains multiple tickers.

## Validation Rules
- **Name**: Must be non-empty and at most 50 characters.
- **Ticker Limit**: Each watchlist must have between 0 and 20 tickers.
- **Watchlist Limit**: Each user must have between 0 and 10 watchlists.
