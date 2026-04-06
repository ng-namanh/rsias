<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - I. Polyglot Microservices Architecture: Removed Node.js. Consolidated BFF and WebSocket management into Golang.
- Added sections: None
- Removed sections: None
- Templates requiring updates (✅ updated / ⚠ pending):
  - .specify/templates/plan-template.md (⚠ pending)
  - .specify/templates/spec-template.md (⚠ pending)
  - .specify/templates/tasks-template.md (⚠ pending)
- Follow-up TODOs:
  - Update Implementation Plan (001-rsias-core-engine) to reflect Go + Python model.
-->

# RSIAS Constitution
Real-time Stock Impact Assessment System

## Core Principles

### I. Polyglot Microservices Architecture
System components MUST be implemented using the language best suited for their performance profile:
- **Golang**: Mandatory for API Gateway, Auth, Backend-for-Frontend (BFF), and high-performance routing/WebSockets (Latency < 50ms).
- **Python**: Mandatory for AI/ML workloads, Sentiment Analysis, and LLM orchestration.
- **React Vite**: Mandatory for the User Interface to ensure high-performance rendering.

### II. Hybrid Communication Model
Inter-service communication MUST follow these protocols:
- **Apache Kafka**: The primary "neural system" for asynchronous, durable event streaming (Tick data, news feeds).
- **gRPC (Protobuf)**: Mandatory for internal, synchronous point-to-point service calls between Go and Python services.
- **Redis**: Used for in-memory caching of volatile data (price snapshots) and as a result-backend for long-running AI tasks.

### III. Unified & Optimized Data Strategy
All persistent data MUST reside within the PostgreSQL ecosystem to minimize architectural sprawl:
- **TimescaleDB**: MUST be used for all time-series data (Stock ticks, OHLCV, macro indicators).
- **pgvector**: MUST be used for vector embeddings to enable RAG (Retrieval-Augmented Generation) with hybrid SQL search.
- **ACID Compliance**: Data integrity is non-negotiable for financial records.

### IV. Real-time Precision & Low Latency
The system MUST prioritize speed and accuracy:
- **WebSockets**: Mandatory for market data ingestion and frontend updates; Go's high-concurrency model MUST be leveraged for these connections.
- **Latency Benchmarks**: Core routing and price updates MUST target sub-50ms latency.
- **Data Reliability**: Integration with multiple high-quality providers (Polygon.io, Finnhub, FactSet) is required for redundancy.

### V. Robust AI Pipeline (Hybrid & Ensemble)
AI-driven insights MUST prioritize precision over simplicity:
- **Hybrid NER**: Combine rule-based dictionaries with LLM-based context analysis to capture "moving targets" in financial reports.
- **Ensemble Sentiment**: Aggregate results from multiple specialized models (DeBERTa, RoBERTa, FinBERT) to reach ~80% accuracy.
- **RAG Architecture**: Always ground LLM outputs in real-time macroeconomic and policy data via vector search.

## Technology Stack & Infrastructure
- **Languages**: Golang 1.21+, Python 3.11+, TypeScript 5+ (Frontend only).
- **Data Store**: PostgreSQL 15+ with TimescaleDB and pgvector extensions.
- **Messaging**: Apache Kafka (or NATS for lightweight alternative) and gRPC.
- **UI Framework**: React with Vite and Tailwind CSS.
- **External Integrations**: Polygon.io, Finnhub, Alpha Vantage, FactSet, Finnworlds.

## Development Workflow & Quality Gates
- **SDD Compliance**: All features MUST follow the Spec-Driven Development workflow (Specify -> Plan -> Tasks -> Implement).
- **Testing**: Minimum 80% code coverage for core services; E2E tests for the real-time data pipeline.
- **Versioning**: Semantic Versioning (SemVer) applied to all microservices and internal APIs.

## Governance
This constitution is the supreme authority for technical decisions in RSIAS. Any deviation requires a documented justification and a formal amendment to this file. Compliance will be reviewed during every Architectural Review and PR cycle.

**Version**: 1.1.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
