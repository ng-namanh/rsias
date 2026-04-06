-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Market Ticks Table (TimescaleDB Hypertable)
CREATE TABLE IF NOT EXISTS ticks (
    time TIMESTAMPTZ NOT NULL,
    ticker TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL
);

-- Convert to hypertable
SELECT create_hypertable('ticks', 'time', if_not_exists => TRUE);

-- Sentiment Reports Table
CREATE TABLE IF NOT EXISTS sentiment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id TEXT NOT NULL,
    ticker TEXT NOT NULL,
    sentiment_score FLOAT NOT NULL,
    rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Macro Risk Reports Table (with Vector Embedding)
CREATE TABLE IF NOT EXISTS macro_risk_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker TEXT NOT NULL,
    report_content TEXT NOT NULL,
    risk_score FLOAT NOT NULL,
    embedding vector(384), -- Dimension for common sentence-transformers
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ticks_ticker_time ON ticks (ticker, time DESC);
CREATE INDEX IF NOT EXISTS idx_sentiment_ticker ON sentiment_reports (ticker);
CREATE INDEX IF NOT EXISTS idx_risk_ticker ON macro_risk_reports (ticker);
