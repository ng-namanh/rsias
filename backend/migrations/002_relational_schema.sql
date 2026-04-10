-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT,
    pe_ratio DECIMAL(10, 2),
    revenue_growth DECIMAL(5, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_companies_symbol ON companies(symbol);

-- News Categories Table
CREATE TABLE IF NOT EXISTS news_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    category_id UUID REFERENCES news_categories(id),
    source_name VARCHAR(100) NOT NULL,
    headline TEXT NOT NULL,
    content_summary TEXT,
    url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(published_at DESC);

-- News Intelligence Table
CREATE TABLE IF NOT EXISTS news_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_article_id UUID UNIQUE REFERENCES news_articles(id),
    sentiment_score DECIMAL(3, 2) NOT NULL,
    trust_score DECIMAL(5, 2) NOT NULL,
    rationale JSONB,
    confidence_level DECIMAL(3, 2),
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
