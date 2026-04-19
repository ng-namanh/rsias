# RSIAS Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-13

## Active Technologies
- Golang 1.21+ (Backend/BFF), TypeScript 5+ (Frontend/React) + `github.com/segmentio/kafka-go` (Kafka), `google.golang.org/grpc` (gRPC), `shadcn/ui`, `recharts` (for P&L visualization) (003-realtime-portfolio-dashboard)
- PostgreSQL 15+ (TimescaleDB for portfolio snapshots), Redis (volatile session/price cache) (003-realtime-portfolio-dashboard)
- Golang 1.21+ (Backend), TypeScript 5+ (Frontend) + `github.com/segmentio/kafka-go` (for ticker streams), `shadcn/ui` (for UI composition) (002-custom-watchlists)
- PostgreSQL 15+ (Relational storage for Watchlist/WatchlistTicker), Redis (caching active watchlist state) (002-custom-watchlists)

- **Backend (Core/Real-time)**: Golang 1.21+
- **AI/ML Services**: Python 3.11+
- **Frontend**: React (Vite) + TypeScript 5+
- **Data Stores**: PostgreSQL 15+ (TimescaleDB, pgvector), Redis
- **Messaging**: Apache Kafka, gRPC (Protobuf)

## Project Structure

```text
backend/ (Golang)
├── cmd/
│   ├── gateway/ (API Gateway + Auth)
│   └── bff/ (WebSocket Manager + Data Aggregator)
├── internal/
│   ├── models/
│   ├── services/
│   └── grpc/
└── tests/

ai-worker/ (Python)
├── src/
│   ├── ensemble/
│   ├── rag/
│   └── ner/
└── tests/

frontend/ (React Vite)
├── src/
│   ├── components/
│   ├── store/
│   └── hooks/
└── tests/

shared/
└── proto/ (gRPC Definitions)
```

## Commands

### Infrastructure
- `docker-compose up -d`: Start Postgres, Kafka, and Redis.

### Backend (Go)
- `cd backend && go run cmd/gateway/main.go`: Start the API Gateway.
- `cd backend && go run cmd/bff/main.go`: Start the BFF/WebSocket manager.
- `cd backend && go test ./...`: Run backend tests.

### AI Worker (Python)
- `cd ai-worker && uv run main.py`: Start the AI worker.
- `cd ai-worker && pytest`: Run AI service tests.

### Frontend (React)
- `cd frontend && bun dev`: Start the development server.
- `cd frontend && bun test`: Run frontend tests.

## Code Style

- **Golang**: Follow standard `go fmt` and idiomatic Go practices. Use `uber-go/guide` where applicable.
- **Python**: Follow PEP 8 and use type hints. `ruff` for linting.
- **Frontend**: Functional components with React hooks, strict TypeScript types.
- **Protobuf**: Use `buf` for linting and generating code.

## Recent Changes
- 002-custom-watchlists: Added Golang 1.21+ (Backend), TypeScript 5+ (Frontend) + `github.com/segmentio/kafka-go` (for ticker streams), `shadcn/ui` (for UI composition)
- 003-realtime-portfolio-dashboard: Added Golang 1.21+ (Backend/BFF), TypeScript 5+ (Frontend/React) + `github.com/segmentio/kafka-go` (Kafka), `google.golang.org/grpc` (gRPC), `shadcn/ui`, `recharts` (for P&L visualization)
- 001-rsias-core-engine: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
