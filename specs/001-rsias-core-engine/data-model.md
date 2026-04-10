# Data Model: RSIAS Core Engine (MVP: Intelligence First)

**Milestone**: 1 (MVP)  
**Type**: Relational (PostgreSQL 15+)  

## Relational Schema (PostgreSQL)

### 1. `companies`
Stores core identity and fundamental health of tracked companies.
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'AAPL', 'NVDA'
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT, -- In USD
    pe_ratio DECIMAL(10, 2),
    revenue_growth DECIMAL(5, 2), -- Percentage
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_companies_symbol ON companies(symbol);
```

### 2. `news_categories`
Classification buckets for the News Heatmap.
```sql
CREATE TABLE news_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Macro', 'Geopolitical', 'Sector-Specific', etc.
    description TEXT
);
-- Initial Seed: Macro, Geopolitical, Sector-Specific, Earnings/Corporate, Legal/Regulatory, Innovation/Tech
```

### 3. `news_articles`
Raw ingested news articles.
```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    category_id UUID REFERENCES news_categories(id),
    source_name VARCHAR(100) NOT NULL, -- 'Reuters', 'Bloomberg', 'NewsAPI'
    headline TEXT NOT NULL,
    content_summary TEXT,
    url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_news_articles_published ON news_articles(published_at DESC);
```

### 4. `news_intelligence`
AI-generated analysis for each article.
```sql
CREATE TABLE news_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_article_id UUID UNIQUE REFERENCES news_articles(id),
    sentiment_score DECIMAL(3, 2) NOT NULL, -- Range: -1.0 (Bearish) to 1.0 (Bullish)
    trust_score DECIMAL(5, 2) NOT NULL,     -- Range: 0.0 to 100.0
    rationale JSONB,                        -- Detailed breakdown: source_reputation, consistency, factual_grounding
    confidence_level DECIMAL(3, 2),          -- Range: 0.0 to 1.0
    model_version VARCHAR(50),               -- 'gpt-4o-mini'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Validation Rules
- **Company Symbols**: Must be 1-10 uppercase alphanumeric characters.
- **Sentiment Scores**: Clipped to [-1.0, 1.0].
- **Trust Scores**: Clipped to [0.0, 100.0].
- **Published At**: Cannot be in the future.
