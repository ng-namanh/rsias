# Research: RSIAS Core Engine

## Decision: Messaging Infrastructure (Kafka vs. NATS)
- **Decision**: Apache Kafka
- **Rationale**: RSIAS.md explicitly defines Kafka as the "neural system" for durable event streaming, replayability, and massive throughput. Given the goal of 95% ticks under 100ms and global news ingestion, Kafka's partitioning and horizontal scalability are essential.
- **Alternatives considered**: NATS JetStream (Lower operational overhead but less ecosystem maturity for heavy financial data replay/durability compared to Kafka).

## Decision: AI Sentiment Ensemble Strategy
- **Decision**: Weighted Average Ensemble
- **Rationale**: Combining DeBERTa (high accuracy), RoBERTa, and FinBERT (financial domain specificity) reduces individual model bias. We will use a weighted average based on validation set performance (approx. 40% DeBERTa, 30% FinBERT, 30% RoBERTa).
- **Alternatives considered**: Simple majority vote (less precise), Meta-learner (overkill for initial engine).

## Decision: TimescaleDB Partitioning Strategy
- **Decision**: Range Partitioning by Time (Daily) + Hash Partitioning by Ticker
- **Rationale**: Most queries will be time-bounded (last 24h, last week) or ticker-specific. Daily chunks ensure efficient data retention and compression (Hypercore).
- **Alternatives considered**: Global partitioning (too slow for high-volume tick data).

## Decision: RAG Implementation
- **Decision**: LangChain (Python) + pgvector
- **Rationale**: LangChain has the best ecosystem for RAG pipelines. Using pgvector as the vector store avoids "architectural sprawl" as mandated by the constitution.
- **Alternatives considered**: LlamaIndex (Excellent, but LangChain's generic integration with Kafka/Redis workers is preferred here).
