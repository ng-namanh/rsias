# Quickstart: RSIAS Core Engine

## Prerequisites
- Docker & Docker Compose
- Golang 1.21+
- Python 3.11+ (with `uv` or `pip`)
- PostgreSQL 15+ (with TimescaleDB and pgvector extensions)
- Apache Kafka

## Environment Setup
1. **Infrastructure**:
   ```bash
   docker-compose up -d postgres kafka redis
   ```
2. **Database Migration**:
   Run the migrations in `backend/migrations` to set up Hypertables and vector columns.

## Local Development
### 1. Backend Service (Golang)
```bash
cd backend
go mod download
# Run Gateway
go run cmd/gateway/main.go
# Run BFF/WebSocket Manager
go run cmd/bff/main.go
```

### 2. AI Worker (Python)
```bash
cd ai-worker
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
python main.py
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Verifying the Setup
- **API Health**: `curl http://localhost:8080/health`
- **WebSocket Stream**: Connect to `ws://localhost:4000/v1/stream` (BFF) to see live ticks.
- **AI Inference**: Check logs in `ai-worker` to ensure sentiment analysis is firing on `news.ingested` Kafka topics.
