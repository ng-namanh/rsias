# Research: Custom Watchlists

This research document resolves technical unknowns for the Custom Watchlist feature, ensuring alignment with RSIAS performance and real-time standards.

## Decision 1: Real-time Ticker Filtering
- **Decision**: Perform filtering in the Go BFF (Backend-for-Frontend) layer.
- **Rationale**: The BFF already manages WebSocket connections. Filtering here ensures only the relevant subset of Kafka-streamed ticker data is sent over the wire to the frontend, saving client-side bandwidth and processing.
- **Alternatives Considered**: Frontend-side filtering (rejected due to excessive data transfer for large global feeds).

## Decision 2: Active Watchlist State Management
- **Decision**: Store the `active_watchlist_id` in the user's browser `localStorage` and synchronized via a Redis session if needed.
- **Rationale**: LocalStorage provides an immediate UI update on reload. Redis ensures consistency if the user switches devices or opens multiple tabs.

## Decision 3: Watchlist Persistence Strategy
- **Decision**: Standard relational mapping in PostgreSQL with a unique constraint on `(user_id, watchlist_name)`.
- **Rationale**: Relational integrity is required for the Watchlist-to-Ticker relationship. Unique names prevent user confusion.

## Decision 4: Handling Deleted Tickers in Active Feed
- **Decision**: When a ticker is removed from an active watchlist, the BFF will send a specific `TICKER_REMOVED` WebSocket event.
- **Rationale**: This allows the frontend to immediately purge the ticker from the view without a full watchlist reload.

## Decision 5: Watchlist Limits Enforcement
- **Decision**: Enforce limits (10 watchlists, 20 tickers) at both the Frontend (UI feedback) and Backend (API validation) layers.
- **Rationale**: Ensures data integrity and prevents performance degradation from oversized watchlists.

## Best Practices Identified
- **Go BFF**: Use a map-based cache in the BFF session to track the set of active ticker symbols for each connected user.
- **React UI**: Use shadcn/ui "Dialog" for the creation flow and "DataTable" for the ticker list to maintain design consistency.
- **Concurrency**: Use Go's `sync.RWMutex` to protect the user's active ticker list during WebSocket broadcasts.
