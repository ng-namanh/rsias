# Implementation Plan: RSIAS Core Engine (MVP: Intelligence First)

**Branch**: `001-rsias-core-engine` | **Date**: 2026-04-09 | **Spec**: [specs/001-rsias-core-engine/spec.md]
**Input**: Feature specification from `specs/001-rsias-core-engine/spec.md`

## Summary
The "Intelligence First" MVP delivers a high-signal news platform. It utilizes a Go-based ingestion and real-time broadcasting layer combined with a Python AI pipeline for news categorization and trust scoring. The system persists data in a relational PostgreSQL schema and visualizes market intelligence through a React-based Global News Heatmap and Enriched News Feed.

## Technical Context

**Language/Version**: Go 1.21+, Python 3.11+, TypeScript 5+
**Primary Dependencies**: `gorilla/websocket`, `segmentio/kafka-go`, `jackc/pgx/v5` (Go); `openai`, `confluent-kafka` (Python); `React`, `Vite`, `Tailwind CSS` (Frontend)
**Storage**: PostgreSQL 15+ (TimescaleDB, pgvector)
**Testing**: `go test`, `pytest`, `bun test`
**Target Platform**: Linux/Docker
**Project Type**: Real-time AI Intelligence Platform
**Performance Goals**: News-to-UI latency < 5s; Heatmap load < 2s
**Constraints**: Free-tier API limits (Alpha Vantage/NewsAPI); Single-call LLM analysis
**Scale/Scope**: 10-20 primary tickers; 5,000+ concurrent WebSocket connections

## Constitution Check

*GATE: Passed. Architecture aligns with Go/Python polyglot and Kafka-centric principles.*

1. **Polyglot Architecture**: PASS (Go for BFF/WebSockets, Python for AI).
2. **Hybrid Communication**: PASS (Kafka for ingestion, WebSockets for UI).
3. **Unified Data Strategy**: PASS (PostgreSQL/TimescaleDB/pgvector).
4. **Real-time Precision**: PASS (Go WebSockets).
5. **Robust AI Pipeline**: PASS (LLM-based Trust & Sentiment scoring).

## Project Structure

### Documentation (this feature)

```text
specs/001-rsias-core-engine/
├── plan.md              # This file
├── research.md          # Research findings (Trust Algorithm, API Polling)
├── data-model.md        # Relational schema (Companies, News, Intelligence)
├── quickstart.md        # Setup guide
├── contracts/           # Interface definitions
│   ├── frontend_ws.json
│   └── fundamentals_api.json
└── tasks.md             # Implementation tasks (Next Step)
```

### Source Code

```text
backend/
├── cmd/
│   ├── bff/             # WebSocket broadcasting & API Gateway
│   ├── producer/        # News & Fundamentals ingestion (Go)
│   └── migrate/         # DB schema migrations
├── internal/
│   ├── models/          # Relational Go structs
│   └── services/        # Kafka consumers & persistence workers
└── tests/

ai-worker/
├── src/
│   ├── intelligence_worker.py # AI Pipeline (Categorization, Trust Scoring)
│   └── shared/
└── tests/

frontend/
├── src/
│   ├── components/      # Heatmap, NewsFeed, FundamentalsSidebar
│   ├── hooks/           # useMarketStream, useFundamentals
│   └── store/           # Redux/Zustand for intelligence state
└── tests/

shared/
└── proto/               # gRPC definitions (if needed for Phase 2)
```

**Structure Decision**: Polyglot Monorepo. Decoupled services (Ingestion, AI, BFF) communicate via Kafka topics, ensuring scalability and fault tolerance.

## Implementation Phases

### Phase 0: Research (DONE)
- Resolved Trust Scoring logic, API polling strategy, and DB driver selection.

### Phase 1: Design & Contracts (DONE)
- Defined relational schema, WebSocket contracts, and REST endpoints.

### Phase 2: Implementation (NEXT)
- Initialize PostgreSQL schema.
- Implement Go news producer with staggered polling.
- Implement Python intelligence worker with GPT-4o-mini.
- Develop React Heatmap and Enriched News components.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Kafka for MVP | Real-time decoupled processing | Simple HTTP callbacks lack durability and easy multi-consumer scaling. |
| PostgreSQL JSONB | Storing AI rationale metadata | Flattening fields would make rationale updates rigid and schema-heavy. |
