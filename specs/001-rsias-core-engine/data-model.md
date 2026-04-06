# Data Model: RSIAS Core Engine

## PostgreSQL Entities

### StockTicker (TimescaleDB Hypertable)
Represents the core market data for a security.
- **id**: UUID (Primary Key)
- **symbol**: TEXT (Indexed, e.g., 'AAPL')
- **exchange**: TEXT
- **price**: NUMERIC (Precision for currency)
- **volume**: BIGINT
- **timestamp**: TIMESTAMPTZ (Partitioning Key)
- **industry**: TEXT
- **Relationships**: Parent of `SentimentReport` (1:N by symbol/timestamp window).

### NewsArticle (PostgreSQL + pgvector)
Represents a financial news item with its semantic representation.
- **id**: UUID (Primary Key)
- **title**: TEXT
- **content**: TEXT
- **source**: TEXT (e.g., 'FactSet', 'NewsAPI')
- **published_at**: TIMESTAMPTZ
- **embedding**: VECTOR(1536) (pgvector for RAG, 1536 dimensions for OpenAI or similar LLM)
- **metadata**: JSONB (Stores related ticker symbols, tags)
- **Relationships**: Linked to `SentimentReport` (1:1 per article/stock pair).

### SentimentReport (PostgreSQL)
Represents the consolidated AI assessment.
- **id**: UUID (Primary Key)
- **article_id**: UUID (Foreign Key -> NewsArticle)
- **ticker_symbol**: TEXT
- **score**: DECIMAL (Range -1.0 to 1.0)
- **label**: TEXT (BULLISH, BEARISH, NEUTRAL)
- **rationale**: TEXT
- **ensemble_weights**: JSONB (Weights used for DeBERTa/RoBERTa/FinBERT)
- **confidence**: DECIMAL
- **created_at**: TIMESTAMPTZ

### MacroEvent (PostgreSQL + pgvector)
Represents a high-level policy or geopolitical event.
- **id**: UUID (Primary Key)
- **event_type**: TEXT (POLICY, GEOPOLITICAL, MONETARY)
- **region**: TEXT
- **description**: TEXT
- **embedding**: VECTOR(1536) (pgvector for semantic search)
- **impact_level**: TEXT (LOW, MEDIUM, HIGH)
- **affected_sectors**: TEXT[] (Array of industry sectors)
- **occurred_at**: TIMESTAMPTZ

## Redis (In-Memory Structures)
- **ticker:price:{symbol}**: Latest price snapshot (TTL: 5 minutes)
- **ai:task:{task_id}**: Result backend for long-running ensemble analysis.
- **session:{user_id}**: Active user session data.

## Kafka Topics
- **market.ticks**: Raw tick-level price data.
- **news.ingested**: Raw news articles ready for NLP.
- **analysis.sentiment**: Generated sentiment reports for real-time push.
- **macro.updates**: Policy/macro event updates for RAG ingestion.
