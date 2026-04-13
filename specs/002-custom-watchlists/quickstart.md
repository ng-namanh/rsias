# Quickstart: Custom Watchlists

Follow these steps to set up and verify the Custom Watchlists feature.

## Prerequisites
- **RSIAS Infrastructure**: Postgres, Kafka, and Redis must be running (`docker-compose up -d`).
- **Core Engine**: Ensure the market data producer is running and streaming tickers.

## Backend Setup
1. **Migrations**: Apply the watchlist-specific migrations.
   ```bash
   cd backend && go run cmd/migrate/main.go
   ```
2. **Start Persistence Service**:
   ```bash
   cd backend && go run cmd/persistence/main.go
   ```
3. **Start BFF (WebSocket Manager)**:
   ```bash
   cd backend && go run cmd/bff/main.go
   ```

## Frontend Setup
1. **Install Dependencies**:
   ```bash
   cd frontend && bun install
   ```
2. **Start Dev Server**:
   ```bash
   cd frontend && bun dev
   ```
3. **Navigate to Dashboard**: Open `http://localhost:5173/watchlists`.

## Verification Steps
- **Create Watchlist**: Click "New Watchlist", name it "Tech", and verify it is saved.
- **Add Tickers**: Add "AAPL", "MSFT", and "NVDA" to the "Tech" watchlist.
- **Switch Active**: Set "Tech" as the active watchlist. Verify the dashboard feed only shows these 3 tickers.
- **Real-time Updates**: Verify price and intelligence scores update in real-time for the active tickers.
- **Persistence**: Refresh the browser and verify your "Tech" watchlist and its tickers are still present.
