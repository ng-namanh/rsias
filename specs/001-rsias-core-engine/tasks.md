# Tasks: RSIAS Core Engine

**Input**: Design documents from `/specs/001-rsias-core-engine/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are not explicitly requested as TDD in the spec, so implementation-integrated unit/integration tests are assumed as part of the tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and cross-language structure

- [X] T001 Create project structure (backend/, ai-worker/, frontend/, shared/proto/) per implementation plan
- [X] T002 Initialize Go module and basic dependencies in backend/go.mod
- [X] T003 Initialize Python environment and dependencies using `uv` in ai-worker/pyproject.toml
- [X] T004 Initialize React Vite project with TypeScript in frontend/
- [X] T005 [P] Define shared gRPC Protobuf contracts in shared/proto/market_data.proto

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Configure Docker Compose for Kafka, PostgreSQL (with TimescaleDB/pgvector), and Redis in docker-compose.yml
- [X] T007 Implement database migrations for Hypertables (ticks) and Vector columns (embeddings) in backend/migrations/
- [X] T008 [P] Implement Go Kafka producer utility in backend/internal/services/kafka_producer.go
- [X] T009 [P] Implement Python Kafka consumer base in ai-worker/src/shared/kafka_consumer.py
- [X] T010 [P] Implement Go gRPC server for internal service communication in backend/internal/grpc/server.go
- [X] T011 [P] Implement Redis client for caching price snapshots in backend/internal/services/redis_client.go

**Checkpoint**: Foundation ready - infrastructure services are live and internal communication is possible.

---

## Phase 3: User Story 1 - Real-time Price & News Monitoring (Priority: P1) 🎯 MVP

**Goal**: Ingest and display live stock prices and global news headlines on a real-time dashboard.

**Independent Test**: Connect to a simulated or real market data provider and verify the frontend dashboard updates prices and news feed without refreshing.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement Go WebSocket client for market data ingestion (Polygon/Finnhub) in backend/internal/services/market_stream.go
- [ ] T013 [P] [US1] Implement News ingestion service to pull global headlines in backend/internal/services/news_service.go
- [ ] T014 [US1] Implement Go WebSocket Manager (BFF) to broadcast ticks to connected clients in backend/cmd/bff/main.go
- [ ] T015 [P] [US1] Create React StockDashboard component with real-time price cards in frontend/src/components/StockDashboard.tsx
- [ ] T016 [P] [US1] Create React NewsFeed component for live headline streaming in frontend/src/components/NewsFeed.tsx
- [ ] T017 [US1] Implement WebSocket hook to connect frontend to Go BFF in frontend/src/hooks/useMarketStream.ts
- [ ] T018 [US1] Add persistent storage for market ticks using TimescaleDB Hypertables in backend/internal/models/ticker_model.go

**Checkpoint**: User Story 1 (MVP) is fully functional. Users can see live prices and news.

---

## Phase 4: User Story 2 - AI-Driven Sentiment & Impact Analysis (Priority: P1)

**Goal**: Analyze ingested news using an ensemble of LLMs to provide sentiment scores and impact rationales.

**Independent Test**: Ingest a sample news article and verify that a `SentimentReport` is generated and displayed on the dashboard for the relevant ticker.

### Implementation for User Story 2

- [ ] T019 [P] [US2] Implement Hybrid NER for ticker/entity mapping in ai-worker/src/ner/entity_extractor.py
- [ ] T020 [P] [US2] Implement Ensemble Sentiment Analyzer (DeBERTa/RoBERTa/FinBERT weights) in ai-worker/src/ensemble/sentiment_analyzer.py
- [ ] T021 [US2] Implement Python AI Worker to consume `news.ingested` and publish `analysis.sentiment` to Kafka in ai-worker/src/main.py
- [ ] T022 [US2] Implement Go consumer to store sentiment reports in PostgreSQL in backend/internal/services/sentiment_handler.go
- [ ] T023 [US2] Update React Dashboard to display sentiment indicators (Bullish/Bearish) on price cards in frontend/src/components/SentimentBadge.tsx

**Checkpoint**: AI Analysis is live. Raw news is automatically converted into sentiment signals on the dashboard.

---

## Phase 5: User Story 3 - Macroeconomic & Geopolitical Risk Evaluation (Priority: P2)

**Goal**: Use RAG to evaluate how national policies and geopolitical events affect specific stocks/sectors.

**Independent Test**: Query a stock and receive a "Risk Report" that cites specific retrieved policy documents or macro events.

### Implementation for User Story 3

- [ ] T024 [P] [US3] Implement RAG pipeline using LangChain and pgvector for semantic search in ai-worker/src/rag/risk_assessor.py
- [ ] T025 [US3] Implement Macro data ingestion worker to populate vector store in ai-worker/src/shared/macro_ingester.py
- [ ] T026 [US3] Implement gRPC endpoint in Go to request risk reports from Python in backend/internal/grpc/risk_service.go
- [ ] T027 [US3] Add "Policy Risk Report" modal/view to the frontend in frontend/src/components/RiskReport.tsx

**Checkpoint**: Deep analysis is available. Users can now see the "Why" behind market movements through a macro lens.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, monitoring, and documentation.

- [ ] T028 [P] Implement JWT authentication in API Gateway for secure WebSocket access in backend/cmd/gateway/main.go
- [ ] T029 [P] Implement Prometheus metrics for monitoring tick-to-UI latency in backend/internal/middleware/metrics.go
- [ ] T030 [P] Conduct performance audit on TimescaleDB compression settings in backend/migrations/optimize_storage.sql
- [ ] T031 [P] Finalize API documentation and run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - Start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 - Blocks all User Stories.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
  - US1 (P1) and US2 (P1) can proceed in parallel once the foundation is ready.
  - US3 (P2) depends on US2 components for news context but can start parallel research.
- **Polish (Final Phase)**: Depends on US1 and US2 completion.

### User Story Dependencies

- **User Story 1 (P1)**: The MVP base. No dependencies on other stories.
- **User Story 2 (P1)**: Depends on US1 for raw news ingestion.
- **User Story 3 (P2)**: Depends on the vector store initialized in Phase 2.

### Parallel Opportunities

- Phase 1 and Phase 2 tasks marked [P] are strictly independent.
- Once Phase 2 is done, the **Go Backend (US1)** and **Python AI Worker (US2)** can be developed in parallel by different developers.
- Frontend components in US1 (T015, T016) can be built in parallel with backend services (T012, T013).

---

## Parallel Example: User Story 1 & 2 (Team Mode)

```bash
# Developer A (Go):
Task: "Implement Go WebSocket client... in backend/internal/services/market_stream.go"
Task: "Implement News ingestion service... in backend/internal/services/news_service.go"

# Developer B (Python):
Task: "Implement Hybrid NER... in ai-worker/src/ner/entity_extractor.py"
Task: "Implement Ensemble Sentiment Analyzer... in ai-worker/src/ensemble/sentiment_analyzer.py"

# Developer C (Frontend):
Task: "Create React StockDashboard... in frontend/src/components/StockDashboard.tsx"
Task: "Create React NewsFeed... in frontend/src/components/NewsFeed.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (Phase 1).
2. Complete Foundation (Phase 2).
3. Complete US1 (Phase 3).
4. **STOP and VALIDATE**: Verify live price and news delivery to the UI.

### Incremental Delivery

1. Foundation ready (Phase 1 & 2).
2. Real-time Dashboard (US1).
3. AI Sentiment Signals (US2).
4. Macro Risk Reports (US3).
5. Final Hardening & Polish.

---

## Notes

- All tasks include specific file paths for LLM execution readiness.
- [P] tags identify where horizontal scaling of the development team is possible.
- Each user story phase ends with a clear Checkpoint for independent validation.
