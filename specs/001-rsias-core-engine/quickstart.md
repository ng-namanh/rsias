# Quickstart: RSIAS Core Engine (MVP)

## Prerequisites
- **Docker & Docker-Compose**: For PostgreSQL, Kafka, and Redis.
- **Go 1.21+**: For backend services.
- **Python 3.11+**: For the AI worker.
- **Bun/Node.js**: For the React frontend.
- **API Keys**:
    - `ALPHA_VANTAGE_API_KEY`: For news and fundamentals.
    - `OPENAI_API_KEY`: For intelligence analysis.

## Infrastructure Setup
```bash
docker-compose up -d
```

## Backend Services (Go)
1. **Initialize Database**:
   ```bash
   cd backend && go run cmd/migrate/main.go
   ```
2. **Start Ingestion Producer**:
   ```bash
   cd backend && go run cmd/producer/main.go
   ```
3. **Start BFF (WebSocket)**:
   ```bash
   cd backend && go run cmd/bff/main.go
   ```

## AI Worker (Python)
1. **Setup Virtual Env**:
   ```bash
   cd ai-worker && uv sync
   ```
2. **Start Intelligence Worker**:
   ```bash
   cd ai-worker && uv run src/intelligence_worker.py
   ```

## Frontend (React)
1. **Install Dependencies**:
   ```bash
   cd frontend && bun install
   ```
2. **Start Dev Server**:
   ```bash
   cd frontend && bun dev
   ```

## Verification
- Open `http://localhost:5173` to view the dashboard.
- Check Kafka topics for data flow:
  ```bash
  docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic news.enriched --from-beginning
  ```
