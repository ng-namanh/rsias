# Quickstart: Real-time Portfolio Tracking Dashboard

Follow these steps to set up and verify the Portfolio Dashboard feature.

## Prerequisites
- **RSIAS Infrastructure**: Postgres, Kafka, and Redis must be running (`docker-compose up -d`).
- **Exchange API Keys**: Obtain read-only API keys from Binance and/or Coinbase for testing.

## Backend Setup
1. **Migrations**: Apply the portfolio-specific migrations.
   ```bash
   cd backend && go run cmd/migrate/main.go
   ```
2. **Start Portfolio Service**:
   ```bash
   cd backend && go run cmd/portfolio/main.go
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
3. **Navigate to Dashboard**: Open `http://localhost:5173/portfolio`.

## Verification Steps
- **Connect Exchange**: Use the "Add Connection" button and provide your API keys. Verify the status changes from "SYNCING" to "ACTIVE".
- **Live Updates**: Open the dashboard side-by-side with an exchange price chart. Verify the "Total Value" and "Live P&L" update within 2 seconds of price movements.
- **Aggregation**: Connect a second exchange. Verify the "Holdings" list correctly merges assets from both sources.
