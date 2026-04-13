# Feature Specification: RSIAS Core Engine (MVP: Intelligence First)

**Feature Branch**: `001-rsias-core-engine`  
**Milestone**: 1 (MVP)  
**Status**: Approved (MVP Scope)  

## Overview
A news-centric intelligence platform that prioritizes high-signal data over raw market noise. The MVP focuses on analyzing news credibility (Trust Scoring), providing company context (Business Fundamentals), and visualizing global news intensity (Category Heatmap).

---

## User Scenarios & Testing

### User Story 1 - News Intelligence & Trust Scoring (Priority: P1)
As a financial analyst, I want to see an AI-generated **Trust Score** for each news article so that I can quickly filter out "fake news" or low-credibility sources.

**Acceptance Scenarios**:
1. **Given** a news article is ingested, **When** the AI worker processes it, **Then** it assigns a Trust Score (0-100) and a brief rationale.
2. **Given** a high-credibility source (e.g., Bloomberg), **When** analyzed, **Then** the Trust Score should reflect its historical reliability.

---

### User Story 2 - Fundamental Business Intelligence (Priority: P1)
As an investor, I want to see key company metrics (Market Cap, P/E, Debt/Equity) alongside related news so that I can evaluate the news within the context of the company's financial health.

**Acceptance Scenarios**:
1. **Given** I am viewing news for a specific ticker (e.g., AAPL), **When** the dashboard loads, **Then** the sidebar displays its current fundamental "Snapshot."
2. **Given** a news article mentions multiple companies, **When** selected, **Then** the fundamentals for those companies are easily accessible.

---

### User Story 3 - Global News Category Heatmap (Priority: P2)
As a portfolio manager, I want to see a **Global News Heatmap** categorizing recent news (e.g., Macro, Geopolitical, Tech, ESG) so that I can identify which sectors or themes are currently driving market sentiment.

**Acceptance Scenarios**:
1. **Given** the dashboard is open, **When** new articles arrive, **Then** the heatmap updates its intensity/color based on volume and sentiment in each category.
2. **Given** a category in the heatmap is clicked, **When** active, **Then** the news feed filters to show only articles in that category.

---

## Functional Requirements

- **FR-001: News Ingestion**: System MUST fetch news for a target list of tickers from at least one professional source (e.g., NewsAPI or Alpha Vantage).
- **FR-002: AI Intelligence Analysis**: System MUST use an LLM (e.g., GPT-4o-mini) to categorize news and generate both Sentiment and Trust scores.
- **FR-003: Fundamental Data Collection**: System MUST fetch and store core company fundamentals (Market Cap, P/E Ratio, Revenue Growth).
- **FR-004: Real-time Broadcasting**: System MUST stream "Enriched News" (Headline + Sentiment + Trust + Category) to the frontend via WebSockets.
- **FR-005: Relational Persistence**: System MUST store all companies, articles, and AI assessments in a PostgreSQL relational database.

---

## Relational Data Model

### Entities
- **Companies**: `id`, `symbol`, `name`, `sector`, `industry`, `market_cap`, `pe_ratio`, `revenue_growth`, `updated_at`.
- **NewsCategories**: `id`, `name` (e.g., 'Macro', 'Geopolitical', 'Tech'), `description`.
- **NewsArticles**: `id`, `company_id`, `category_id`, `source_name`, `headline`, `content_summary`, `url`, `published_at`.
- **NewsIntelligence**: `id`, `news_article_id`, `sentiment_score` (-1 to 1), `trust_score` (0-1), `rationale`, `confidence_level`.

---

## Success Criteria

- **SC-001**: AI-generated Trust Score aligns with expert credibility assessment in >80% of test cases.
- **SC-002**: Company fundamental data is updated at least once every 24 hours.
- **SC-003**: Dashboard renders the Global News Heatmap with sub-2s initial load time.
- **SC-004**: News-to-UI latency (including AI analysis) is under 5 seconds for 90% of articles.

---

## Technical Constraints & Assumptions
- **API Limits**: MVP will use free/developer tier APIs, which may limit the number of tickers tracked (Target: 10-20 tickers).
- **AI Model**: Primary analysis will use a single LLM API call to balance cost and speed for the MVP.
- **Database**: PostgreSQL 15+ will be the primary data store.
