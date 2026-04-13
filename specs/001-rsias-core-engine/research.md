# Research: RSIAS Core Engine (MVP: Intelligence First)

## 1. Trust Scoring Algorithm
- **Decision**: Use a structured prompt for the LLM (GPT-4o-mini) that evaluates four weighted dimensions: Source Reliability (30%), Content Consistency (20%), Factual Grounding (30%), and Bias Detection (20%).
- **Rationale**: A single-call structured output ensures low latency while maintaining a multi-dimensional view of "trust."
- **Alternatives considered**: Multi-agent consensus (rejected for MVP due to latency/cost); Rule-based scoring (rejected for lack of nuance).

## 2. News Categorization Taxonomy
- **Decision**: Implement a fixed 6-category taxonomy: `Macro`, `Geopolitical`, `Sector-Specific`, `Earnings/Corporate`, `Legal/Regulatory`, and `Innovation/Tech`.
- **Rationale**: This covers >90% of financial news impact areas and provides enough granularity for a meaningful Heatmap.
- **Alternatives considered**: Dynamic clustering (too complex for MVP); Broad labels (Macro/Micro - too vague).

## 3. External API Polling Strategy
- **Decision**: Implement a "Staggered Polling" mechanism in Go. Fetch fundamentals once every 24h; poll news every 2-5 minutes across the 20-ticker set to stay within free-tier rate limits (e.g., 500 requests/day).
- **Rationale**: Minimizes "Rate Limit Exceeded" errors while keeping the "Real-time" feel.
- **Alternatives considered**: Continuous streaming (not available on free tiers).

## 4. Go & PostgreSQL (UUID/JSONB)
- **Decision**: Use `google/uuid` for ID generation and `jackc/pgx/v5` for high-performance PostgreSQL interaction. Store the AI rationale as a `TEXT` or `JSONB` field depending on whether we need to query internal rationale components later.
- **Rationale**: `pgx` is the idiomatic high-performance driver for Go; UUIDs ensure distributed ID safety.
