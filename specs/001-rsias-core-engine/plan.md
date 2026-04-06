# Implementation Plan: RSIAS Core Engine

**Branch**: `001-rsias-core-engine` | **Date**: 2026-04-07 | **Spec**: [specs/001-rsias-core-engine/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-rsias-core-engine/spec.md`

## Summary
Implement a high-performance, two-language microservices system for real-time stock and news analysis. The system uses Golang for all core backend logic, including API Gateway, Authentication, and the Backend-for-Frontend (BFF) WebSocket management. Python is dedicated to the AI/NLP pipeline, including ensemble sentiment and RAG-based risk assessment.

## Technical Context

**Language/Version**: 
- **Golang**: 1.21+ (API Gateway, BFF, WebSockets, Core Logic)
- **Python**: 3.11+ (AI/NLP/RAG Pipelines)
- **React**: (Vite) Frontend
**Primary Dependencies**: 
- **Messaging**: Apache Kafka (Durable event streaming)
- **Communication**: gRPC (Protobuf), WebSockets (Go-native)
- **AI Models**: DeBERTa, RoBERTa, FinBERT (Ensemble)
- **RAG**: LangChain
**Storage**: 
- **Primary**: PostgreSQL 15+ (TimescaleDB for time-series, pgvector for vector embeddings)
- **Caching**: Redis (Price snapshots, Result backend)
**Testing**: 
- **Go**: go test
- **Python**: pytest
- **React**: vitest
**Target Platform**: Kubernetes / Cloud Native
**Project Type**: Polyglot Microservices System (Go + Python)
**Performance Goals**: < 100ms P95 tick-to-UI latency; sub-3s for complex AI reports.
**Constraints**: Sub-50ms core routing; ACID compliance for financial records.
**Scale/Scope**: 5,000+ concurrent users; Global market data ingestion.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Polyglot Compliance**: Go handles all routing/WebSockets; Python handles AI. Node.js removed.
- [x] **Communication Compliance**: Kafka is used for async streaming; gRPC for internal sync calls between Go and Python.
- [x] **Storage Compliance**: PostgreSQL (TimescaleDB + pgvector) is the primary store; Redis for caching.
- [x] **AI Alignment**: Hybrid NER and Ensemble Sentiment strategies adopted.

## Project Structure

### Documentation (this feature)

```text
specs/001-rsias-core-engine/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

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

**Structure Decision**: Consolidated Go backend with separate entry points for Gateway and BFF/WebSocket management. AI services remain isolated in Python.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
