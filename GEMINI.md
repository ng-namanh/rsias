# RSIAS Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-10

## Active Technologies

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
- 001-rsias-core-engine: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

- **001-rsias-core-engine**: Initial architecture defined. Removed Node.js, consolidated real-time logic into Golang.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
